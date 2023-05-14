const CommentModel = require('../model/comment.model');

const list = async (request, response)=>{
    try {

        const comments = await CommentModel.find().populate('user_id','-password').populate('movie_id');

        return response.status(200).json(comments);
        
    } catch (err) {

        return response.status(400).json({
            error:'comments/list',
            message: err.message || 'Failed to retrieve comments'
        });
        
    }
};

const getById = async (request, response)=>{
    
    const {id} = request.params;

    try {

        const comment = await CommentModel.findById(id).populate('user_id','-password').populate('movie_id');

        if(!comment){
            return response.status(404).json({
                error:'@comments/getById',
                message: `Comment with id ${id} not found`
            });
        }

        return response.status(200).json(comment);
        
    } catch (err) {

        return response.status(400).json({
            error:'@comments/getById',
            message: err.message || `Failed to retrieve comment with id ${id}`
        })
        
    }
};

const create = async(request, response)=>{
    
    const {movie_id, content, rating} = request.body;

    const userID = request.user._id; //precisa ser o response do corpo decodificado, neste caso o id do mongodb por default é _id portanto utilizar o .id direto não funciona, retornando undefined    

    if(rating < 1 || rating > 5){
        return response.status(400).json({
            error: '@comments/create',
            message:'Invalid rating. Must be an integer between 1 and 5.'
        });
    };

    try{

        const comment = await CommentModel.create({
            user_id: userID,
            movie_id,
            content,
            rating
        });

        return response.status(201).json(comment);

    }catch(err){
        return response.status(400).json({
            error: '@comments/create',
            message: err.message || 'Failed to post a comment'
        });        
    }

};

const update = async(request, response)=>{
    const {id} = request.params;
    const {content, rating} = request.body;
    const userID = request.user._id;
    const isAdmin = request.user.role === 'admin';

    if(rating < 1 || rating > 5){
        return response.json(400).json({
            error:'@comments/update',
            message: 'Invalid rating. Must be an integer between 1 and 5.'
        });
    }

    try{

        const comment = await CommentModel.findById(id);

        if(!comment){
            return response.status(404).json({
                error: '@comments/update',
                message: 'Comment not found'
            });
        };
        
        if(userID !== comment.user_id.toString() && !isAdmin){
            return response.status(403).json({
                error:'@comments/update',
                message:"You're not authorized to edit this comment"
            });
        };

        const commentUpdate = await CommentModel.findByIdAndUpdate(
            id,
            {
                content,
                rating
            },
            {
                new: true
            }
        );

        return response.status(200).json(commentUpdate);

    } catch(err){
        return response.status(400).json({
            error:'@comments/update',
            message:err.message || 'Failed to update the comment.'
        });
    }
};

const remove = async(request, response)=>{
    const {id} = request.params;

    const isAdmin = request.user.role === 'admin';

    try {

        const comment = await CommentModel.findById(id);

        if(!comment){
            return response.status(404).json({
                error:'@comments/delete',
                message: 'Comment not found.'
            });
        }

        if(!isAdmin){
            return response.status(403).json({
                error:'@comments/delete',
                message:"You're not authorized to delete comments, only admins"
            });
        }

        await CommentModel.findByIdAndDelete(id);

        return response.status(200).json()
        
    } catch (err) {

        return response.status(400).json({
            error:'@comments/delete',
            message: err.message || 'Failed to delete the comment.'
        });
        
    }
}

module.exports = {
    list,
    getById,    
    create,
    update,
    remove
}