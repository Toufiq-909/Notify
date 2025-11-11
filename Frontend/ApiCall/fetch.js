import {initializeApp} from "firebase/app";
import {getMessaging,getToken} from "firebase/messaging";

export async function Check()
{
     if('serviceWorker' in navigator)
    {
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
        if("Notification" in window)
        {
            const permission=await Notification.requestPermission();
            if(permission)
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
                getToken(messaging,{vapidKey:'BIstwrUJTsDtYdCrFm0tH1HTv1QvJJw9Pzu7If2M36qWSsgnSjTwGj5GTZdOv5cRRaLEcGZZIKwLydgN7HDGaFs'}).then(async (ct)=>{
                    if(ct)
                    {
                        console.log(ct)
                        
                        let res=await fetch("http://localhost:3000/notification",{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                token:ct
                            })
                        })

                    }
                    else
                    {
                        console.log("error in fetch");
                        
                    }

                })



            }
            else
            {
                return "denied";
               
            }
        }
    }
    else
    {
        return "browserissue";
    }
}
