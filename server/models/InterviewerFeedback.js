const mongoose= require(process.env.MONGOOSE);
const autoIncrement = require(process.env.MONGOOSE_SEQUENCE)(mongoose);

const InterviewerFeedbackSchema= new mongoose.Schema({
    feedbackId: {type: Number, unique: true},
    roundName: {type:String, required: true},
    feedback:{type: String, required: true},
    result:{type:Boolean, default: false},
    applicantId:{type:Number, ref: 'InterviewSchedule', required: true},
});

InterviewerFeedbackSchema.plugin(autoIncrement, { inc_field: 'feedbackId' });

// Automatically update the InterviewSchedule schema when feedback result changes
InterviewerFeedbackSchema.pre('save', async function (next) {
    try {
        const interview = await mongoose.model('InterviewSchedule').findOne({ applicantId: this.applicantId });

        if (!interview) {
            return next(new Error('Interview not found for the given applicantId.'));
        }

        // Set the round status based on feedback result
        interview[this.roundName] = this.result;

        // Check if all rounds are cleared to set 'clearedAllRounds' status
        interview.clearedAllRounds = interview.round1 && interview.round2 && interview.round3 && interview.round4 && interview.round5;

        await interview.save();

        next();  // Proceed with saving the InterviewerFeedback
    } catch (error) {
        next(error);  
    }
});
module.exports = mongoose.model(process.env.INTERVIEWER_FEEDBACK, InterviewerFeedbackSchema);