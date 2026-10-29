export async function Monthmenu()
{
  
    let response=await fetch(import.meta.env.VITE_API2+"/monthmenu")

    let result=await response.json();

    

    if(response.status==200)
    {

        localStorage.setItem("Monthmenu",JSON.stringify(result));

        

        return "sucess";
    }
    else
    {
        return "error";
    }

    

    
}