const {mess,user }=require("./db");
const admin=require("./firebase");
const readxl=require("read-excel-file/node");
const dotenv=require("dotenv");
dotenv.config()

async function File(req,res)
{
   if(req.headers.password==process.env.password)
   {
      await mess.deleteMany({});
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
      return res.sendStatus(200);
   });

   }
   else
   {
      return res.sendStatus(401);
   }
   
      }
async function Add(req,res)
{
   try
   {
    
      let resp= await admin.messaging().send({token:req.body.token},true);
   }
   catch(e)
   {
      console.log(e);
      return res.sendStatus(401);
   } 
   try{
      await user.create({
         token:req.body.token,
         meal:req.body.meal
      });
      res.sendStatus(200);
   }
   catch(e)
   {
      res.sendStatus(500);
   }
}
async function Service1(req,res)
{
   console.log("Running 1");
   let date=new Date().getDate();
    date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
   let result=await mess.findOne({
      date:date
   });
   let result2=await user.find({
      meal:"breakfast"
   });
    try
   {
      for(let i=0;i<result2.length;i++)
      {

          const message = {
    notification: {
    title: "Rise and dine! 🍳 Your breakfast awaits 😋",
    body: result.breakfast
  },
  token: result2[i].token
  };
  let resp=await admin.messaging().send(message);
  console.log(resp);
  }
  res.sendStatus(200);
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }
}
async function Service2(req,res)
{
   console.log("Running 2");
   let date=new Date().getDate();
    date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
   let result=await mess.findOne({
      date:date
   });
   let result2=await user.find({
      meal:"lunch"
   });
    try
   {
      for(let i=0;i<result2.length;i++)
      {

          const message = {
    notification: {
    title: "Lunch time already? Let’s see what’s on the plate 😋",
    body: result.lunch
  },
  token: result2[i].token
  };
  let resp=await admin.messaging().send(message);
  console.log(resp);
  }
  res.sendStatus(200);
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }

}
async function Service3(req,res)
{
    console.log("Running 3");
   let date=new Date().getDate();
    date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
   let result=await mess.findOne({
      date:date
   });
   let result2=await user.find({
      meal:"snacks"
   });
    try
   {
      for(let i=0;i<result2.length;i++)
      {

          const message = {
    notification: {
    title: "Snack o’clock! Grab a quick bite 🧁",
    body: result.snacks
  },
  token: result2[i].token
  };
  let resp=await admin.messaging().send(message);
  console.log(resp);
  }
  res.sendStatus(200);
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }
}
async function Service4(req,res)
{
      console.log("Running 4");
   let date=new Date().getDate();
    date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
   let result=await mess.findOne({
      date:date
   });
   let result2=await user.find({
      meal:"dinner"
   });
    try
   {
      for(let i=0;i<result2.length;i++)
      {

          const message = {
    notification: {
    title: "Dinner time, my friend! Let’s eat well 🍲",
    body: result.dinner
  },
  token: result2[i].token
  };
  let resp=await admin.messaging().send(message);
  console.log(resp);
  }
  res.sendStatus(200);
   }
   catch(e)
   {
    console.log(e);
    res.sendStatus(500);
   }
   
}



  

                      
   

async function meal(req,res)
{
   let date=new Date().getDate();
   let hour=new Date().getHours();
   let minute=new Date().getMinutes();
   console.log(hour);
   console.log(minute);
    if(hour>=0 && hour<=8)
    {
       date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
    try
    {
       let result=await mess.findOne({
      date:date
   });
    return res.status(200).json({
      menu:result.breakfast,
      meal:"Breakfast"
    })
  
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }
  

    }
    else if(hour>=9 && hour<=13)
    {

      date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
    try
    {
       let result=await mess.findOne({
      date:date
   });
    return res.status(200).json({
      menu:result.lunch,
      meal:"Lunch"
    })
  
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }

    }
    else if(hour>=14 && hour<=17 || (hour==18 && minute<=30))
    {
      date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
    try
    {
       let result=await mess.findOne({
      date:date
   });
    return res.status(200).json({
      menu:result.snacks,
      meal:"Snacks"
    })
  
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }

    }
    else if((hour==18 && minute>30)||hour>=19 && hour<=20)
    {
      date=date+"";
    if(date.length==1)
    {
      date="0"+date;
    }
    try
    {
       let result=await mess.findOne({
      date:date
   });
    return res.status(200).json({
      menu:result.dinner,
      meal:"Dinner"

    })
  
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }
    }
    else
    {
      date=date+1+"";
    if(date.length==1)
    {
      date="0"+date;
    }
    try
    {
       let result=await mess.findOne({
      date:date
   });
    return res.status(200).json({
      menu:result.breakfast,
      meal:"Upcoming"
    })
  
    }
    catch(e)
    {
      console.log(e);
      return res.sendStatus(500);
    }
    }
   

}

module.exports={
    Add:Add,
    File:File,
    meal:meal,
    Service1:Service1,
    Service2:Service2,
    Service3:Service3,
    Service4:Service4
}



