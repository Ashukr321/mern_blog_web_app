// import and config the env 
import {config} from 'dotenv'
config();

// create the object envConfig and export  
const envConfig = {
  port : process.env.PORT,
  dbUrl : process.env.DB_URL,
  dbName : process.env.DB_NAME,
  smtp_email:process.env.SMTP_EMAIL,
  smtp_password:process.env.SMTP_PASSWORD,
  jwt_secret:process.env.JWT_SECRET,
  jwt_expires:process.env.JWT_EXPIRES,
  node_env:process.env.NODE_ENV,
  client_url:process.env.CLIENT_URL,
  cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
  production_url:process.env.PRODUCTION_URL
}

export default envConfig;
