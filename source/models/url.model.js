const mongoose = require("mongoose")

const urlSchema = mongoose.Schema({
    shortURL:String,
    originalURL:String
})


const URLModel = mongoose.model("url",urlSchema)


module.exports={
    URLModel
}