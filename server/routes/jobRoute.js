const express = require(process.env.EXPRESS);
const { saveJob,
     getJobList ,
     getJobById ,
     deleteJob,
     updateJob} = require('.'+process.env.CONTROLLER+'jobController');
const protect = require('.'+process.env.MIDDLEWARES+'authMiddleware');

const router = express.Router();

// Route to create a new job post
router.post(process.env.SAVE_JOB, protect, saveJob);

// Route to get a job post by its ID
router.get(process.env.GET_JOB_LIST_BY_ID, protect, getJobById);
//Rourte to get all job post
router.get(process.env.GET_JOB_LIST, protect, getJobList);
//Router to update a Job post by id
router.put(process.env.UPDATE_JOB,protect, updateJob);
//router to delete a job post by id
router.delete(process.env.DELETE_JOB, protect,deleteJob);

module.exports = router;
