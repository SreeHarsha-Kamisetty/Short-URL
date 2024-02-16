const express = require("express")
const cors = require("cors")
const PORT = process.env.PORT || 8080
const path = require("path");
const { connection } = require("./db");
const { URLModel } = require("./models/url.model");
const base62 = require('base62');
const Redis = require("ioredis")

const redis = new Redis({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_password
  
  });



const app = express();

app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/index.html"))
})

app.post("/original",async(req,res)=>{
    try {
        let {originalURL} = req.body
        let count = await redis.get("counter")
        let shortURL = base62.encode(count);
        
        let content = {
            originalURL:originalURL,
            shortURL:shortURL
        }
        let newURL = new URLModel(content)
        await newURL.save()
        await redis.incr("counter")
        res.status(200).json({"newURL":`http://localhost:8080/${shortURL}`})
    } catch (error) {
        console.log(error)
        res.status(400).json({Error:"Error when shortening URL"})
    }
})

app.get("/:shortURL",async(req,res)=>{
    try {
        let shortURL = req.params.shortURL
        let entry = await URLModel.findOne({shortURL:shortURL})
        
        if(entry){
            let originalURL = entry.originalURL
        res.redirect(originalURL)
        }
        else{
            res.send("URL not found")
        }
        
    } catch (error) {
        res.status(400).send("error when fetching original URL")
    }
})




app.listen(PORT,async()=>{

    try {
        await connection
        console.log("Connected to DB")
        console.log(`Server running at http://localhost:${PORT}`);
    } catch (error) {
        console.log(error)
    }
    
})