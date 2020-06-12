require("./db/mongoose");
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const indexRoutes = require('./routes');
const authorRoutes = require('./routes/authors');
const bookRoutes = require('./routes/books');

//Init app
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"./views"));
app.set('layout',"./layouts/layout");

//Middlewares
app.use(express.urlencoded());
app.use(express.json());
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"./public")));
console.log("Public for is",path.join(__dirname,"./public"))

//Routes
app.use("/authors",authorRoutes);
app.use("/books",bookRoutes);
app.use("/",indexRoutes);

//Routes
app.get('/api/testing',(req,res)=>{
    res.send("Testing......");
});

app.listen(port,()=>{
    console.log(`Server is up and Running on Port ${port}`);
})