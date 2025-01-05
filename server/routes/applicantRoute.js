const express = require(process.env.EXPRESS);
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
});
const { submitApplication, updateApplicantStatus, getApprovedApplicants, downloadResume, getbyid,getAll } = require('.'+process.env.CONTROLLER+'ApplicantController');
const protect = require('.'+process.env.MIDDLEWARES+'authMiddleware');
 
// Router setup
const router = express.Router();
 
// POST route for submitting an application
// router.post('/submit', upload.single('uploadYourResume'), protect,submitApplication);


// Put route for update the status of the candidate
router.put(process.env.UPDATE_APPLICANT_STATUS, protect,updateApplicantStatus);

// GET route for fetching all approved applicants's details including resume
router.get(process.env.GET_SHORTLISTED_APPLICANT_LIST,protect ,getApprovedApplicants);

// download the resume
router.get(process.env.DOWNLOAD_RESUME_BY_ID,protect, downloadResume);

//get applicants details by id
router.get(process.env.GET_APPLICANT_DETAILS_BY_ID,protect,getbyid);

//Get all aplicants details
router.get(process.env.GET_APPLICANT_DETAILS, protect, getAll);


 
module.exports = router;