import React, {useEffect, useState} from 'react';
import {Amplify} from 'aws-amplify';

import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import amplifyconfig from './amplifyconfiguration.json';
import UserBlogPosts from "./components/UserBlogPosts";
import {LazyUser, User} from "./models";
import {DataStore} from "@aws-amplify/datastore";
import {AuthUser, getCurrentUser} from "@aws-amplify/auth";

Amplify.configure(amplifyconfig);

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        getCurrentUser().then((currentUser: any) => {
            setCurrentUser(currentUser);
        }).catch((e) => {
            setError(e.message);
            setIsLoading(false);
        })
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        const loadUsers = async () => {
            const users = await DataStore.query(User, (u: any) => u.userId.eq(currentUser.username));
            console.log(users);
            if (users.length === 0) {
                setIsLoading(false);
                return;
            }

            setUserProfile(users[0]);
            setIsLoading(false);
        }

        loadUsers();
    }, [currentUser]);

    const createUser = async () => {
        if (!currentUser) {
            return;
        }

        const newUser = await DataStore.save(
            new User({
                userId: currentUser.username,
                username: username,
            }),
        );

        setUserProfile(newUser);
    }

    const handleUsernameChange = (value: string) => {
        setUsername(value);
    };

    return (
        <Authenticator>
            {({signOut, user}) => (
                <main>
                    {
                        isLoading && (
                            <div>Loading...</div>
                        )
                    }

                    <h1>Hello {user?.username}</h1>
                    <button onClick={signOut}>Sign out</button>
                    {
                        userProfile && (
                            <UserBlogPosts userProfile={userProfile}/>
                        )
                    }
                    {
                        !userProfile && (
                            <div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                />
                                <button onClick={() => createUser()}>Create User</button>
                            </div>
                        )
                    }
                    {
                        error && (
                            <div>{error}</div>
                        )
                    }
                </main>
            )}
        </Authenticator>
    );
}