const Designation = require('.'+process.env.MODELS+'Designation');
// Create a new designation
exports.createDesignation = async (req, res) => {
    try {
        // Check if the designation already exists
        const existingDesignation = await Designation.findOne({ designation: req.body.designation });
        if (existingDesignation) {
            return res.status(400).json({ message:process.env.EXIST_DESIGNATION });
        }
 
        // Create a new designation
        const designation = new Designation({
            designation: req.body.designation
        });
 
        await designation.save();
        res.status(201).json({ message: process.env.SAVE_DESIGNATION, designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
// Get all designations
exports.getAllDesignations = async (req, res) => {
    try {
        const designations = await Designation.find({ isDeleted: false });
        res.status(200).json(designations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
// Get designation by designationId
exports.getDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findOne({ designationId: req.params.designationId, isDeleted: false });
        if (!designation) {
            return res.status(404).json({ message: process.env.NOT_FOUND_DESIGNATION});
        }
        res.status(200).json(designation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
// Update designation by designationId
exports.updateDesignation = async (req, res) => {
    try {
        const designation = await Designation.findOneAndUpdate(
            { designationId: req.params.designationId, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!designation) {
            return res.status(404).json({ message: process.env.NOT_FOUND_DESIGNATION });
        }
        res.status(200).json({ message: process.env.UPDATE_DESIGNATION, designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
// Soft delete designation by designationId
exports.deleteDesignation = async (req, res) => {
    try {
        const designation = await Designation.findOneAndUpdate(
            { designationId: req.params.designationId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!designation) {
            return res.status(404).json({ message: process.env.NOT_FOUND_DESIGNATION });
        }
        res.status(200).json({ message: process.env.DELETE_DESIGNATION, designation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};