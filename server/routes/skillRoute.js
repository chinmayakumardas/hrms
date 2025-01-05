const express = require(process.env.EXPRESS);
const protect = require('.'+process.env.MIDDLEWARES+'authMiddleware');
const { 
    saveSkill, 
    updateSkill, 
    deleteSkill, 
    getSkillList, 
    getSkillById 
} = require('.'+process.env.CONTROLLER+'skillController');

const router = express.Router();

// Route to create or restore a skill
router.post(process.env.SAVE_SKILL, protect, saveSkill);

// Route to update a skill by ID
router.put(process.env.UPDATE_SKILL, protect, updateSkill);

// Route to delete a skill by ID (soft delete)
router.delete(process.env.DELETE_SKILL, protect, deleteSkill);

// Route to get all skills (not deleted)
router.get(process.env.GET_SKILL_LIST, protect, getSkillList);

// Route to get a skill by ID
router.get(process.env.GET_SKILL_BY_ID, protect, getSkillById);

module.exports = router;
