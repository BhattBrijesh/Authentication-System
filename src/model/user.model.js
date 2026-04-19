import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: [true, 'user name is required'],
        unique: [true, 'user name must be unique']
    },
    email: {
        type: String,
        require: [true, 'email is required'],
        unique:[true,'email must be unique']
    },
    password: {
        type: String,
        require:[true,'password is required']
    }
})

const userModel = mongoose.model('users', userSchema)
export default userModel;