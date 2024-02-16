const mongoose = require("mongoose")
require('dotenv')


const connection = mongoose.connect(process.env.mongoURL)


module.exports={
    connection
}
