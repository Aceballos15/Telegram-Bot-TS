const { Router } = require("express")
const axios = require("axios")
const routers = Router(); 


const botToken = "6374276669:AAGx3_lIroSsaNmfxFSlDrQnV1I6UfhxHN4";
const myWebHook = " https://056b-190-0-247-117.ngrok-free.app/webhook"; 

const botValidations = require("../services/botValidations")

routers.post("/webhook", async (req, res) =>{
    
    const message = req.body; 
    const newBotValidation = new botValidations()

    await newBotValidation.validateMessage(message)

    res.status(200).send("Servidor funcionando correctamente")
})



module.exports = routers; 