import nodemailer from 'nodemailer'
import configEnv from '../config/envConfig.js'
// Register   mail 
const welcomeMailOptions = (email, userName) => {
  return {
    from: `${configEnv.smtp_email}`,
    to: email,
    subject: 'Welcome to the app',
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #333;">Welcome to BLOG App, ${userName}!</h2>
        <img src="https://img.freepik.com/free-psd/kanzashi-japanese-hair-ornament-jewellery-isolated-transparent-background_191095-27124.jpg?ga=GA1.1.646617271.1734889422&semt=ais_hybrid" alt="Welcome Image" style="max-width: 100%; height: auto;"/>
        <p style="color: #555;">Your account has been created successfully!</p>
        <p style="color: #555;">Thank you for registering with us. We are excited to have you on board.</p>
        <p style="color: #555;">If you have any questions, feel free to reach out to our support team.</p>
        <p style="color: #555;">Best regards,<br>Your Company Name</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #aaa;">
            <p>This email was sent to you because you registered with us.</p>
        </footer>
    </div>
    `,
  }
}
export {welcomeMailOptions}