const { token,mess }=require("./db");
const admin=require("./firebase")
const readxl=require("read-excel-file/node")
 async function setToken(req,res)
{
   try
   {
     await token.create({
        token:req.body.token
    });
    res.sendStatus(200);
    
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }
}
 async function Send(req,res)
{
   try
   {
    const message = {
    notification: {
    title: "Hello from server!",
    body: "Description from server"
  },
  token: req.body.token
  };
  let resp=await admin.messaging().send(message);
  console.log(resp);
  res.sendStatus(200);
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }

  
}

async function File(req,res)
{
   readxl(req.file.path).then(async (rows)=>{
      console.log(rows.length)
      for(let i=1;i<rows.length;i++)
      {
         if(rows[i][1]!=null)
         {
            let b=rows[i][0].substring(4);
            let arr=b.split(",");
            for(let j=0;j<arr.length;j++)
            {
           let res=await mess.create({
                  date:arr[j].substring(arr[j].length-2),
                  breakfast:rows[i][1],
                  lunch:rows[i][2],
                  snacks:rows[i][3],
                  dinner:rows[i][4]
               });
               console.log(res);
            }
           

         }
        
      }
   })
   
   
      
  
 

      }

module.exports={
    Send:Send,
    setToken:setToken,
    File:File
}


