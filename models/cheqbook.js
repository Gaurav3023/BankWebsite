const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    used:{
        type:Boolean,
     },
     page:{
        type:Number
     },
     amount:{
        type:String
     },
     firstName:{
        type:String
     },
     lastName:{
        type:String
     }

});
const model = mongoose.model("cheqbook", userSchema)

module.exports = model;