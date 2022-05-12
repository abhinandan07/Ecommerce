const app = require("./app");

const dotenv = require("dotenv");
const connectDatabse = require("./config/database")


//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(` Shutting down the server due to uncaught exception`);
    process.exit(1);

});

//confige

dotenv.config({path:"backend/config/config.env"})


// conect to datrabase
connectDatabse();

 const server = app.listen(process.env.PORT,()=> {

    console.log(' Server is working on http://localhost:${process.env.PORT}')
});


// unhandeld Promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(` Shutting down the server due to unhandeled Promise rejection`);
    server.close(()=> {
        process.exit(1);
    });

});