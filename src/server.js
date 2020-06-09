require("./db/mongoose");
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRoutes = require('./routes');

//Init app
const app = express();
const port = process.env.PORT;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"./views"));
app.set('layout',"./layouts/layout");

//Middlewares
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,"./public")));

//Routes
app.use(indexRoutes);

//Routes
app.get('/api/testing',(req,res)=>{
    res.send("Testing......");
});

app.listen(port,()=>{
    console.log(`Server is up and Running on Port ${port}`);
})