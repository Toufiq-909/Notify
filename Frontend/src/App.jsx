import { Check } from "../ApiCall/fetch";
import {useState,useEffect} from "react";
function App()
{
  
  return (
  <>
  <div className={"Navbar bg-blue-500 pl-3 pr-4 pt-2"}>
    <p className={"font-[geist_mono] text-3xl font-bold text-white"}>Notify</p>
    <p className={"font-[geist_mono] text-md font-semibold text-white"}>Hey! Here’s the menu for the current meal</p>
  </div>
  <Meal/>

    <Button/>
    <img src="/img3.jpeg" className={"w-[92%] ml-4 mb-10 md:w-[40%]"}/>
 
  <p className={"footer footer-center font-[playFair]"}>Made with lots of love ❤️</p>
  

  
  </>
  )
}
export default App;
 function Meal()
 {
  let [menu,setmenu]=useState("");
  let [meal,setmeal]=useState("");
  useEffect(()=>{
    let call=async ()=>{
      let res=await fetch(import.meta.env.VITE_API1);
      let result=await res.json();
      setmenu(result.meal);
      setmeal(result.menu);
     
    }
    call();
  },[])
  return (
    

    <div className="m-2  border-4 border-neutral-100 font-[geist_mono] md:w-[40%]" >
      
      {
        meal==="" &&  <p className={"skeleton skeleton-text"}>Please wait while we load your menu.</p>
      }
      
      <p className={" text-2xl font-semibold"}>{menu}</p>

<p className={"text-md"}>{meal}</p>
    </div>
  
  
  )
    
 }
 function Button()
 {
  let [status,setstatus]=useState("");
  let [breakfast,setbreakfast]=useState(false);
  let [lunch,setlunch]=useState(false);
  let [snack,setsnack]=useState(false);
  let [dinner,setdinner]=useState(false);
  let [error,errormsg]=useState(false);
   let  res=localStorage.getItem("token");
   if(res===null)
   {
    return (
       <div className={"font-[geist_mono] m-2 border-4 border-neutral-100 md:w-[40%]"}>
        <p className={"font-semibold mb-4"}>Want this menu delivered straight to your notifications?</p>
        <p>Pick your preferred meal</p>
        <div className={"flex flex-row w-[100%]  justify-around mt-6 mb-6"}>
    <button className={"btn btn-neutral " +(breakfast ? "border-4 border-neutral-700":"border-0")} onClick={()=>{
      
      setbreakfast(prev=>!prev);
    }}>BreakFast</button>
    <button className={"btn btn-neutral "+(lunch ?" border-4 border-neutral-700":"border-0")} onClick={()=>{
      setlunch(prev=>!prev)
     
    }}>Lunch</button>
    <button className={"btn btn-neutral "+(snack ? "border-4 border-neutral-700":"border-0")} onClick={()=>{
      
      setsnack(prev=>!prev)
    }}>Snacks</button>
    <button className={"btn btn-neutral "+(dinner ? "border-4 border-neutral-700" :"border-0")} onClick={()=>{
      
      setdinner(prev=>!prev)
    }}>Dinner</button>
  </div>
  {
    status==="12" && <p className={"loading  text-info loading-xl w-[20%] ml-36"}></p>

  }

  {
    error && 
    <p className={"font-[geist_Mono] text-rose-600 font-bold ml-18"}>Please Select the Meal!</p>
  }
  

        
         
  <button className={"btn btn-success btn-wide mt-4 ml-16"} onClick={async ()=>{
 
    if(!breakfast&&!lunch&&
      !dinner&&!snack)
    {
      errormsg(true);
       console.log("Sadfa")
      
    }
    else
    {
       let msg=[]
      if(breakfast)
      {
        msg.push("breakfast");
      }
      if(lunch)
      {
        msg.push("lunch");
      }
      if(snack)
      {
        msg.push("snacks");
      }
      if(dinner)
      {
        msg.push("dinner")
      }
      errormsg(false);
      setstatus("12")
     let res=await Check(msg);
     setstatus("200");

    }
    
    
    

    
  }}>Notify</button>
  

      </div>
    )

   }
   else
   {
    return (
    <p className={"ml-18 mt-4 mb-2 font-[geist_Mono]"}>
      Congrats you are notified!😊</p>
    )
   }
 }
