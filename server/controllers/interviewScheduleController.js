const nodemailer = require(process.env.NODEMAILER);
const InterviewSchedule= require('.'+process.env.MODELS+'InterviewSchedule');
const InterviewFeedback = require('.'+process.env.MODELS+'InterviewerFeedback');
// require('dotenv').config();

//setup nodemailer transport
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//function to send Email
async function sendEmail(to, subject, text){
   const mailOptions = {
    from : process.env.EMAIL_USER,
    to : to,
    subject: subject,
    text: text,
   } ;

   try {
    await transporter.sendMail(mailOptions);
   // console.log('Email sent to ', to)
   } catch (error) {
    //   console.error('Error Sending email:', error);
      throw new Error('Failed to send email');
   }
}

// to schedule an interview
exports.saveInterviewSchedule = async (req, res)=> {
    const {
        applicantId,
        interviewDate,
        interviewMode,
        interviewTime,
        selectedRound,
        interviewerName,
        interviewerEmail,
        candidateEmail,
    }= req.body;

    const interviewDetails= {
        applicantId,
        interviewDate,
        interviewMode,
        interviewTime,
        selectedRound,
        interviewerName,
        generateEmailCandidate: false,
        generateEmailInterviewer: false,
        
    };
    try {
       
        const newInterview = new InterviewSchedule(interviewDetails);
        await newInterview.save();
        // generate email for candidate
        const candidateEmailSubject = `Interview Schedule for id: ${applicantId}`;
        const candidateEmailText = `Hello, \n\nYour Interview on ${interviewDate} at ${interviewTime} via ${interviewMode}.`;
        
        // Generate email for interviewer
        const interviewerEmailSubject = `Interview Scheduled for ${interviewerName}`;
        const interviewerEmailText = `Hello,\n\nYou are scheduled to interview ${interviewerName} on ${interviewDate} at ${interviewTime} via ${interviewMode}.`;

        // Send email to candidate 
        if (candidateEmail) {
            await sendEmail(candidateEmail, candidateEmailSubject, candidateEmailText);
            newInterview.generateEmailCandidate= true;
        }

        //Send email to interviewer 
        if(interviewerEmail){
            await sendEmail(interviewerEmail, interviewerEmailSubject, interviewerEmailText);
            newInterview.generateEmailInterviewer= true;
        }
        await newInterview.save();

        res.status(200).json({message: process.env.SCHEDULE_EMAIL,
            interviewDetails: newInterview,
        });

    } catch (error) {
        console.error('Error scheduling interview :', error);
    }
};

//update interview schedule
exports.updateInterviewSchedule = async (req, res) => {
    const { applicantId } = req.params;  
    const {
        interviewDate,
        interviewMode,
        interviewTime,
        interviewerName,
        interviewerEmail,
        candidateEmail
    } = req.body;

    try {
        // Find the interview schedule by applicantId
        const interview = await InterviewSchedule.findOne({ applicantId });

        if (!interview) {
            return res.status(404).json({ message: process.env.INTERVIEW_SCHEDULE_NOT_FOUND});
        }

        if (interviewDate) interview.interviewDate = interviewDate;
        if (interviewMode) interview.interviewMode = interviewMode;
        if (interviewTime) interview.interviewTime = interviewTime;
        if (interviewerName) interview.interviewerName = interviewerName;

        await interview.save();

        // Generate and send emails if necessary
        if (candidateEmail) {
            const candidateEmailSubject = `Updated Interview Schedule for ID: ${applicantId}`;
            const candidateEmailText = `Hello, \n\nYour interview has been updated. The new schedule is:\nInterview Date: ${interviewDate}\nTime: ${interviewTime}\nMode: ${interviewMode}`;
            await sendEmail(candidateEmail, candidateEmailSubject, candidateEmailText);
        }

        if (interviewerEmail) {
            const interviewerEmailSubject = `Updated Interview Schedule for Interviewer: ${interviewerName}`;
            const interviewerEmailText = `Hello,\n\nThe interview schedule has been updated. The new schedule is:\nInterview Date: ${interviewDate}\nTime: ${interviewTime}\nMode: ${interviewMode}`;
            await sendEmail(interviewerEmail, interviewerEmailSubject, interviewerEmailText);
        }

        res.status(200).json({ message: process.env.SCHEDULE_EMAIL_UPDATE, interviewDetails: interview });
    } catch (error) {
        console.error('Error updating interview schedule:', error);
        res.status(500).json({ message:process.env. ERROR_UPDATE_SCHEDULE });
    }
};

//Get Finalist candidate who clear all rounds
exports.getFinalistCandidates= async(req, res)=>{
    try {
        const finalists= await InterviewSchedule.find({clearedAllRounds: true});

        if (finalists.length===0){
            return res.status(404).json({message :'No finalist found.'});
        }

        res.status(200).json({message:process.env.FINALLIST_RETIRIVED , finalists});
    } catch (error) {
        console.error('Error fetching finalists: ', error);
        res.status(500).json({message:process.env.ERROR_FECTHING});
    }
};


