import { PostController } from './../controllers/PostController';
import { PostValidators } from './../validators/PostValidators';
import { GlobalMiddleware } from './../middleware/CheckError';
import { Router } from 'express';


class PostRouter {
    public router : Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes(){

    }

    postRoutes(){
        this.router.post('/add',GlobalMiddleware.authenticate,PostValidators.addPost(),GlobalMiddleware.checkError,PostController.addPost);
    }

    patchRoutes(){

    }

    deleteRoutes(){

    }
}

export default new PostRouter().router;