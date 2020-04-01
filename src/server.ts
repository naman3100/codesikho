import  UserRouter  from './router/UserRouter';
import * as express from 'express'
import * as mongoose from 'mongoose'
import { getEnvironmentVariables } from './environments/env';

export class Server {
    public app : express.Application = express();


    constructor(){
        this.setConfigurations();
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
    })
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


}

