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
const { Add,File,meal,cron } = require("./Handler");
app.use(cors());
app.use(exp.json());
app.post("/user",Add)
app.post("/upload",upload.single("file"),File)
app.get("/meal",meal)
app.get("/cron",cron)
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
