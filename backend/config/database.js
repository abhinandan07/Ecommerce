const mongoose = require("mongoose");




const connectDatabse = ( )=>{
mongoose.connect(process.env.DB_URI,{/*useNewUrlParser:true,useFindAndModify: false,*/useUnifiedTopology:true,/*useCreateIndex:true*/}).then((data)=>
{
    console.log(`mongodb connect with server: ${data.connection.host}`);


})
}

module.exports = connectDatabse;
