// import express 
import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import userRoute from './routes/userRoutes.js';
import blogRoute from './routes/blogRoutes.js';
import morgan from 'morgan';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import setupSwagger from './utils/swagger.js';


// create server 
const app = express();

// connect to database
connectDb();

app.use(cors(
  {
    origin : "*"
  }
));
app.use(cookieParser());
setupSwagger(app);

// Middleware to parse URL-encoded data
app.use(express.json({limit:"10kb"})); 
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
app.use(`${baseApiUlr}/blog`,blogRoute);

//  handle error 
app.use(globalErrorHandler);
// listening server
const port = envConfig.port || 3000;
app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})