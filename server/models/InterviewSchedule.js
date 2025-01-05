const mongoose = require (process.env.MONGOOSE);
const AutoIncrement = require(process.env.MONGOOSE_SEQUENCE)(mongoose);

const InterviewScheduleSchema= new mongoose.Schema({
    schedule_id:{type: Number, unique:true},
    applicantId:{ type: Number, unique: true},
    interviewDate: { type: Date, required: true },
    interviewMode: { type: String, required: true },
    interviewTime: { type: String, required: true },
    interviewerName: { type: String, required: true },
    generateEmailCandidate: { type: Boolean, default: false },
    generateEmailInterviewer: { type: Boolean, default: false },
    round1: { type: Boolean, default: false },
    round2: { type: Boolean, default: false },
    round3: { type: Boolean, default: false },
    round4: { type: Boolean, default: false },
    round5: { type: Boolean, default: false },
    clearedAllRounds: { type: Boolean, default: false },
});

// Automatically set 'clearedAllRounds' to true if all rounds are passed
InterviewScheduleSchema.pre('save', function (next) {
    this.clearedAllRounds = this.round1 && this.round2 && this.round3 && this.round4 && this.round5;
    next();
});
InterviewScheduleSchema.plugin(AutoIncrement, { inc_field: 'schedule_id' });
module.exports= mongoose.model(process.env.INTERVIEW_SCHEDULE, InterviewScheduleSchema);