const DataModel = require('.'+process.env.MODELS+'offerlettermodel');
const transporter = require('.'+process.env.MIDDLEWARES+'nodemailer.js');
 
 
const saveData = async(req, res) =>{
   
    try{
        const {applicantId,date,name,address,role,duration,salary,startdate,mail,acknowledgement}=req.body;
 
        const data = new DataModel({
            applicantId,
            date,
            name,
            address,
            role,
            duration,
            salary,
            startdate,
            mail,
            acknowledgement,
        });
        await data.save();
 
        res.status(201).json({ message:process.env.Data_Saved, data});
   
   
    }catch(error){
 
        res.status(500).json({ error:process.env.Saved_Failed, details:error.message});
    }
 
   
};
// module.exports = { saveData};
 
 
// Controller function to update acknowledgement
const updateAcknowledgement = async (req, res) => {
    const { applicantId } = req.params;  // Get applicantId from URL parameters
 
    try {
      // Find the applicant by their applicantId
      const applicant = await DataModel.findOne({ applicantId });
 
      if (!applicant) {
        return res.status(404).json({ message: process.env.MESSAGE });
      }
 
      // Update the acknowledgement field to true
      applicant.acknowledgement = true;
      await applicant.save();  // Save the updated document
 
      res.status(200).json({ message: process.env.Update_Acknowledge, applicant });
    } catch (error) {
      res.status(500).json({ message: process.env.Error_update_Acknowledge, error: error.message });
    }
  };
 
// Function to send email to a specific applicant
const sendGreetingEmail = async (req, res) => {
  const { applicantId } = req.params; // Get applicantId from URL parameter
 
  try {
    // Fetch applicant details from MongoDB by applicantId
    const applicant = await DataModel.findOne({ applicantId });
 
    if (!applicant) {
      return res.status(404).json({ message: process.env.Error });
    }
 
    // Prepare the email content
    const subject = `Hello ${applicant.name}, Welcome to the team!`;
    const text = `
      Dear ${applicant.name},
 
      Congratulations on joining us as a ${applicant.role}!
 
      We are excited to have you onboard for a ${applicant.duration} period with a salary of ${applicant.salary}. Your start date is ${applicant.startdate}.
 
      Please visit the following link to get started: https://your-link.com.
 
      Best regards,
      Your Company
    `;
    const html = `
      <p>Dear ${applicant.name},</p>
      <p>Congratulations on joining us as a <strong>${applicant.role}</strong>!</p>
      <p>We are excited to have you onboard for a <strong>${applicant.duration}</strong> period with a salary of <strong>${applicant.salary}</strong>. Your start date is <strong>${applicant.startdate}</strong>.</p>
      <p>Please visit the following link to Download your offerletter: <a href="https://www.ncertbooks.guru/wp-content/uploads/2021/02/Offer-Letter-Template.png">Get Started</a></p>
      <p>Best regards,</p>
      <p>Your Company</p>
    `;
 
    // Send the email using the transporter
    const mailOptions = {
      from: process.env.MAIL_USER, // Sender address
      to: applicant.mail,         // Recipient email
      subject,                    // Subject line
      text,                       // Plain text body
      html,                       // HTML body (optional)
    };
 
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: process.env.Email_sent, info });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: process.env.Error_sending, error });
  }
};
 
  module.exports = {  saveData,updateAcknowledgement, sendGreetingEmail  };
 
 