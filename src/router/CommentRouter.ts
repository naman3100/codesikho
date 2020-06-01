import { CommentController } from './../controllers/CommentController';
import { CommentValidator } from './../validators/CommentValidator';
import { GlobalMiddleware } from './../middleware/CheckError';
import { Router } from 'express';

class CommentRouter {
    public router : Router;

    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }


    getRoutes(){

    }

    postRoutes(){
        this.router.post('/add/:id',GlobalMiddleware.authenticate, CommentValidator.addComment(), GlobalMiddleware.checkError, CommentController.addComment)
    }

    patchRoutes(){

    }

    deleteRoutes(){

    }
}

export default new CommentRouter().router;