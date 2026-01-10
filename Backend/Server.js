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
const { Add,File,meal,Service1,Service2,Service3,Service4 } = require("./Handler");
app.use(cors());
app.use(exp.json());
app.post("/user",Add)
app.post("/upload",upload.single("file"),File)
app.get("/meal",meal);
app.use(verify);

app.get("/s1",Service1);
app.get("/s2",Service2);
app.get("/s3",Service3);
app.get("/s4",Service4);



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
async function  verify(req,res,next)
{
    if(req.header("token")==process.env.token)
    {
        console.log("Validated");
        next();
    }
    else
    {
        return res.sendStatus(403);
    }
}

