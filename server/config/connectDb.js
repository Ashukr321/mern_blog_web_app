import mongoose from "mongoose";
import envConfig from "./envConfig.js";

// connect to database 
const connectDb  = async ()=>{
  try {
    await mongoose.connect(envConfig.dbUrl,{
      dbName : envConfig.dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  
    console.log(`Connected to Database: ${envConfig.dbName}`);
  } catch (error) {
    console.log(error);
  }
}

// export connectDb
export default connectDb;
