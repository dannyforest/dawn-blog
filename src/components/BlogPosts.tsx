import {Blog, Post} from "../models";
import React, {useEffect, useState} from "react";

interface Props {
    blog: Blog;
}

const BlogPosts = ({blog}: Props) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            const posts = await blog.posts.toArray();
            setPosts(posts);
        }

        loadPosts();
    }, []);

    return (
        <div>
            <>
                {
                    posts.map(post => (
                        <p>{post.title}</p>
                    ))
                }
            </>
        </div>
    )
}

export default BlogPosts;