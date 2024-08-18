const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    content:String,
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const Message=mongoose.model('message',messageSchema);// created a table called message in the database
module.exports=Message;