import  UserRouter  from './router/UserRouter';
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
    setMongodb(){
        mongoose.connect(getEnvironmentVariables().db_url,
    {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=>{
    console.log('mongodb is connected')
    }).catch((err)=>{
        console.log('mongodb not connected')
        console.log(err)
    })
    }

    //Configuring body parser
    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({extended:true}))
    }

    setRoutes(){
        this.app.use('/api/user', UserRouter);
    }


    error404Handler() {
        this.app.use((req,res)=>{
            res.status(404).json({
                message:'Page not found',
                status_code : 404
            })
        })
    }

    //Handling the errors given by the routes
    handleErrors(){
        this.app.use((error,req,res,next)=>{
            const errorStatus = req.errorSatus || 500;
            res.status(errorStatus).json({
                message: error.message || "Something went wrong",
                status_code : errorStatus
            })
        })
    }


}

