import express from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

function getGoogleClient() {
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(";").forEach(cookie => {
        let [name, ...rest] = cookie.split("=");
        name = name?.trim();
        if (!name) return;
        const value = rest.join("=").trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });
    return list;
}

authRouter.get("/google", async (req, res) => {
    try {
        const state = crypto.randomBytes(16).toString("hex");
        const nonce = crypto.randomBytes(16).toString("hex");
        const codeVerifier = crypto.randomBytes(32).toString("base64url");
        
        const codeChallenge = crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest("base64url");

        const cookieValue = JSON.stringify({ state, nonce, codeVerifier });
        
        // short-lived (5 min) httpOnly, sameSite=lax cookie
        res.cookie("oauth_state", cookieValue, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            // secure: true // if we had https in local
        });

        const client = getGoogleClient();
        const authorizeUrl = client.generateAuthUrl({
            access_type: "offline",
            scope: ["openid", "email", "profile"],
            state: state,
            nonce: nonce,
            code_challenge: codeChallenge,
            code_challenge_method: "S256"
        });

        res.redirect(authorizeUrl);
    } catch (e) {
        console.error(e);
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
});

authRouter.get("/google/callback", async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    try {
        const cookies = parseCookies(req.headers.cookie);
        const oauthStateStr = cookies.oauth_state;

        if (!oauthStateStr) {
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }

        const oauthState = JSON.parse(oauthStateStr);
        const { state: cookieState, nonce: cookieNonce, codeVerifier } = oauthState;
        
        res.clearCookie("oauth_state");

        const { code, state } = req.query;

        if (state !== cookieState) {
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }

        const client = getGoogleClient();
        
        const { tokens } = await client.getToken({
            code: code,
            codeVerifier: codeVerifier
        });

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (payload.nonce !== cookieNonce) {
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
        
        if (!payload.email_verified) {
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
        
        const email = payload.email;
        let user = await User.findOne({ email: email });
        
        if (user) {
            if (user.role === "admin") {
                return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
            }
            if (user.isBlocked) {
                return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
            }
            
            // Link google account
            if (!user.googleId) {
                user.googleId = payload.sub;
                user.authProvider = "google";
                await user.save();
            }
        } else {
            // create one with role forced to "customer"
            user = new User({
                email: email,
                firstName: payload.given_name || "Unknown",
                lastName: payload.family_name || "Unknown",
                profilePicture: payload.picture || "https://i.pinimg.com/736x/e1/e1/af/e1e1af3435004e297bc6067d2448f8e5.jpg",
                role: "customer",
                address: "Not provided",
                phone: "Not provided",
                authProvider: "google",
                googleId: payload.sub
            });
            await user.save();
        }

        // Issue JWT
        const token = jwt.sign({
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            profilePicture : user.profilePicture,
            role : user.role,
            phone : user.phone
        }, process.env.JWT_SECRET);

        res.redirect(`${frontendUrl}/oauth/callback#token=${token}`);

    } catch (e) {
        console.error(e);
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
});

export default authRouter;
