const express = require(process.env.EXPRESS);
const router = express.Router();
const protect=require('.'+process.env.MIDDLEWARES+'authMiddleware');

const { saveRound , updateRound , deleteRound, getAllRounds, getRoundById} = require('../controllers/roundController');


router.post(process.env.SAVE_INTERVIEW_ROUND,protect,saveRound);

router.put(process.env.UPDATE_INTERVIEW_ROUND,protect,updateRound);

router.delete(process.env.DELETE_INTERVIEW_ROUND,protect, deleteRound);

router.get(process.env.GET_INTERVIEW_ROUND_LIST,protect,getAllRounds);

router.get(process.env.GET_INTERVIEW_ROUND_LIST_BY_ID,protect,getRoundById)

module.exports = router;