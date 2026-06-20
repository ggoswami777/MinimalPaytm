import express from "express";
import db from "@repo/db/client"
const app=express();
app.post("/hdfcWebhook",async(req,res)=>{
    // TODO : Add zod validation here
    // check if the req actually came from hdfc bank ,using a webhook secret
    const paymentInformation={
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount
    }
    // update balance in db
    // use transaction for both db queries
    await db.balance.update({
        where:{
            userId:paymentInformation.userId
        },
        data:{
            amount:{
                increment:paymentInformation.amount
            }
        }
    })
    await db.onRampTransaction.update({
        where:{
            token:paymentInformation.token,
        },
        data:{
            status:"Success"
        }
    })
    res.status(401).json({
        message:"captured"
    })
})