// import express 
import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
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

// create routes 



//  handle error 
app.use(globalErrorHandler);
// listening server
const port = envConfig.port || 3000;
app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})