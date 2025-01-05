const express = require(process.env.EXPRESS);
const router=express.Router();
const crudJobNotice=require('.'+process.env.CONTROLLER+'jobNoticeController')
const validateToken = require('.'+process.env.MIDDLEWARES+'authMiddleware');
router.post(process.env.SAVE_JOB_NOTICE,validateToken,crudJobNotice.saveJobNotice)
router.patch(process.env.UPDATE_JOB_NOTICE,validateToken,crudJobNotice.updateJobNotice)
router.patch(process.env.DELETE_JOB_NOTICE,validateToken,crudJobNotice.deleteJobNotice)
router.patch(process.env.SET_JOB_POSTING_STATUS,validateToken,crudJobNotice.updatestatusJobNotice)
router.get(process.env.GET_NOTICE_LIST,validateToken,crudJobNotice.getJobNoticeList);
router.get(process.env.GET_NOTICE_LIST_BY_ID,validateToken,crudJobNotice.getJobNoticeListById);
module.exports=router
