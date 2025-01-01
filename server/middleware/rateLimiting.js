import rateLimit from 'express-rate-limit';


const rateLimiting = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export default rateLimiting;

