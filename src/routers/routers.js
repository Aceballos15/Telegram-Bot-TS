const { Router } = require("express")
const axios = require("axios")
const routers = Router(); 


const botValidations = require("../services/botValidations")

// define principals routers 
routers.post("/webhook", async (req, res) =>{
    
    const message = req.body; 
    const newBotValidation = new botValidations()

    await newBotValidation.validateMessage(message)

    res.status(200).send("Servidor funcionando correctamente")
})



module.exports = routers; 