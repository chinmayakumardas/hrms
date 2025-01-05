const InterviewerFeedback= require('.'+process.env.MODELS+'InterviewerFeedback');
const InterviewSchedule= require('.'+process.env.MODELS+'InterviewSchedule');

//add feedback
exports.addFeedback= async (req, res) => {
    const {roundName,
           feedback,
           result,
           applicantId
    }=req.body;
    try {
        const feedbackRecord = new InterviewerFeedback({
            roundName,
            feedback,
            result,
            applicantId
        });

        await feedbackRecord.save();

        const interview = await InterviewSchedule.findOne({applicantId});
        if (!interview) {
            return res.status(404).json({ message:process.env.INTERVIEW_SCHEDULE_NOT_FOUND });
        }
        //update roundstatus 
        interview[roundName]= result;
        interview.clearedAllRounds= ['round1', 'round2', 'round3', 'round4', 'round5'].every(round => interview[round]);

        await interview.save();
        res.status(200).json({ message: process.env.INTERVIEW_SCHEDULE_UPDATE_STATUS, feedback: feedbackRecord})
    } catch (error) {
       // console.error('Error adding feedback:', error);
        res.status(500).json({ message: process.env.ERROR_FEEDBACK_STATUS});
    }
}

// Update Feedback based on feedbackId
exports.updateFeedback = async (req, res) => {
    const { feedbackId, roundName, feedback, result, applicantId } = req.body;

    try {
        // Update the existing feedback based on feedbackId
        const feedbackRecord = await InterviewerFeedback.findOneAndUpdate(
            { feedbackId },
            { feedback, result, roundName, applicantId },
            { new: true }
        );

        // If no feedback record is found
        if (!feedbackRecord) {
            return res.status(404).json({ message: process.env.EDBACK_NOT_FOUND});
        }

        // Find the interview schedule for the given applicantId
        const interview = await InterviewSchedule.findOne({ applicantId });
        if (!interview) {
            return res.status(404).json({ message:process.env.EDBACK_NOT_FOUND });
        }

        // Update the round status in the InterviewSchedule
        interview[roundName] = result;

        // Update 'clearedAllRounds' based on the results of each round
        interview.clearedAllRounds = ['round1', 'round2', 'round3', 'round4', 'round5'].every(round => interview[round]);

        await interview.save();

    
        res.status(200).json({
            message:process.env.FEEDBACK_UPDATE_STATUS ,
            feedback: feedbackRecord
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ message:process.env.FEEDBACK_UPDATE_STATUS});
    }
};