import {body, param} from 'express-validator';
import Post from '../models/Post';

export class CommentValidator {
    
    static addComment(){
        return [body('content','Content is required to add Comment').isString(),
                param('id').custom((id,{req})=>{
                    return Post.findOne({_id:id}).then((post)=>{
                        if(post){
                            req.post = post;
                            return true;
                        }else {
                            throw new Error('Post does not Exist');
                        }
                    })
                })
                ]
    }
}