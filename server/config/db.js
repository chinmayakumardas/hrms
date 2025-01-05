
//Autherization and Authentication\

const mongoose = require(process.env.MONGOOSE);
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection with database is successful running at", process.env.PORT);
    }catch(error){
        console.error("Error in connecting to database: ", error.message);
        process.exit(1);
    }
};
module.exports = connectDB;



