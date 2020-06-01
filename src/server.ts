import  UserRouter  from './router/userRouter';
import PostRouter from './router/postRouter';
import CommentRouter from './router/CommentRouter';
import * as express from 'express'
import * as mongoose from 'mongoose'
import { getEnvironmentVariables } from './environments/env';
import bodyParser = require('body-parser');

export class Server {
    public app : express.Application = express();


    constructor(){
        this.setConfigurations();
        this.configureBodyParser();
        this.setRoutes();
        this.error404Handler();
    }



    setConfigurations(){
        this.setMongodb();
    }



    //Connection to mongodb
    async setMongodb(){
        try {
            await mongoose.connect(getEnvironmentVariables().db_url,
            {useNewUrlParser:true, useUnifiedTopology:true});
            console.log("Mongodb is connected"); 
        } catch (error) {
            console.log("Mongodb not connected");
        }
    }

    //Configuring body parser
    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({extended:true}))
    }

    setRoutes(){
        this.app.use('/src/uploads',express.static('src/uploads'));
        this.app.use('/api/user', UserRouter);
        this.app.use('/api/post',PostRouter);
        this.app.use('/api/comment',CommentRouter);
    }

    //This is called when the page requested is not there
    error404Handler() {
        this.app.use((req,res)=>{
            res.status(404).json({
                message:'Page not found',
                status_code : 404
            })
        })
    }

    //Handling the errors given by the routes
    //This is called whenever an errror object is passed within the next() function
    handleErrors(){
        this.app.use((error,req,res,next)=>{
            const errorStatus = req.errorSatus || 500;
            res.status(errorStatus).json({
                message : error.message || "Something went wrong",
                status_code : errorStatus
            })
        })
    }


}

