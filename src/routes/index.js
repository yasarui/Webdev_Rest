const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/',async (req,res)=>{
    const books = await Book.find({}).sort({createdDate:-1}).limit(8);
    res.render('index',{books});
});

module.exports = router;