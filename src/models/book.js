const mongoose = require("mongoose");
const path = require("path");
const bookCoverImagesBasePath = '/uploads/bookCover'

const bookSchema = mongoose.Schema({
     name: {
        type: String,
        required: true,
        trim: true
     },
     description: {
        type: String,
        trim: true,
        required: true
     },
     publishDate: {
        type: Date,
        required: true
     },
     pageCount: {
        type: Number,
        required: true,
        trim: true
     },
     createdDate:{
        type: Number,
        default: Date.now
     },
     coverImageName:{
         type: String,
         required: true
    },
     author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
     }
});

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName){
        return path.join("/",bookCoverImagesBasePath,this.coverImageName);
    }
})

module.exports = mongoose.model("Book",bookSchema);
module.exports.basePath = bookCoverImagesBasePath;
