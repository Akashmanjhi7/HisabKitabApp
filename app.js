const express = require('express')
const app = express();
const path = require("path")
const fs = require('fs')
app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")));

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
app.get("/", (req,res)=>{
    fs.readdir("./files", (err, files)=>{
        if(err) res.send(err)
            else{
        res.render("index",{files} )
        }
    })
})

app.route("/create")
.get((req,res)=>{
    res.render("form")})
.post((req,res)=>{
   const data =  req.body.data

    fs.writeFile(`./files/${day}-${month}-${year}.txt`, data ,(err)=>{
        err?res.send(err):res.redirect("/")
    })
})

app.get("/read",(req,res)=>{
    fs.readFile(`./files/${day}-${month}-${year}.txt` ,'utf8', (err,data)=>{
        err?res.send("Error", err) : res.render("read", {data})
    })
})


app.get("/edit/:filename",(req,res)=>{
    const filename = req.params.filename;
    fs.readFile(`./files/${filename}` , 'utf8' ,(err, data)=>{
      if(err){
        res.send(err)
      }
      else{
        const filedate =  filename.split('.')[0]
        res.render("edit", {data , filename, filedate})
      }
    })
})

app.post("/update/:filename", (req,res)=>{
    const {data} = req.body;
    const path = req.params.filename;
    
    fs.writeFile(`./files/${path}`, data , (err)=>{
        if(err) res.send(err)
            else res.redirect("/")
    })
  
})
app.get("/read/:filename",(req,res)=>{
    const filename = req.params.filename;
    fs.readFile(`./files/${filename}` , 'utf8' ,(err, data)=>{
      if(err){
        res.send(err)
      }
      else{
       const filedate =  filename.split('.')[0]
        res.render("read", {data , filedate ,filename})
      }
    })
})

app.get("/delete/:filename", (req,res)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        err?res.send(err):res.redirect("/")
    })
})

app.listen(3000)