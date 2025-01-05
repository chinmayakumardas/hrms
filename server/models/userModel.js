
const mongoose = require(process.env.MONGOOSE);
const bcrypt = require(process.env.BCRYPT);
const autoIncrement = require("mongoose-sequence")(mongoose);

//schema definition of usermodel
const userSchema = new mongoose.Schema({
    userId: {type: Number, unique: true},
    fullName: {type: String},
    username: {type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    contact: {type: Number},
    role: {type: String, enum: ['User','Hr', 'Admin'], default: 'User'},
    loginOTP:{type: String}, //otp for login
    loginOtpExpiresAt:{type: Date}, //login otp expiry time
    resetOTP: {type: String},//resetPassword OTP
    otpExpiresAt: {type: Date},//resetOTP expiry time
    isDeleted: {type: Boolean, default: false},
},{timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
    
});

//password checking
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
    
};

//Login Otp Checking
userSchema.methods.compareLoginOTP = async function(loginOTP) {
    return bcrypt.compare(loginOTP, this.loginOTP);
    
}

//Reset otp checking
userSchema.methods.compareOTP = async function (resetOTP) {
    return bcrypt.compare(resetOTP, this.resetOTP);    
}
// Autoincrement userId
userSchema.plugin(autoIncrement, { inc_field: 'userId' });


module.exports = mongoose.model(process.env.USER , userSchema);
