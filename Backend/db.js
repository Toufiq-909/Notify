const mon=require("mongoose");
let messschema=new mon.Schema({
    date:String,
    breakfast:String,
    lunch:String,
    snacks:String,
    dinner:String
});
let userschema=new mon.Schema({
    token:String,
    meal:[String]
})

let LoginSchema=new mon.Schema({
    name:String,
    password:String
});

let loginmodel=mon.model("Login",LoginSchema);
let usermodel=mon.model("users",userschema);
let messmodel=mon.model("menu",messschema);
module.exports={
    mess:messmodel,
    user:usermodel,
    loginmodel:loginmodel
}
