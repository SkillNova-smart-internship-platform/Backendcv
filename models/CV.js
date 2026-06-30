const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    address:{
        type:String
    },

    summary:{
        type:String
    },

    education:{
        type:String,
        required:true
    },

    experience:{
        type:String
    },

    skills:[
        String
    ],

    projects:[
        String
    ],

    languages:[
        String
    ]

},
{
    timestamps:true
});

module.exports = mongoose.model("CV", cvSchema);