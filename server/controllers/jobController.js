
const job = require('.'+process.env.MODELS+'job');
//const Skill = require("../models/skill");
//const InterviewRound = require("../models/InterviewRound");


// Save a new job post
exports.saveJob = async (req, res) => {
    const {
        ID,
        jobId ,
        jobTitle,
        jobDescription,
        jobCategory,
        experience,
        jobRole,
        interviewType,
        interviewRounds,
        workingSchedule,
        location,
        publishDate,
        expiredDate,
        skills,
        salary,
        numberOfVacancies
    } = req.body;

    try {
        // // Verify Skills exist
        // const skillDocs = await Skill.find({ _id: { $in: skills } });
        // if (skillDocs.length !== skills.length) {
        //     return res.status(400).json({ message: "Some skills are invalid" });
        // }

        // // Verify interview rounds exist
        // const roundDocs = await InterviewRound.find({ _id: { $in: interviewRounds } });
        // if (roundDocs.length !== interviewRounds.length) {
        //     return res.status(400).json({ message: "Some interview rounds are invalid" });
        // }

        // Create a new job object
        const newJob = new job({
            ID,
            jobId,
            jobTitle,
            jobDescription,
            jobCategory,
            experience,
            jobRole,
            interviewType,
            interviewRounds,
            workingSchedule,
            location,
            publishDate,
            expiredDate,
            skills,
            salary,
            numberOfVacancies
        });
        // Save the job to the database
        const savedJob = await newJob.save();
        res.status(201).json({ message: process.env.MESSAGE_48, job: savedJob });
    } catch (error) {
        console.error(process.env.MESSAGE_49, error);
        res.status(500).json({ message: process.env.MESSAGE_49, error: error.message });
    }
};


  exports.getJobById = async (req, res) => {
      const { jobId } = req.params;
     
      try {
        const jobs = await job.findOne({ jobId: jobId})
          // .populate("skills", "name")
          // .populate("interviewRounds", "roundName description")
          // .exec();
     
        if (!jobs) {
          return res.status(404).json({ message: process.env.MESSAGE_50 });
        }
     
        res.status(200).json({ jobs });
      } catch (error) {
        res.status(500).json({ message: process.env.MESSAGE_51, error: error.message });
      }
    };
    // const Skill = require("../models/skill");

// exports.createSkill = async (req, res) => {
//     const {name} = req.body;

//     try {
    
        
//         const newSkill = new Skill({ name });

//         const savedSkill = await newSkill.save();
//         res.status(201).json({ message: "Skill created successfully", skill: savedSkill });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error creating skill", error: error.message });
//     }
// };
// const InterviewRound = require("../models/InterviewRound");

// exports.createInterviewRound = async (req, res) => { // Exporting the correct function name
//     const { roundName, description } = req.body;
//     try {
//         const newRound = new InterviewRound({ roundName, description });
//         const savedRound = await newRound.save();
//         res.status(201).json({ message: "InterviewRound created successfully", round: savedRound });
//     } catch (error) {
//         res.status(500).json({ message: "Error creating Interview Round", error: error.message });
//     }
// };
// PUT route to update job by jobId
exports.updateJob =  async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            jobTitle,
            jobDescription,
            jobCategory,
            experienece,
            jobRole,
            interviewType,
            interviewRounds,
            workingSchedule,
            location,
            publishDate,
            expiredDate,
            skills,
            salary,
            numberOfVacancies
        } = req.body;

        const updatedJob = await job.findOneAndUpdate(
            { jobId: jobId },
            {
                jobTitle,
                jobDescription,
                jobCategory,
                experienece,
                jobRole,
                interviewType,
                interviewRounds,
                workingSchedule,
                location,
                publishDate,
                expiredDate,
                skills,
                salary,
                numberOfVacancies
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: process.env.MESSAGE_52 });
        }

        return res.status(200).json(updatedJob);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: process.env.MESSAGE_53 });
    }
};
// Soft delete a job
exports.deleteJob = async (req, res) => {
  const { jobId } = req.params;
 
  try {
      // Find the job by jobId and mark it as deleted (set isDeleted to true)
      const jobs = await job.findOneAndUpdate(
          { jobId: jobId} , 
          { isDeleted: true },
          { new: true }
      );
      console.log(jobs);
      if (!jobs) {
          return res.status(404).json({ message: process.env.MESSAGE_50 });
      }
 
      res.status(200).json({ message: process.env.MESSAGE_54, jobs });
  } catch (error) {
      res.status(500).json({ message: process.env.MESSAGE_55, error: error.message });
  }
};

exports.getJobList = async (req, res) => {
    try {
        // Use the correct 'Job' model and query it
        const jobs = await job.find()
        .where("isDeleted").equals(false);
       
          // Corrected model name: 'Job' not 'job'
            // .populate("skills", "name")  // Ensure the field name 'skills' matches your schema
            // .populate("interviewRounds", "roundName description")  // Ensure the field name 'interviewRounds' matches your schema
            // .exec();
 
        res.status(200).json({ message: process.env.MESSAGE_56, jobs });
 
    } catch (error) {
        res.status(500).json({ message: process.env.MESSAGE_57,  error });
    }
};