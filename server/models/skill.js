const mongoose= require(process.env.MONGOOSE);
const mongooseSequence = require(process.env.MONGOOSE_SEQUENCE);
const SkillSchema=new mongoose.Schema({
    skillId: { type: Number, unique: true },
    skill:{
        type:String,
        unique: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});
SkillSchema.plugin(mongooseSequence(mongoose), { inc_field: 'skillId' });
 
module.exports=mongoose.model(process.env.SKILL, SkillSchema);