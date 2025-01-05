const express = require(process.env.EXPRESS);
const {registerUser, fetchAllUsers, updateUserById, deleteById, sendtOTP, resetPassword, sendOtpForLogin, verifyLoginOTP} = require('.'+process.env.CONTROLLER+'authController');
const validateToken = require('.'+process.env.MIDDLEWARES+'authMiddleware');
const router = express.Router();
//need to add middleware to give access to protected resources only after authentication

router.post(process.env.REGISTER,validateToken, registerUser);
router.get(process.env.FETCHALL_USER,validateToken, fetchAllUsers);
router.patch(process.env.UPDATE_USER,validateToken, updateUserById);
router.patch(process.env.DELETE_USER,validateToken,deleteById);

//router.post('/login', loginUser);

//Re-Modified login section
router.post(process.env.LOGIN, sendOtpForLogin);
router.post(process.env.VERIFY_LOGIN, verifyLoginOTP);

//send otp
router.post(process.env.FORGET_PASSWORD, sendtOTP);
router.post(process.env.RESET_PASSWORD, resetPassword);

router.get(process.env.PROTECTED, validateToken, (req, res) => {
    res.status(200).json({message: process.env.MESSAGE1, user: req.user});
});
module.exports = router;

