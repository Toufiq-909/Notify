const mon=require("mongoose");
let tokenschema=new mon.Schema({
    token:String
});
let messschema=new mon.Schema({
    date:String,
    breakfast:String,
    lunch:String,
    snacks:String,
    dinner:String
})
let tokenmodel=mon.model("tokens",tokenschema);
let messmodel=mon.model("menu",messschema);
module.exports={
    token:tokenmodel,
    mess:messmodel
}