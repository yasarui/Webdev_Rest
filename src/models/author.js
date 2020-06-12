const mongoose = require("mongoose");
const Book  = require('./book');

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function(next){
    console.log("This pre function is Running ",this.id);
    Book.find({author:this.id},(err,books) => {
        if(err){
            next(err)
        }else if(books.length > 0){
           next(new Error('Thus author has books still'));
        }else{
            console.log("Last else is Running");
            next();
        }
    });     
});

module.exports = mongoose.model("Author",authorSchema);