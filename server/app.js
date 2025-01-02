// import express 
import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import userRoute from './routes/userRoutes.js';
import blogRoute from './routes/blogRoutes.js';
import commentRoute from './routes/commentRoutes.js';
import morgan from 'morgan';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiting from './middleware/rateLimiting.js';
import helmet from 'helmet';

//  import swagger 
import swaggerDoc from 'swagger-ui-express';
import swaggerDocumentation from './helper/swaggerdocumentation.js'
// create server 
const app = express();

// connect to database
connectDb();

app.use(cors(
  {
    origin : "*"
  }
));
app.use(helmet());
app.use(rateLimiting);
app.use(mongoSanitize());
app.use(cookieParser());

// swagger documentation
app.use('/documentation',swaggerDoc.serve);
app.use('/documentation',swaggerDoc.setup(swaggerDocumentation));


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
app.use(`${baseApiUlr}/comment`,commentRoute);

//  handle error 
app.use(globalErrorHandler);
// listening server
const port = envConfig.port || 3000;
app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
})