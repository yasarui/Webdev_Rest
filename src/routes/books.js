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
            searchOptions: req.query
        });
    } catch (e) {
        res.redirect("/");
    }
});

router.get("/new", (req, res) => {
    renderFormPage(res, new Book(),'createBook')
});

router.post("/", async (req, res) => {
    const book = {
        name: req.body.name,
        description: req.body.description,
        pageCount: req.body.pageCount,
        author: req.body.author,
        publishDate: req.body.publishDate
    }
    saveCoverImage(book, req.body.cover);
    try {
        const newBook = new Book(book);
        await newBook.save();
        res.redirect(`/books/${newBook.id}`);
    } catch (e) {
        renderFormPage(res, req.body, 'createBook', e.message)
    }
});

router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', {
            book: book
        })
    } catch (e) {
        res.redirect("/")
    }
});

router.get("/:id/edit", async (req, res) => {
    let book;
    const id = req.params.id;
    try {
        book = await Book.findById(id);
        renderFormPage(res,book,'editBook')
    } catch (e) {
        renderFormPage(res, book,'editBook', e.message)
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    let book;
    try{
       book = await Book.findById(id);
       book.name = req.body.name,
       book.description = req.body.description,
       book.pageCount = req.body.pageCount,
       book.author = req.body.author,
       book.publishDate = req.body.publishDate
       saveCoverImage(book, req.body.cover);
       await book.save();
       res.redirect(`/books/${id}`)
    }catch(e){
        renderFormPage(res, book,'editBook', e.message)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect("/books");
    } catch (e) {
        res.redirect("/")
    }
});

function removeBookCover(filename) {
    fs.unlink(path.join(bookCoversPath, filename), (err) => {
        if (err) console.log(err);
    })
}

function saveCoverImage(book, coverEncoded) {
    if (!coverEncoded) return;
    const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}

async function renderFormPage(res, book, type, error = false) {
    try {
        const authors = await Author.find({});
        res.render(`books/${type}`, {
            book,
            authors: authors,
            errorMessage: error
        })
    } catch (e) {
        res.render("books/index");
    }
}

module.exports = router;