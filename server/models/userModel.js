import mongoose from "mongoose";


// create userSchema 
const userSchema = new mongoose.Schema({

})

const User = mongoose.model('User',userSchema);
export default User;