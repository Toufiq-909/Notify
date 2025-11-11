const exp=require("express");
const app=exp();
const mon=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const mutler=require("multer")
const upload=mutler({
   dest:"temp/"
})
dotenv.config();
const { setToken, Send,File } = require("./Handler");
app.use(cors());
app.use(exp.json());
app.post("/settoken",setToken);
app.post("/notification",Send);
app.post("/upload",upload.single("file"),File)
a=async ()=>{
    try{
await mon.connect(process.env.mon);
app.listen(3000);
    }
    catch(e)
    {
        console.log(e);

    }
    
}
a();
