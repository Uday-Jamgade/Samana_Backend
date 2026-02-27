const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
       type:String,
       required:true
    },
    role:{
        type:String,
        default:"User",
        enum:["User","Admin"]
    },
    imageurl:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.Soqtvc8GbISKlazg81TPigHaFy?rs=1&pid=ImgDetMain"
    }
})

module.exports = mongoose.model("User",User);