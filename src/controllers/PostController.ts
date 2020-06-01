import Post from "../models/Post";

export class PostController {
    
    static async addPost(req,res,next){
        
        const userId = req.user.user_id;
        const content = req.body.content;
        const post = new Post({
            user_id:userId,
            content:content,
            created_at:new Date(),
            updated_at:new Date()
        });
        post.save().then((post)=>{
            res.send(post);
        }).catch((err)=>{
            next(err);
        })
    }
}