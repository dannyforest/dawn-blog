import React, {useEffect, useState} from "react";
import {Blog, User} from "../models";
import { DataStore } from "@aws-amplify/datastore";
import BlogPosts from "./BlogPosts";

interface Props {
    userProfile: User;
}

const UserBlogPosts = ({userProfile}: Props) => {
    const [name, setName] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const loadBlogs = async () => {
            const blogs = await userProfile.blogs.toArray();
            setBlogs(blogs);
        }

        loadBlogs();
    }, []);

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const createBlog = async () => {
        const newBlog = await DataStore.save(new Blog({
            name,
            userBlogsId: userProfile.id
        }));

        setBlogs([...blogs, newBlog]);
    }


    // TODO: Add isLoading everywhere
    return (
        <>
            <h1>Your Blogs</h1>
            <div>
                <input
                    placeholder={"Blog Name"}
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
                <button onClick={() => createBlog()}>Create Blog</button>
            </div>
            {
                blogs.map((blog) => (
                    <div key={blog.id}>
                        <h3>{blog.name}</h3>
                        <BlogPosts blog={blog} />
                    </div>
                ))
            }
        </>
    )
}

export default UserBlogPosts;