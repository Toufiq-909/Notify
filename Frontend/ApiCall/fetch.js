import {initializeApp} from "firebase/app";
import {getMessaging,getToken} from "firebase/messaging";

export async function Check(meal)
{
     if('serviceWorker' in navigator)
    {
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
        if("Notification" in window)
        {
            const permission=await Notification.requestPermission();
            console.log(permission);
            if(permission!=="denied")
            {
                console.log("Granted");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


                const app=initializeApp(firebaseConfig);
                const messaging=getMessaging(app);
                console.log("sairam");
               let ct =await getToken(messaging,{vapidKey:'BIstwrUJTsDtYdCrFm0tH1HTv1QvJJw9Pzu7If2M36qWSsgnSjTwGj5GTZdOv5cRRaLEcGZZIKwLydgN7HDGaFs'})
                 if(ct)
                    {
                        
                        localStorage.setItem("token",ct);
                        
                        let res=await fetch(import.meta.env.VITE_API,{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                token:ct,
                                meal:meal
                            })
                        });
                        
                        return String(res.status);
                         

                    }
                    
                  

                



            }
            else
            {
                
                return "403";
               
            }
        }
    }
    else
    {
        return "400";
    }
}
