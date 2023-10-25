const express = require ('express');
const  morgan = require('morgan');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');


const app = express();

const rateLimiter = rateLimit({
    windowMs: 1* 60 * 1000, // 1 minute,
    max: 5,
    message: 'Too many requests from this IP. please try again later',
});


app.use(rateLimiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/api/users', userRouter);
app.use('/api/seed', seedRouter);


app.use("/api/users", userRouter);



app.get("/test", rateLimiter, (req, res)=>{
    res.status(200).send({
        message: 'api is  working fine',
    });
});




// client error handling
app.use((req,res,next)=>{
  next(createError(404, 'route not found' ));
})

// // server error handling -> all the errors
app.use((err, req, res, next)=>{
   
    return errorResponse(res,{
        statusCode: err.status,
        message: err.message,
    });
});



app.listen(3001, () => {
    console.log(`server is running at http://localhost:3001`);
});


module.exports = app;