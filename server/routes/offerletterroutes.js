const express = require(process.env.EXPRESS);
const{ saveData , updateAcknowledgement,sendGreetingEmail} = require('.'+process.env.CONTROLLER+'offerlettercontroller');
const validateToken = require('.'+process.env.MIDDLEWARES+'authMiddleware');
 
// const { updateAcknowledgement } = require('../controllers/offerlettercontroller');  // Import the new function
 
const router = express.Router();
 
// Route to save applicant data
router.post(process.env.SAVE_OFFER_LETTER,validateToken, saveData);
// module.exports = router;
 
// Route to update acknowledgement
router.patch(process.env.UPDATE_OFFER_LETTER_ACKNOWLEDGEMENT,validateToken, updateAcknowledgement);  // New route to handle acknowledgement
 
router.get(process.env.SEND_GREETING_EMAIL,validateToken, sendGreetingEmail);
 
module.exports = router;