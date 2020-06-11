const express = require("express");
const router = express.Router();
const Author = require("../models/author");

//GET all authors
router.get("/",async (req,res)=>{
    const searchOptions = {};
    if(req.query.name != null && req.query.name != ""){
        searchOptions.name = new RegExp(req.query.name,"i");
    }
    const authors = await Author.find(searchOptions);
    res.render('authors/index',{authors,searchOptions:req.query});
});

router.get("/new",(req,res)=>{
   res.render('authors/authorForm',{
       author: new Author()
   });
});

router.post("/",async (req,res)=>{
    try{
        const author = new Author({name:req.body.name});
        await author.save();
        res.redirect("/authors");
    }catch(e){
        res.render("authors/authorForm",{author:req.body,errorMessage:e.message})
    }
})

module.exports = router;