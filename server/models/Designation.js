const mongoose = require(process.env.MONGOOSE);
const mongooseSequence = require(process.env.MONGOOSE_SEQUENCE);
const Schema = mongoose.Schema;
 
// Designation schema definition
const DesignationSchema = new Schema({
    designationId: { type: Number, unique: true },
    designation: {
        type: String,
        unique: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
 
// Applying mongoose-sequence plugin for auto increment of designationId
DesignationSchema.plugin(mongooseSequence(mongoose), { inc_field: 'designationId' });
 
// Exporting Designation model
const Designation = mongoose.model(process.env.DESIGNATION, DesignationSchema);
 
module.exports = Designation;