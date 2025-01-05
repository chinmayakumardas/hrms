const nodemailer = require(process.env.NODEMAILER);
const jobNotice = require('.'+process.env.MODELS+'jobNotice');


// Create a transporter object
const transporter2 = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    
    
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
});

// Define the email options
const mailOptions = {
    from: process.env.USER_EMAIL,
    to: process.env.USER_TO,
    subject: process.env.EMAIL_SUBJECT,
  };  

exports.saveJobNotice=async(req,res)=>{
    try {
        const {jobTitle,description,publishDate,expiryDate,jobCategory,status,noOfPositions,userId,feedback}=req.body;
        const job=new jobNotice({jobTitle,description,publishDate,expiryDate,jobCategory,status,noOfPositions,userId,feedback});
        const data=await job.save();
       
        const html=`<html>
  <body>
    <h3>Dear Approver,</h3>
    <p>I am writing to seek your approval for the job opening.</p>
    <br>
    <table style="border: 2px solid; width: 100%;">
      <thead style="background-color: #f2f2f2;">
        <tr style="border: 2px solid;">
          <th style="padding: 10px;">JOB Title</th>
          <th style="padding: 10px;">No. of Vacancies</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border: 2px solid;">
          <td style="padding: 8px; text-align: center;">${data.jobTitle}</td>
          <td style="padding: 8px; text-align: center;">${data.noOfPositions}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <p>Please find attached the detailed job description for your review. I would appreciate it if you could kindly approve this opening at your earliest convenience so we can proceed with the recruitment process.</p>
    <p>If you require any further information or have any questions, please feel free to reach out.</p>
    <p>Thank you for your attention to this matter. I look forward to your approval.</p>
    <p>Best regards,</p>
    <p>Talent Acquisition Team</p>
  </body>
</html>`
        mailOptions.html=html;
        transporter2.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.status(201).send({message:process.env.MESSAGE_30,jobId:job._id})
    } catch (error) {
        conseole.log(error);
        res.status(400).send({error:error.message})
    }
}

exports.updateJobNotice=async(req,res)=>{
    try {
        const id=req.body.jobNoticeId;
        const data=await jobNotice.find({jobNoticeId:id});
        if(data!=null){
            await jobNotice.findOneAndUpdate({jobNoticeId:id},req.body)
           return res.status(201).send(process.env.MESSAGE_31)
        }else{
            return res.status(404).send(process.env.MESSAGE_32)
        }
      
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
exports.deleteJobNotice=async(req,res)=>{
    try {
        const data=await jobNotice.findById(req.params.id);
        console.log(data);
        if(data!=null){
            await jobNotice.findByIdAndUpdate(req.params.id,req.body)
            return res.status(201).send(process.env.MESSAGE_33)
        }else{
            return res.status(404).send(process.env.MESSAGE_32)
        }
      
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

// bhubneswari
exports.updatestatusJobNotice=async(req,res)=>{
    try {
        const data=await jobNotice.findById(req.body.id);
        console.log(data);
        if(data!=null){
            await jobNotice.findByIdAndUpdate(req.body.id,req.body);
           return res.status(201).send(process.env.MESSAGE_34)
        }else{
           return res.status(404).send(process.env.MESSAGE_32)
        }
      
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}



exports.getJobNoticeList = async (req, res) => {
    try {
        const jobs = await JobNotice.find({isDeleted : false});
        res.status(200).json({success : true, data : jobs});
    } catch(error){
        next(error);
    }
};

exports.getJobNoticeListById = async (req, res, next) => {
    try {
        const id = req.params.jobId;
        const noticeById = await JobNotice.findById(id);
 
        if (!noticeById || noticeById.isDeleted) {
             return res.status(404).json({success: false, message : process.env.MESSAGE_35});
        }
 
        res.status(200).json({success : true, data : noticeById});
 
    }catch(err){
        next(err);
    }
};

