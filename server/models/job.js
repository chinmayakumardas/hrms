


// // const mongoose = require("mongoose");
// // const { type } = require("os");
// // const jobSchema = new mongoose.Schema({
// //     jobTitle:{type:String,required:true},
// //     jobDescription:{type:String,required:true},
// //     jobCategory:{type:String,required:true},
// //     experienece:{type:String,required:true},
// //     jobRole:{type:String,required:true},
// //     interviewType:{type:String,required:true},
// //     interviewRounds:[{type:mongoose.Schema.Types.ObjectId,ref:"InterviewRound"}],
// //     workingSchedule:{type:String,required:true},
// //     location:{type:String,required:true},
// //     publishDate:{type:Date,default:Date.now()},
// //     expiredDate:{type:Date,required:true},
// //     skills:[{type:mongoose.Schema.Types.ObjectId,ref:"Skill"}],
// //     salary:{type:String,required:true},
// //     numberOfVacancies:{type:Number,required:true},

// // });
// // module.exports=mongoose.model("job",jobSchema);


// const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence") (mongoose);

// const jobSchema = new mongoose.Schema({
//     jobId:{type:Number,unique:true},
//     jobTitle: { type: String, required: true },
//     jobDescription: { type: String, required: true },
//     jobCategory: { type: String, required: true },
//     experienece: { type: String, required: true },
//     jobRole: { type: String, required: true },
//     interviewType: { type: String, required: true },
//     interviewRounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewRound', required: true }],
//     workingSchedule: { type: String, required: true },
//     location: { type: String, required: true },  // Ensure this field is required
//     publishDate: { type: Date, required: true },
//     expiredDate: { type: Date, required: true },  // Ensure this field is required
//     skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }],
//     salary: { type: String, required: true },
//     numberOfVacancies: { type: Number, required: true }
// });

// // Autoincrement jobid
 
// jobSchema .plugin(AutoIncrement, {inc_field:"jobId"});
// module.exports = mongoose.model("Job", jobSchema);
const mongoose = require(process.env.MONGOOSE);
 const AutoIncrement = require("mongoose-sequence")(mongoose); // Pass mongoose to the plugin

const jobSchema = new mongoose.Schema({
    ID:{type:Number, unique:true,required: true},
    jobId: { type: String, unique: true,required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobCategory: { type: String, required: true },
    experience: { type: String, required: true },
    jobRole: { type: String, required: true },
    interviewType: { type: String, required: true },
    //interviewRounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewRound', required: true }],
    interviewRounds: [{type:String , required:true}],
    workingSchedule: { type: String, required: true },
    location: { type: String, required: true },
    publishDate: { type: Date, required: true },
    expiredDate: { type: Date, required: true },
    // skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true }],
    skills:[{type:String, required:true}],
    salary: { type: String, required: true },
    numberOfVacancies: { type: Number, required: true },
    isDeleted: {type:Boolean,default:false},
});
// Autoincrement jobId
jobSchema.plugin(AutoIncrement, { inc_field: 'ID' });

module.exports = mongoose.model(process.env.JOB, jobSchema);

// const mongoose= require("mongoose");

// const SkillSchema= new mongoose.Schema({
//     name:{type:String,required:true,unique:true},
//    // skillid:{type:Number,required:true,unique:true}
// });
// module.exports= mongoose.model("Skill",SkillSchema);




// const mongoose = require('mongoose');
// const Skill = require('../models/job'); // Assuming you have a Skill model

// // Validate the skills field
// formData.skills.forEach(skillId => {
//   if (!mongoose.Types.ObjectId.isValid(skillId)) {
//     return res.status(400).send({ message: `Invalid skill ID: ${skillId}` });
//   }
// });
// const mongoose= require("mongoose");
// const InterviewRoundSchema= new mongoose.Schema({
//     roundName:{type:String,required:true},
//     description:{type:String},

// });
// module.exports= mongoose.model("InterviewRound",InterviewRoundSchema);

