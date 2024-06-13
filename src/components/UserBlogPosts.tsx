import {useEffect, useState} from "react";
import {User} from "../models";
import { AuthUser } from '@aws-amplify/auth';
import { DataStore } from "@aws-amplify/datastore";

interface Props {
    currentUser: AuthUser;
}

const UserBlogPosts = ({currentUser}: Props) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            const users = await DataStore.query(User, (u: any) => u.userId.contains(currentUser.username));
            console.log(users);
            setUser(users[0]);
        }

        loadUsers();
    }, []);

    return (
        <div>UserBlogPosts</div>
    )
}

export default UserBlogPosts;