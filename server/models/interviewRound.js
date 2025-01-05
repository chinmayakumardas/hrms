const mongoose = require(process.env.MONGOOSE);
const mongooseSequence = require(process.env.MONGOOSE_SEQUENCE);
const InterviewRoundSchema = new mongoose.Schema
({
    roundId:{type:Number,unique:true},
    roundName:{type:String,required:true,unique: true,} ,
    isDeleted:{type:Boolean,default:false},
});
InterviewRoundSchema.plugin(mongooseSequence(mongoose), { inc_field: 'roundId' });

const InterviewRound = mongoose.model(process.env.INTERVIEW_ROUND,InterviewRoundSchema);


module.exports = InterviewRound;