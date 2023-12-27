const express = require("express");
require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose");
const User = require("./models/User")
const Post = require("./models/Post")
const bcrypt = require ("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const uploadMiddlewate = multer({dest: "uploads/"});
const fs = require("fs")
const cookieParser = require("cookie-parser");
const { waitForDebugger } = require("inspector");


const app = express();

app.use(cors({credentials: true, origin:"http://localhost:5173"}));
app.use(express.json());
app.use(cookieParser());
//set static(public) folder
app.use("/uploads", express.static(__dirname + "/uploads"))

//database connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

app.get("/", (req, res) => {
    res.send("<h1>This is a RESTful API for SE NPRU Blog</h1>")
})

//User Register
const salt = bcrypt.genSaltSync(10);
app.post("/register",async (req, res) =>{
    const {username, password} = req.body; //สลายโคลงสร้าง
    try {
        const userDoc = await User.create({ //hach เป็น one way endcription
            username,
            password: bcrypt.hashSync(password, salt) // salt อักษรที่ถูกสุ่มขึ้นมาเพื่อเพิ่มความยากของ pass
        })
        res.json(userDoc);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
})


//login
const secret = process.env.SECRET;
app.post("/login", async(req,res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username}); //เอา username ไปหาข้อมูลจากฐานข้อมูล
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password); //เช็ค พาส ที่ได้จากฟอร์ม และในฐานข้อมูลว่าเหมือนกันไหม
    if(isMatchedPassword){
        //logged in
        jwt.sign({username, id: userDoc}, secret, {}, (err, token)=>{
            if(err) throw err;
            //Save data in cookie
            res.cookie("token", token).json({
                id: userDoc.id,
                username,
            });
        });
    }else{
        res.status(400).json("wrong credentials")
    }
});

//logout
app.post("/logout", (req,res)=>{
    res.cookie("token", "").json("ok")
})

//Create Post
app.post("/post", uploadMiddlewate.single("file"), async (req,res)=>{
    const {originalname, path} = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1]; //ตำแหน่งสุดท้าย = n-1 เสมอ
    const newPath = path + "." + ext; 
    fs.renameSync(path, newPath);
    const {token} = req.cookies || [];
    jwt.verify(token, secret, async (err, info)=>{
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json(postDoc);
    })

})




app.get("/post", async (req, res)=>{
    res.json(
        await Post.find().populate("author", ["username"]).sort({createdAt: -1}).limit(20)
    )
})

app.get("/post/:id", async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    //const postDoc = await Post.findByid
    res.json(postDoc);
});

//update
app.put("/post/:id",uploadMiddlewate.single("file"), async (req, res)=>{
    let newPath = null;
    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1]; //ตำแหน่งสุดท้าย = n-1 เสมอ
        const newPath = path + "." + ext; 
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, async (err, info)=>{
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author._id) === JSON.stringify(info.id._id)
        if(!isAuthor){
            return res.status(400).json("You are not the author")
        }
        await postDoc.findOneAndUpdate (
            {_id:id},
            {
            title,
            summary,
            content,
            cover:newPath? newPath:postDoc.cover,
            }
        )


        await postDoc.update({
            title,
            summary,
            content,
            cover:newPath? newPath:postDoc.cover,
            
        });
        res.json(postDoc);
    });
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("Server is running on http://localhost:" + PORT);
});
