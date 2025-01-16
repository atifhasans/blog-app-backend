import express from 'express';
import { Create, DeleteBlog, GetPosts, likePost, update } from '../controllers/Blog.js';
import { upload } from '../middleware/Multer.js';
import { isAdmin } from '../middleware/CheckAdmin.js';

const BlogRoutes = express.Router();

// Create a new blog post
BlogRoutes.post('/create', isAdmin, upload.single('postimg'), Create);

// Update a blog post
BlogRoutes.patch('/update/:id', isAdmin, upload.single('postimg'), update);

// Get all blog posts
BlogRoutes.get('/GetPosts', GetPosts);

// Delete a blog post
BlogRoutes.delete('/delete/:id', DeleteBlog);

// Like/Unlike a blog post
BlogRoutes.post('/post/like/:id', likePost);

export default BlogRoutes;
