
const crypto = require(process.env.CRYPTO);
const bcrypt = require(process.env.BCRYPT);
const nodemailer = require(process.env.NODEMAILER);

const User = require('.'+process.env.MODELS+'userModel');
const {generateToken} = require('.'+process.env.UTILS+'jwtUtils');
//const { ConnectionStates } = require('mongoose');
//const { text } = require('stream/consumers');

//regex to check email format
const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
    },
});

//new user registration
exports.registerUser = async (req, res) => {
    try{
        const {fullName, username, email, password, contact, role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : process.env.MSG_1});
        }
        const user = new User({fullName, username, email, password, contact, role});
        await user.save();
        res.status(201).json({message: process.env.MSG_2});
    }catch(error) {

        res.status(500).json({message: process.env.MSG_3, error});
    }
};

//Manage User Section
//get list of all users
exports.fetchAllUsers = async (req, res) => {
    try{
        const users = await User.find({isDeleted: false});
        if(!users || users.length === 0){
            return res.status(400).json({message: process.env.MSG_4});
        }
        // Map through the users array and extract the relevant fields
        const userDetails = users.map(user => ({
            FullName: user.fullName,
            email: user.email,
            username: user.username,
            contact: user.contact,
            role: user.role,
        }));
        
        res.status(200).json(userDetails);
    }catch(error) {
        res.status(500).json({message: process.env.MSG_5, error});
    }
};

//update user by id
exports.updateUserById = async (req, res) => {
    try{
        const {userId} = req.params;
        const updateData = req.body; 
        const user = await User.findOne({userId});
        if(!user){
            return res.status(400).json({message: process.env.MSG_6});
        }
        const updatedUser = await User.findOneAndUpdate(
            {userId},
            {$set: updateData},
            {new: true}
        );
        res.status(200).json({
            message :  process.env.MSG_7 + userId + process.env.MSG_8,
            user : updatedUser
        });


    }catch(error){
        console.error(process.env.MSG_9, error);
        res.status(500).json({message : process.env.MSG_10})
    }
}

//delete user
exports.deleteById = async (req, res) => {
    try{
        const {userId} = req.params;
        const user = await User.findOne({userId});
        if(!user){
            return res.status(400).json({message : process.env.MSG_11});
        }
        const result = await User.findOneAndUpdate(
            { userId },  
            { $set: { isDeleted: true } },  
            { new: true }  
        );
        if (!result) {
            return res.status(500).json({ message: "Error while marking user as deleted. Please try again." });
        }
        res.status(200).json({message : process.env.MSG_12 , result});        
        
    }catch(error){
        console.error("the error is in: " + error);
        res.status(500).json({message : process.env.MSG_13})
    }
};

//New Login Module -> otp validation added
exports.sendOtpForLogin = async (req, res) => {
    try{
        const{email, password} = req.body;
        //validate email format
        if(!validateEmailFormat(email)){
            return res.status(400).json({message: process.env.MESSAGE_16})
        }
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({message:process.env.MESSAGE_17});
        }
        //if match found -> go for password checking
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            //401 -> unauthorized access > if pwd doesnot match
            return res.status(401).json({message: process.env.MESSAGE_18});
        }

        //generate otp
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedLoginOtp = await bcrypt.hash(otp, 10);
        const OtpExpiryTime = Date.now() + 10 * 60 * 1000; // valid for 10 minutes 
        user.loginOTP = hashedLoginOtp;
        user.loginOtpExpiresAt = OtpExpiryTime;
        await user.save();

        //send otp in html template
        const emailContentForLogin = `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <p>We received a request for Login. To complete the login, please use the following One-Time-Password(OTP):</p>
                <p style="font-size: 20px; text-align:center; font-weight: bold; color:rgb(68, 152, 231);">${otp}</p>
                <p>This OTP is valid for the next 10 minutes.Please do not share this OTP with anyone for security reasons.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you for using our service!</p>
                <p>Best Regards,<br>AAS International</p>
            </body>
        </html>
    `;

       //send otp in mail
       const mailingOptions = {
           from: process.env.EMAIL_ID,
           to: user.email,
           subject: process.env.SUBJECT_1,
           html: emailContentForLogin,
       };
       await transporter.sendMail(mailingOptions);
       res.status(200).json({message: process.env.MESSAGE_19});


    }catch(error){
        res.status(500).json({message: process.env.MESSAGE_20, error});
    }
}

//verify Login OTP
exports.verifyLoginOTP = async (req, res) => {
    try{
        const{email, otp} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({message: process.env.MESSAGE_21});
        }
        console.log(user.loginOtpExpiresAt);
        if(!user.loginOtpExpiresAt || user.loginOtpExpiresAt < Date.now()){
            return res.status(400).json({message: process.env.MESSAGE_22});
        }

        const isLoginOTPValid = await user.compareLoginOTP(otp);
        if(!isLoginOTPValid){
            return res.status(400).json({message: process.env.MESSAGE_23});
        }

        const token = generateToken({id: user._id, role: user.role});
        user.loginOTP = undefined;
        user.loginOtpExpiresAt = undefined;
        user.save();
        res.status(200).json({ 
            message: process.env.MESSAGE_24,
            token,
            email: user.email,
            role: user.role,
        });


    }catch(error){
        res.status(500).json({message: process.env.MESSAGE_25, error});
    }    
}





//forget pasword section
exports.sendtOTP = async (req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message: process.env.MESSAGE_26});
        }

        //recovery email -> yes
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiresAt = Date.now() + 10 * 60 * 1000; // for 10 minutes
        user.resetOTP = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();


        //send otp in html template
         const emailContent = `
         <html>
             <body style="font-family: Arial, sans-serif; color: #333;">
                 <p>We received a request to reset your password. Please use the OTP below to proceed.</p>
                 <p style="font-size: 20px; text-align:center; font-weight: bold; color:rgb(68, 152, 231);">${otp}</p>
                 <p>Your OTP is valid for the next 10 minutes.</p>
                 <p>If you did not request this, please ignore this email.</p>
                 <p>Thank you for using our service!</p>
             </body>
         </html>
     `;

        //send otp in mail
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: user.email,
            subject: process.env.SUBJECT_2,
            html: emailContent,
            //text: `Your OTP for resetting password is: ${otp}. OTP will be valid for next 10 minutes.`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: process.env.MESSAGE_19});
    }catch(error){
        res.status(500).json({message: process.env.MESSAGE_20, error});
    }
};


//Reset Password section
exports.resetPassword = async (req, res) => {
    try{
        const {email, otp, newPassword} = req.body;
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(404).json({message: process.env.MESSAGE_27});
        }
        if(!user.otpExpiresAt || user.otpExpiresAt < Date.now()){
            return res.status(400).json({message: process.env.MESSAGE_22});
        }

        const isOTPValid = await user.compareOTP(otp);
        if(!isOTPValid){
            return res.status(400).json({message: process.env.MESSAGE_23});
        }

        //if OTP: valid -> update password
        user.password = newPassword;
        user.resetOTP = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({message: process.env.MESSAGE_28});
 
    }catch(error){
        res.status(500).json({message: process.env.MESSAGE_29 ,error});
    }
};

