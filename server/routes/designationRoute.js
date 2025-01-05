 
const express = require(process.env.EXPRESS);
const protect = require('.'+process.env.MIDDLEWARES+'authMiddleware');
const {
    createDesignation,
    getAllDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation,
} = require('.'+process.env.CONTROLLER+'designationController');
 
const router = express.Router();
 
// Route for creating a new designation
router.post(process.env.SAVE_DESIGNATION,protect,createDesignation);
 
// Route for getting all designations
router.get(process.env.GET_DESIGNATION_LIST, protect,getAllDesignations);
 
// Route for getting a specific designation by designationId
router.get(process.env.GET_DESIGNATION_BY_ID, protect,getDesignationById);
 
// Route for updating a designation by designationId
router.put(process.env.UPDATE_DESIGNATION, protect,updateDesignation);
 
// Route for soft deleting a designation by designationId
router.delete(process.env.DELETE_DESIGNATION, protect,deleteDesignation);
 
module.exports = router;