import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import amplifyconfig from './amplifyconfiguration.json';
import UserBlogPosts from "./components/UserBlogPosts";
Amplify.configure(amplifyconfig);

export default function App() {
  return (
      <Authenticator>
        {({ signOut, user }) => (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
                {
                    user && (
                        <UserBlogPosts currentUser={user}/>
                    )
                }
            </main>
        )}
      </Authenticator>
  );
}