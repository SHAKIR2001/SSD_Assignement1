import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function hasOwnField(object, field) {
    return Object.prototype.hasOwnProperty.call(object, field);
}

function getRegistrationData(body) {
    const { email, password, firstName, lastName, address, phone } = body;

    return { email, password, firstName, lastName, address, phone };
}

function hasMissingRegistrationFields(data) {
    return Object.values(data).some((value) => value === undefined || value === null || value === "");
}

async function createUser(data, role) {
    const newUser = new User({
        ...data,
        password: bcrypt.hashSync(data.password, 10),
        role
    });

    await newUser.save();
}

//validate the user data before saving to the database
export async function registerUser(req, res) {
    const requestBody = req.body ?? {};

    // Role assignment is never allowed through the public registration endpoint.
    // Rejecting it (instead of silently ignoring it) makes attempted privilege
    // escalation explicit to the client and easier to audit/test.
    if (hasOwnField(requestBody, "role")) {
        return res.status(400).json({
            error: "The role field is not allowed during registration"
        });
    }

    const data = getRegistrationData(requestBody);

    // Validate required fields before processing
    if (hasMissingRegistrationFields(data)) {
        return res.status(400).json({
            error: "All required fields must be provided"
        });
    }

    try {
        await createUser(data, "customer");
        return res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error) {
        const status = error?.code === 11000 ? 409 : 500;
        return res.status(status).json({
            error: status === 409 ? "A user with this email already exists" : "User registration failed"
        });
    }
}

// Admin accounts must be created by an already authenticated administrator.
// The requested role is not trusted here either; this endpoint always creates an admin.
export async function registerAdmin(req, res) {
    if (!isItADMIN(req)) {
        return res.status(403).json({
            error: "Only an administrator can create another administrator"
        });
    }

    const data = getRegistrationData(req.body ?? {});

    if (hasMissingRegistrationFields(data)) {
        return res.status(400).json({
            error: "All required fields must be provided"
        });
    }

    try {
        await createUser(data, "admin");
        return res.status(201).json({
            message: "Administrator registered successfully"
        });
    } catch (error) {
        const status = error?.code === 11000 ? 409 : 500;
        return res.status(status).json({
            error: status === 409 ? "A user with this email already exists" : "Administrator registration failed"
        });
    }
}

export function loginUser(req,res){
    const data = req.body;

    User.findOne({
        email : data.email
    }).then(
        (user)=>{ //email porundhum user irundhal andha user in ella data waiyum (user) inkul save seyyappadum
            if (user == null){
                res.status(404).json({
                    error : "User not found"
                })
            }else{
               const isPassowrdCorrect = bcrypt.compareSync(data.password,user.password);

               if(user.isBlocked){
                res.status(403).json({message : "Your account is blocked , please contact admin"})
                return;
               } 

                if (isPassowrdCorrect){
                    const token = jwt.sign({
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        profilePicture : user.profilePicture,
                        role : user.role,
                        phone : user.phone
                    }, process.env.JWT_SECRET)
                    res.json({
                        message : "Login successful" , token : token , user : user           
                    })
                }else{
                    res.json({
                        error : "login failed"
                    })
                }
            }
        }
    )
}

export function isItADMIN(req){
    let isAdmin = false;

    if(req.user != null){
        if(req.user.role == "admin"){
            isAdmin = true
        }
    }

    return isAdmin
}

export function isItCustomer(req){
    let isCustomer = false;

    if(req.user != null){
        if(req.user.role == "customer"){
            isCustomer = true
        }
    }

    return isCustomer;
}

export async function getAllUsers(req,res){
try{
    
    if(!isItADMIN(req)){
        res.status(403).json({
            message : "You are not authorized to perfrom this action"
            
        })
        return
    }

    const users = await User.find()
    res.json(users)

}catch(e){
    res.status(500).json({
        message : "Cannot get the users"
    })
}

}

export async function blockOrUnblockUser(req,res){
    const email = req.params.email;

    if(isItADMIN(req)){
    try{
        const user = await User.findOne({ email : email })

        if(user == null){
            res.status(404).json({
                error : "User not found"
            })
        }

        const isBlocked = !user.isBlocked

        await User.updateOne({
            email : email
        },
        {
            isBlocked : isBlocked
        }
    );

    res.json({message : "user bloacked/unblocked successfully"})
  

    }catch(e){
        res.status(500).json({message : "Unabale to change user STATUS"})
    }

    }else{
        res.status(403).json({
            error : "Unauthorized access"
        })
    }

}

export function getUser(req,res){ //get the deatils who log in (this help to prevent nomral user acess the admin pages)
    if(req.user != null){
        res.json(req.user)
    }else{
        res.status(403).json({error : "Unauthorized"})
    }
}

export async function updateProfile(req, res) {
    if (!req.user) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
        const { address, phone } = req.body;
        
        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { address, phone },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const token = jwt.sign({
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            profilePicture : user.profilePicture,
            role : user.role,
            phone : user.phone
        }, process.env.JWT_SECRET);

        res.json({ message: "Profile updated successfully", token, user });
    } catch (e) {
        res.status(500).json({ error: "Failed to update profile" });
    }
}
