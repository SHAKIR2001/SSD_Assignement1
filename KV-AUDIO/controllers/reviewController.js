import Review from "../models/review.js"

export function addReview(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Please login and try again"
        })
        return
    }

    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName; //ingu review podum naparin fistname + last name ei eduththu review il ulla name itku koduththal
    data.profilePicture = req.user.profilePicture;
    data.email = req.user.email;

    const newReview = new Review(data)

    newReview.save().then(
        ()=>{
            res.json({
                message : "Review added successfully"
            })
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                error : "Review cannot be added"
            })
        }
    )
}

export async function getReviews(req,res){
    const user = req.user;

    try{
        if( req.user.role == "admin"){
            const reviews = await Review.find();
            res.json(reviews)
        }else{
            const reviews = await Review.find({isApproved : true})
            res.json(reviews)
        }

    }catch(e){
        res.status(500).json({error : "Review loading failed"})
    }
}

export function deleteReview(req,res){
    const email = req.params.email

    if(req.user == null){
        res.status(401).json(
           {
            message : "Please login and try again"
           }
        )
        return
    }

    if(req.user.role == "admin"){
    Review.deleteOne({email : email}).then( ()=>{
            res.json({
            message : "Review deleted successfully"
        })
    }
     ).catch(
        (error)=>{
            res.status(500).json({
                error : "Review can not be deleted"
            })
        }
    )
    }

    if (req.user.role == "customer"){
        if(req.user.email == email){
            Review.deleteOne({email:email}).then(
                ()=>{
                    res.json({
                        message : "Review deleted siccessfully"
                    })
                }
            ).catch(
                (error)=>{
                    res.status(500).json(
                        {
                            error : "Review can not be deleted"
                        }
                    )
                }
            )

        }else{
            res.status(403).json(
                ()=>{
                    res.json({
                        message : "You are not authorized to perform this action"
                    })
                }
            )
        }
    }
}

export function approveReview(req,res){
    const email = req.params.email

    if(req.user == null){
        res.status(401).json(
            {
                message : "Please login and try again"
            }
        )
        return
    }

    if(req.user.role == "admin"){
        Review.updateOne({
            email : email  //1st il ulla email database il ulladhei kurikkum irandaawadhu req.params.email il irundu eduththa emailei kurikkum (check bothe are same) 
        },
        {
            isApproved : true, //update the chnages here 
        }).then(
            ()=>{
                res.json(
                    {
                        message : "Review approved successfully"
                    }
                )
            }
        ).catch(
            (error)=>{
                res.status(500).json(
                    {
                        error : "Review approval failed"
                    }
                )
            }
        )

    } else{
        res.status(403).json(
            {
              message : "Yor are not an admin, only the admins can approve the reviews"
            }
        )
    }
}