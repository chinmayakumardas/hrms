const Round = require('.'+process.env.MODELS+'InterviewRound.js');

// save interview round
const saveRound = async(req,res) =>
    {
       const {roundName} =req.body;

       try
       {
           const existingRound = await Round.findOne(({roundName}));
           if(existingRound)
           {
               return res.status(400).json({message:process.env.MESSAGE_36});
           }
           const newRound = new Round({roundName,isDeleted:false});
           await newRound.save();

           res.status(201).json({message:process.env.MESSAGE_37 , data: newRound});

       }
       catch(err)
       {
           res.status(500).json({message:process.env.MESSAGE_38, error:err.message});
       }
    };




    // get all rounds
    const getAllRounds  = async (req,res) =>
        {
            try
            {
                const rounds = await Round.find({isDeleted:false});
                res.status(200).json({message:process.env.MESSAGE_39,data:rounds})
            }
        catch(err)
           {
            res.status(500).json({message:process.env.MESSAGE_40,error:err})
           }
        };
    




// get by id 
const getRoundById = async (req, res) => {
    const { roundId } = req.params;  // Extract roundId from the route parameter

    try {
        // Find the round by roundId
        const round = await Round.findOne({ roundId: roundId });  // Adjust field name if necessary

        // If round is not found, return 404 error
        if (!round) {
            return res.status(404).json({ message: process.env.MESSAGE_41 });
        }

        // If round is found, return the round details with a success message
        res.status(200).json({ message: process.env.MESSAGE_39, data: round });

    } catch (err) {
        // If there's an error, return a 500 error with the error message
        res.status(500).json({ message: process.env.MESSAGE_40, error: err.message });
    }
}








//  update by id 
const updateRound =  async(req,res) =>
    {
        const {roundId} = req.params;
        const {roundName} = req.body;
    
            try
            {
                const updateRound = await Round.findOneAndUpdate
                (
                     { roundId: parseInt(roundId) }, // Convert roundId to a number to match with the database
                    {roundName },
                    {new: true}
                );
    
                if(!updateRound || updateRound.isDeleted )
                {
                    return res.status(400).json({message:process.env.MESSAGE_42});
                }
    
                res.status(200).json({message:process.env.MESSAGE_43,data:updateRound});
            }
            catch(err)
            {
                res.status(500).json({message:process.env.MESSAGE_44,error:err.message})
            }
            
    
    };
    


// delete by id 
const deleteRound = async (req,res) =>
    {
        const {roundId} =req.params;
    
        try
        {
           
            const deleteRound= await Round.findOne({ roundId: parseInt(roundId) });
    
            if(!deleteRound)
            {
                return res.status(404).json({message:process.env.MESSAGE_41});
            }
            if(deleteRound.isDeleted){
                return res.status(404).json({message:process.env.MESSAGE_45})
            }
    
            deleteRound.isDeleted = true;
            await deleteRound.save();
            res.status(200).json({message: process.env.MESSAGE_46,data:deleteRound})
        }
        catch(err)
        {
            res.status(500).json({message:process.env.MESSAGE_47,error:err});
        }
    }


module.exports ={saveRound,updateRound,deleteRound,getAllRounds,getRoundById}
