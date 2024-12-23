// import and config the env 
import {config} from 'dotenv'
config();

// create the object envConfig and export  
const envConfig = {
  port : process.env.PORT,
}

export default envConfig;
