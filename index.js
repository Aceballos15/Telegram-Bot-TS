const express = require("express")
const bodyParser = require('body-parser');

const app = express()


//Middleware instalation 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());



// import principal routers 
const routersUse = require("./src/routers/routers")
app.use("", routersUse)



app.listen(process.env.PORT || 3000, (req, res)=> {
    console.log(`Server is running on Port 3000`)
})