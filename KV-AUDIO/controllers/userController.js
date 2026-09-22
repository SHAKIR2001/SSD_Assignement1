import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export function registerUser(req,res){

    const data = req.body;

    data.password = bcrypt.hashSync(data.password,10) //10 = solting rounds

    const newUser = new User(data)

    newUser.save().then(
        ()=>{
            res.json({
                message : "User registred successfully"
            })
        }
    ).catch(
        (error)=>{
            res.status(500).json(
            {
                error : "User registration failed"
            })
        }
    )

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