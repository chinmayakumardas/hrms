const Skill = require('.'+process.env.MODELS+'/Skill');

// Create or restore a skill
exports.saveSkill = async (req, res) => {
    const { skill } = req.body;
    try {
        const existingSkill = await Skill.findOne({ skill });
        if (existingSkill) {
            if (existingSkill.isDeleted) {
                existingSkill.isDeleted = false;
                await existingSkill.save();
                return res.status(200).json({ message: process.env.MESSAGE_3, skill: existingSkill });
            }
            return res.status(400).json({ message: process.env.MESSAGE_4 });
        }

        const newSkill = new Skill({ skill });
        await newSkill.save();
        res.status(201).json({ message: process.env.MESSAGE_5, skill: newSkill });
    } catch (err) {
        res.status(500).json({ message: process.env.MESSAGE_6, error: err.message });
    }
};


// Update a skill by skillId
exports.updateSkill = async (req, res) => {
    const { skillId } = req.params;
    const { skill } = req.body;
 
    try {
        const existingSkill = await Skill.findOne({ skill });
        if (existingSkill && !existingSkill.isDeleted) {
            return res.status(400).json({ message: process.env.MESSAGE_4 });
        }
 
        const updatedSkill = await Skill.findOneAndUpdate(
            { skillId }, // Find by skillId, not _id
            { skill },
            { new: true }
        );
 
        if (!updatedSkill || updatedSkill.isDeleted) {
            return res.status(404).json({ message: process.env.MESSAGE_7 });
        }
 
        res.status(200).json({ message: process.env.MESSAGE_8, skill: updatedSkill });
    } catch (err) {
        res.status(500).json({ message: process.env.MESSAGE_6, error: err.message });
    }
};

// Delete a skill by id (Soft delete)
exports.deleteSkill = async (req, res) => {
    const { skillId } = req.params;

    try {
        const deletedSkill = await Skill.findOne({ skillId });
        if (!deletedSkill) {
            return res.status(404).json({ message: process.env.MESSAGE_9 });
        }
        if (deletedSkill.isDeleted) {
            return res.status(404).json({ message: process.env.MESSAGE_10 });
        }

        deletedSkill.isDeleted = true;
        await deletedSkill.save();

        res.status(200).json({ message: process.env.MESSAGE_11, skill: deletedSkill });
    } catch (error) {
        console.error(process.env.MESSAGE_12, error);
        res.status(500).json({ message: process.env.MESSAGE_6, error: error.message });
    }
};

// Get all skill list
exports.getSkillList = async (req, res) => {
    try {
        const skills = await Skill.find({ isDeleted: false });
        res.status(200).json({ skills });
    } catch (err) {
        res.status(500).json({ message: process.env.MESSAGE_6, error: err.message });
    }
};

// Get a single skill by id
exports.getSkillById = async (req, res) => {
    const skill = await Skill.findOne({skillId: req.params.skillId });

    try {
        if (!skill) {
            return res.status(404).json({ message: process.env.MESSAGE_9 });
        }

        res.status(200).json({ skill });
    } catch (err) {
        res.status(500).json({ message: process.env.MESSAGE_6, error: err.message });
    }
};
