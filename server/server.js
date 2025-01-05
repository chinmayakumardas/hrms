require('dotenv').config();
const express = require(process.env.EXPRESS);
const connectDB = require(process.env.CONFIG+'db');
const cors = require(process.env.CORS);
const authRoutes = require(process.env.API_ROUTE_PATH+'authRoutes');
const jobNoticeRouter=require(process.env.API_ROUTE_PATH+'JobNoticeRouter');

const skillRoutes = require(process.env.API_ROUTE_PATH+'skillRoute');
const jobRoutes= require(process.env.API_ROUTE_PATH+'jobRoute');
const roundRoute=require(process.env.API_ROUTE_PATH+'roundRoutes');
const validateToken = require(process.env.MIDDLEWARES+'authMiddleware');
const interviewScheduleRoutes= require(process.env.API_ROUTE_PATH+'interviewScheduleRoutes');
const feedbackRoutes= require(process.env.API_ROUTE_PATH+'feedbackRoutes');
const applicantRoute=require(process.env.API_ROUTE_PATH+'applicantRoute');
const offerletterRoutes= require(process.env.API_ROUTE_PATH+'offerletterroutes');
const designationRoute=require(process.env.API_ROUTE_PATH+'designationRoute');

const app = express();

//calling mongoDB to connect
connectDB();

//middleware -> applied to all request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
const corsOptions = {
    origin: process.env.CORS_ORIGIN_DEVELOPING_ENV, // Replace with the allowed origin
    methods: process.env.CORS_ALLOW_METHOD,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));
//routes
app.use(process.env.API_URL_ROUTH_DEVELOPING, authRoutes);


///Arun
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken, skillRoutes);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken,jobNoticeRouter);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken, jobRoutes);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken,roundRoute);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken, interviewScheduleRoutes);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken, feedbackRoutes);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken,applicantRoute);
app.use(process.env.API_URL_ROUTH_DEVELOPING,validateToken,offerletterRoutes);
app.use(process.env.API_URL_ROUTH_DEVELOPING, validateToken,designationRoute);




app.listen(process.env.PORT, () => {
    console.log(process.env.PING_MESSAGE);
});

