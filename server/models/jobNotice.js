const mongoose = require(process.env.MONGOOSE);
const mongooseSequence = require(process.env.MONGOOSE_SEQUENCE);
const{Schema}=mongoose
const jobNoticeSchema = new Schema({
    jobNoticeId:{ type: Number, unique: true },
    jobTitle : {
        type : String
    },
    description : {
        type : String
    },
    publishDate : {
        type: String, // Changed to String
        default: () => new Date().toISOString().split('T')[0], // Default to current date in YYYY-MM-DD format
        validate: {
            validator: function (value) {
                // Regex to validate YYYY-MM-DD format
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            message: process.env.MESSAGE_2
        }
    },
    expiryDate : {
        type: String, // Changed to String
        default: () => new Date().toISOString().split('T')[0], // Default to current date in YYYY-MM-DD format
        validate: {
            validator: function (value) {
                // Regex to validate YYYY-MM-DD format
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            message: process.env.MESSAGE_2
        }
        
    },
    jobCategory : {
        type : String
       
    },
    status : {
        type: String,
        enum: ["pending", "approved"],
        default: 'pending'
    },
    noOfPositions : {
        type: Number
       
    },
    userId : {
        type :  String
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    feedback : {
        type: String,
        default: " "
    },
    jobId : {
        type: String,
        unique: true, 
        sparse: true
    }
    
 
});
jobNoticeSchema.plugin(mongooseSequence(mongoose), { inc_field: 'jobNoticeId' });
module.exports = mongoose.model(process.env.JOB_NOTICE, jobNoticeSchema);