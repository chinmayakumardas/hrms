const express= require(process.env.EXPRESS);
const router = express.Router();
const { saveInterviewSchedule,  updateInterviewSchedule,getFinalistCandidates }=  require('.'+process.env.CONTROLLER+'interviewScheduleController');
const validateToken = require('.'+process.env.MIDDLEWARES+'authMiddleware');
router.post(process.env.SAVE_INTERVIEW_SCHEDULE,validateToken, saveInterviewSchedule);
router.put(process.env.UPDATE_INTERVIEW_SCHEDULE,validateToken, updateInterviewSchedule);
router.get(process.env.GET_FINAL_SELECTED_CANDIDATE_LIST,validateToken, getFinalistCandidates)


module.exports = router;

