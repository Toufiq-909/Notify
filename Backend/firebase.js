const admin=require("firebase-admin")
const serviceAccount = require("./notify-f9714-firebase-adminsdk-fbsvc-2f0c59ae65.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports=admin

