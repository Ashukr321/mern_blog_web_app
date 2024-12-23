// import express 
import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';

// create server 
const app = express();
app.use(cors(
  {
    origin : "*"
  }
));

// parse request in to body 
app.use(express.json());

// create routes 

// listening server
const port = envConfig.port || 3000;
app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})