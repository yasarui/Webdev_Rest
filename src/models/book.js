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
     coverImage:{
         type: Buffer,
         required: true
    },
    coverImageType:{
         type: String,
         required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }
});

// bookSchema.virtual('coverImagePath').get(function(){
//     if(this.coverImageName){
//         return path.join("/",bookCoverImagesBasePath,this.coverImageName);
//     }
// })

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model("Book",bookSchema);
//module.exports.basePath = bookCoverImagesBasePath;
