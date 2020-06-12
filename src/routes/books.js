const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require("fs");
const multer = require("multer");
const Book = require('../models/book');
const Author = require('../models/author');

//const bookCoversPath = path.join(__dirname,"../public",Book.basePath);

//Init upload
// const upload = multer({
//     dest: bookCoversPath,
//     fileFilter(req,file,cb){
//         const fileName = file.originalname.toLocaleLowerCase();
//         if(!fileName.match(/\.(png|jpg|jepg)$/)){
//             return cb(new Error("only images are allowed"))
//         }else{
//              cb(null,true)
//         }        
//     }
// }).single('cover')

router.get("/", async (req, res) => {
    let query = Book.find()
    if (req.query.name != null && req.query.title != '') {
      query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books,
            searchOptions:req.query
        });
    } catch (e) {
        res.redirect("/");
    }
});

router.get("/new", (req,res)=>{
    renderFormPage(res,new Book())
});

router.post("/",async (req,res)=>{
    const book = {
        name: req.body.name,
        description: req.body.description,
        pageCount: req.body.pageCount,
        author: req.body.author,
        publishDate: req.body.publishDate
    }
    saveCoverImage(book,req.body.cover);
    try{
      const newBook = new Book(book);
      await newBook.save();
      res.redirect("/books");
    }catch(e){
       renderFormPage(res,req.body,e.message)
    }
},(error,req,res,next) =>{
    res.send({error:error.message});
});

function removeBookCover(filename){
   fs.unlink(path.join(bookCoversPath,filename),(err)=>{
       if(err) console.log(err);
   })
}

function saveCoverImage(book,coverEncoded){
    if(!coverEncoded) return;
    const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}

async function renderFormPage(res,book,error = false){
    try{
        const authors = await Author.find({});
        res.render("books/createBook",{
            book: new Book(),
            authors:authors,
            errorMessage:error
        })
       }catch(e){
          res.render("books/index");
    }
}

module.exports = router;