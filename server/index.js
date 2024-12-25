// import express 
import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import userRoute from './routes/userRoutes.js';
import morgan from 'morgan';
import fs from 'fs';
// create server 
const app = express();

// connect to database
connectDb();

app.use(cors(
  {
    origin : "*"
  }
));


// parse request in to body 
app.use(express.json());
// log file 
if(envConfig.node_env=="development"){
  const logStream = fs.createWriteStream('./logs/access.log',{flags:'a'});
  app.use(morgan('dev',{stream:logStream}));
}

// create routes 🚀
// baseurl 
const baseApiUlr = '/api/v1';
// user routes
app.use(`${baseApiUlr}/user`,userRoute);

//  handle error 
app.use(globalErrorHandler);
// listening server
const port = envConfig.port || 3000;
app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})