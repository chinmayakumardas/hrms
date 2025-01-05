const mongoose = require(process.env.MONGOOSE);
const AutoIncrement = require(process.env.MONGOOSE_SEQUENCE) (mongoose);
 
const applicantSchema = new mongoose.Schema({
    applicantId : Number,
    fullName: String,
    email: String,
    contact: String,
    gender: String,
    dateOfBirth: Date,
    passoutYear: Date,
    highestQualification: String,
    yearOfExperience: String,
    address: String,
    skills: [String],
    uploadYourResume: Buffer,  
    role : String,
    appliedDate: { type: Date, default: Date.now },
    status : {type : String, default: "pending"}
});
 
applicantSchema.plugin(AutoIncrement, {inc_field : "applicantId"});
 
 
const Applicant = mongoose.model(process.env.APPLICANT, applicantSchema);
 
module.exports = Applicant;