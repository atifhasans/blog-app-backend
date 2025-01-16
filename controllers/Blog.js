import Blgomodel from "../models/Blog.js";
import mongoose from 'mongoose';

import fs from 'fs';
import path from 'path';
const Create = async (req, res) => {
    try {
        const { title, desc } = req.body;

        // Check if a file was uploaded
        console.log(req.file); // Debug: Log the file info
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const imagePath = req.file.filename;

        // Create the blog post with the provided data
        const CreateBlog = new Blgomodel({
            title,
            desc,
            image: imagePath
        });

        // Save the blog post to the database
        await CreateBlog.save();

        // Respond with success message
        res.status(201).json({
            success: true,
            message: 'Blog Created Successfully',
            blog: CreateBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const update = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const blogId = req.params.id;

        const blogToUpdate = await Blgomodel.findById(blogId);
        if (!blogToUpdate) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (title) blogToUpdate.title = title;
        if (desc) blogToUpdate.desc = desc;
        if (req.file) blogToUpdate.image = req.file.filename;

        await blogToUpdate.save();
        res.status(200).json({ success: true, message: 'Blog updated successfully', blog: blogToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const GetPosts=async(req,res)=>{
    try {
        const posts= await Blgomodel.find()
       
        if (!posts) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true,  posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const DeleteBlog=async(req,res)=>{
    try {
        const postid=req.params.id
        const posts= await Blgomodel.findById(postid)
       
        if (!posts) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        if (posts.image) {
            const profilePath = path.join('public/images', posts.image);
            fs.promises.unlink(profilePath)
                .then(() => console.log('Profile image deleted'))
                .catch(err => console.error('Error deleting profile image:', err));
        }
        const deletepost=await Blgomodel.findByIdAndDelete(postid)
        res.status(200).json({ success: true, message:"Post Delete Successfully",  post:deletepost });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { userId } = req.body; // User ID

        console.log("Post ID:", id, "User ID:", userId);

        // Validate Post ID and User ID
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid Post ID or User ID",
            });
          }

        // Find the post
        const post = await Blgomodel.findById(id);
        if (!post) {
            console.error(`Post with ID ${id} not found`);
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        console.log("Post found:", post);

        // Check if the user has already liked the post
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            console.log("User already liked the post. Unliking...");
            post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
            await post.save();
            console.log("Post unliked successfully");
            return res.status(200).json({
                success: true,
                message: "Post unliked",
                likes: post.likes.length,
            });
        }

        console.log("User has not liked the post. Liking...");
        post.likes.push(userId);
        await post.save();
        console.log("Post liked successfully");
        return res.status(200).json({
            success: true,
            message: "Post liked",
            likes: post.likes.length,
        });
    } catch (error) {
        console.error("Error in likePost:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export { Create, update,GetPosts,DeleteBlog, likePost };
