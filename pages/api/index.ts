import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Recipe from "../../models/Recipe";
import BlogPost from "../../models/BlogPost"; // <-- Add this import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, query } = req;

    await dbConnect();

    // Check if the request is for blog posts
    if (query.type === 'blog') {
        switch (method) {
            case 'GET':
                try {
                    const posts = await BlogPost.find({});
                    res.status(200).json({ status: 'success', data: posts });
                } catch (e) {
                    console.error(e);
                    res.status(404).json({ status: 'error', message: 'Blog post search could not be performed.' });
                }
                break;
            case 'POST':
                try {
                    const { title, content, author } = req.body;
                    if (!title || !content || !author) {
                        return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
                    }
                    const newPost = new BlogPost({ title, content, author });
                    await newPost.save();
                    res.status(201).json({ status: 'success', data: newPost });
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: 'error', message: 'Blog post could not be created.' });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).send(`Method ${method} is not allowed.`);
                break;
        }
        return;
    }

    // Default: Recipe endpoints
    switch (method) {
        case 'GET':
            try {
                const recipes = await Recipe.find({});
                res.status(200).json({ status: 'success', data: recipes });
            } catch (e) {
                console.error(e);
                res.status(404).json({ status: 'error', message: 'Recipe search could not be performed.' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).send(`Method ${method} is not allowed.`);
            break;
    }
}

