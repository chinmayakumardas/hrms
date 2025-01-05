const mongoose = require(process.env.MONGOOSE);
const AutoIncrement = require(process.env.MONGOOSE_SEQUENCE)(mongoose);

const OfferLetterSchema = new mongoose.Schema({
    applicantId:{type:String, unique:true},
    offerletter_id:{type:Number, unique:true, required:true},
    date:{type:Date, required: true},
    name:{type:String, required: true},
    address:{type:String, required: true},
    role:{type:String, required: true},
    duration:{type:String, required: true},
    salary:{type:Number, required: true},
    startdate:{type:Date, required:true},
    mail:{type:String, required:true},
    acknowledgement: { type: Boolean, default: false },
}, {timestamps:true});


OfferLetterSchema.plugin(AutoIncrement, { inc_field: 'offerletter_id' });
module.exports = mongoose.model(process.env.OFFER_LETTER, OfferLetterSchema);

