// global error handler 
const globalErrorHandler =async(error,req,res,next)=>{
  //create the error object 
  const err = new Error();
  err.message = error.message||"Internal Server Error";
  err.status= error.status || 500;
  // send error response 
  res.send(err);
}

// export globalErrorHandler 
export default globalErrorHandler;