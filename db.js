const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebook";

const connectToMongo=async()=>
{
    mongoose.connect(mongoURI)
    try{
        console.log("mongodb connected");
    }
    catch(error)
    {
        console.log(error);
    }
}
module.exports=connectToMongo;