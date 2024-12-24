// import and config the env 
import {config} from 'dotenv'
config();

// create the object envConfig and export  
const envConfig = {
  port : process.env.PORT,
  dbUrl : process.env.DB_URL,
  dbName : process.env.DB_NAME,
}

export default envConfig;
