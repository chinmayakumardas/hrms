const express = require(process.env.EXPRESS);
const router= express.Router();
const validateToken = require('.'+process.env.MIDDLEWARES+'authMiddleware');
const {addFeedback, updateFeedback}= require('.'+process.env.CONTROLLER+'feedbackController');

router.post(process.env.SAVE_INTERVIEWER_FEEDBACK,validateToken,addFeedback );
router.put(process.env.UPDATE_INTERVIEWER_FEEDBACK,validateToken, updateFeedback);

module.exports= router;