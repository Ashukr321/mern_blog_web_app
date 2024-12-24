import nodemailer from 'nodemailer';
import envConfig from '../config/envConfig.js';
const transporter = nodemailer.createTransport({
  service:'gmail',
  port:456,
  secure:false,
  auth:{
    user:envConfig.smtp_email,
    pass:envConfig.smtp_password
  }
});
export default transporter;