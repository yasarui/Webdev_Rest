const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require('../models/book');

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
        res.redirect(`/authors/${author.id}`);
    }catch(e){
        res.render("authors/authorForm",{author:req.body,errorMessage:e.message})
    }
})

router.get("/:id",async (req,res)=>{
    try{
       const author = await Author.findById(req.params.id);
       const books = await Book.find({author:author.id}).limit(6);
       res.render('authors/show',{author:author,booksByAuthor:books}); 
    }catch(e){
       res.redirect("/");
    }
});

router.get("/:id/edit", async(req,res)=>{
     try{
        const author = await Author.findById(req.params.id);
        res.render("authors/editAuthorForm",{
            author:author
        })
     }catch(e){
         res.redirect("/authors");
     }
});

router.put("/:id", async (req,res)=>{
   const id = req.params.id;
   const name = req.body.name;
   let author;
   try{
     author = await Author.findByIdAndUpdate(id,{name},{new: true});
     res.redirect(`/authors/${author.id}`);
   }catch(e){
     if(author == null){
         res.redirect("/");
     }else{
        res.render("authors/editAuthorForm",{author,errorMessage:e.message})
     }
   }
});

router.delete("/:id", async (req,res) => {
   let author
   try{
      author = await Author.findById(req.params.id);
      await author.remove();
      res.redirect("/authors");
   }catch(e){
      if(author == null){
        res.redirect("/");
      }else{
        res.redirect(`/authors/${author.id}`)
      }
   }
})

module.exports = router;