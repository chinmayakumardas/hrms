const Applicant = require('.'+process.env.MODELS+'Applicant');
 

//save opration
// exports.submitApplication = async (req, res) => {
//   try {
//     const { fullName, email, contact, gender, dateOfBirth, passoutYear, highestQualification, yearOfExperience, address, skills, role } = req.body;
//     const uploadYourResume = req.file;
//     const resumeBuffer = uploadYourResume.buffer;
//     const resumeMimeType = req.file.mimetype;
 
//     const existingApplicant = await Applicant.findOne({ email });
//     if (existingApplicant) {
//       return res.status(400).json({ message: process.env.APPLICANT_EXIST });
//     }
 
//     const applicant = new Applicant({
//         fullName,
//         email,
//         contact,
//         gender,
//         dateOfBirth,
//         passoutYear,
//         highestQualification,
//         yearOfExperience,
//         address,
//         skills,
//         uploadYourResume: resumeBuffer,
//         role,
   
//       resumeMimeType,
//     });
 
//     await applicant.save();
//     res.status(200).send({ message: process.env.APPLICANT_SUBMIT});
//   } catch (err) {
//     console.log(err)
//     res.status(500).send({ message: process.env.APPLICANT_SUBMIT_ERROR });
//   }
// };


// update the status of the candidte 

//update APPLICATION STATUS opration
exports.updateApplicantStatus = async (req, res) => {
    try {
      const { applicantId, status } = req.body; // Extract applicantId and status from the request body
  
      if (!applicantId || !status) {
        return res.status(400).json({ message: process.env.APPLICANT_REQUIRED});
      }
  
      // Find the applicant by applicantId
      const applicant = await Applicant.findOne({ applicantId });
  
      if (!applicant) {
        return res.status(404).json({ message: process.env.APPLICANT_NOT_FOUND });
      }
  
      // Update the applicant's status
      applicant.status = status;
  
      // Save the updated applicant
      await applicant.save();
  
      // Prepare the response data, including the resume download link
      const response = {
        applicantId: applicant.applicantId,
        fullName: applicant.fullName,
        email: applicant.email,
        contact: applicant.contact,
        gender: applicant.gender,
        dateOfBirth: applicant.dateOfBirth,
        passoutYear: applicant.passoutYear,
        highestQualification: applicant.highestQualification,
        yearOfExperience: applicant.yearOfExperience,       
        address: applicant.address,
        skills: applicant.skills,
        role: applicant.role,
        status: applicant.status,  // Return the updated status
        resume: `/api/hrms/download/${applicant.applicantId}` // Provide the resume download link
      };
  
      return res.status(200).json({
        message: process.env.APPLICANT_UPDATE_STATUS,
        applicant: response,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: process.env.STATUS_ERROR });
    }
  };
  
  

  
  // getting  approved candidates whoose status are aprroved 
  exports.getApprovedApplicants = async (req, res) => {
    try {
     
      const approvedApplicants = await Applicant.find({ status: "approved" });
        
  
      if (approvedApplicants.length === 0)  {
        return res.status(404).json({ message: process.env.PPROVED_FOUND});
      }
      
      // Map through applicants to return the applicant data along with the resume in base64 format
      const applicantsWithResume = approvedApplicants.map(applicant => ({
        applicantId: applicant.applicantId,
        fullName: applicant.fullName,
  
        email: applicant.email,
        contact: applicant.contact,
        gender: applicant.gender,
        dateOfBirth: applicant.dateOfBirth,
        passoutYear: applicant.passoutYear,
        highestQualification: applicant.highestQualification,
        yearOfExperience: applicant.yearOfExperience,
        address: applicant.address,
        skills: applicant.skills,
        role: applicant.role,
        appliedDate: applicant.appliedDate,
        resume:  `/api/hrms/download/${applicant.applicantId}`, // Convert buffer to base64
      }));
  
      return res.status(200).json(applicantsWithResume);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: process.env. FETCH_ERROR});
    }
  };
  
  
  //  for download the resume of the candidates 
  exports.downloadResume = async (req, res) => {
    try {
      const { applicantId } = req.params;
      const applicant = await Applicant.findOne({ applicantId });
  
      if (!applicant) {
        return res.status(404).json({ message:process.env.APPLICANT_NOT_FOUND });
      }
  
      // Check if resume exists
      if (!applicant.uploadYourResume) {
        return res.status(404).json({ message: process.env.RESUME_NOT_FOUND});
      }
  
  
  
  
      // Set headers for file download
      const fileType = applicant.resumeFileType || 'application/pdf'; // Use 'application/pdf' as default
      const fileName = `resume_${applicant.applicantId}.${fileType === 'application/pdf' ? 'pdf' : 'docx'}`;
  
  
  
      res.setHeader('Content-Type', fileType);  // Set the appropriate file type
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`); // Set the filename for download
      res.setHeader('Content-Length', applicant.uploadYourResume.length);  // Set the length of the file
  
      // Send the file buffer as the response
      res.send(applicant.uploadYourResume);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: process.env.NOT_DOWNLOAD_RESUME});
    }
  };

    // get all aplicants
  exports.getAll = async (req, res) => {
    try {
        // Fetch all applicants from the database
        const applicants = await Applicant.find();
 
        // Check if any applicants are found
        if (!applicants || applicants.length === 0) {
            return res.status(404).send(process.env.APPLICANT_NOT_FOUND);
        }
 
        // Map applicants to include resume download link and necessary details
        const applicantDetails = applicants.map(applicant => ({
            fullname: applicant.fullName,
            email: applicant.email,
            contact: applicant.contact,
            gender: applicant.gender,
            dateOfBirth: applicant.dateOfBirth,
            passoutYear: applicant.passoutYear,
            highestQualification: applicant.highestQualification,
            yearOfExperience: applicant.yearOfExperience,
            address: applicant.address,
            skills: applicant.skills,
            role: applicant.role,
            appliedDate: applicant.appliedDate,
            status: applicant.status,
            resumeMimeType: applicant.resumeMimeType,
            resumeDownloadLink: `/api/hrms/download/${applicant.applicantId}`,  // Link to download the resume
        }));
 
        // Return the list of applicants
        res.status(200).json(applicantDetails);
    } catch (err) {
        res.status(500).send(process.env.NOT_RETRIVE_APPLICANTS);
    }
};


//get applicants details by id
exports.getbyid= async (req, res) => {
    const { applicantId } = req.params;
    try {
      // Find the applicant by ID
      const applicant = await Applicant.findOne({applicantId});
      console.log(applicant);
     
      if (!applicant) {
        return res.status(404).send(process.env.APPLICANT_NOT_FOUND);
    }
     
      // Return applicant details along with resume download URL
      res.status(200).json({
        fullname: applicant.fullName,
        email: applicant.email,
        contact:applicant.contact,
        gender:applicant.gender,
        dateOfBirth:applicant.dateOfBirth,
        passoutYear:applicant.passoutYear,
        highestQualification:applicant.highestQualification,
        yearOfExperience:applicant.yearOfExperience,
        address:applicant.address,
        skills:applicant.skills,
        role:applicant.role,
        appliedDate:applicant.appliedDate,
        status:applicant.status,
        resumeMimeType: applicant.resumeMimeType,
        resumeDownloadLink: `/api/hrms/download/${applicant.applicantId}`,  // Link to download the resume
    });
    } catch (err) {
      res.status(500).send(process.env.NOT_RETRIVE_APPLICANTS);
    }
};
  
  

  
 