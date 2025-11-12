import { Check } from "../ApiCall/fetch";
import {useState} from "react";
function App()
{
  let [msg,setmsg]=useState([]);
  return (
  <>
  <div className={"flex flex-row"}>
    <button onClick={()=>{
      setmsg(prev=>[...prev,"breakfast"])
    }}>BreakFast</button>
    <button onClick={()=>{
      setmsg(prev=>[...prev,"lunch"])
    }}>Lunch</button>
    <button onClick={()=>{
      setmsg(prev=>[...prev,"snacks"])
    }}>Snacks</button>
    <button onClick={()=>{
      setmsg(prev=>[...prev,"dinner"])
    }}>Dinner</button>
  </div>
  <button onClick={()=>{
    Check(msg);
  }}>Hello</button>
  </>
  )
}
export default App;