// requiere express for server and bodyParser for json manipulation
const express = require("express")
const bodyParser = require('body-parser');

// initializate app 
const app = express()

// require dotenv 
require("dotenv").config(); 

//Middleware instalation 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());



// import principal routers 
const routersUse = require("./src/routers/routers")
app.use("", routersUse)


// Construction of port and principal request 
app.listen(process.env.PORT || 4000, (req, res)=> {
    console.log(`Server is running on Port 3000`)
})