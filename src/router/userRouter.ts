import { UserValidators } from './../../validators/UserValidators';

import { Router } from "express";
import { UserController } from "../controllers/UserController";


class UserRouter {
    public router : Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes(){
            this.router.post('/signup',UserValidators.signUp(),UserController.signUp)
    }

    postRoutes(){

    }

    patchRoutes(){

    }

    deleteRoutes(){

    }
}

export default new UserRouter().router;