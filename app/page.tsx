'use client';

import { users, User } from '@/lib/mock-data';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(users[0]); // Default to the first user
  const [following, setFollowing] = useState<User[]>([]);

  useEffect(() => {
    const followedUsers = users.filter(user => currentUser.following.includes(user.id));
    setFollowing(followedUsers);
  }, [currentUser]);

  return (
    <main className="p-12">
      <div className="container mx-auto">
        <div className="bg-surface p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-primary">Activity Feed</h1>
          <p className="text-lg mb-4">Updates from users you follow will appear here.</p>
        </div>

        <div className="bg-surface p-8 rounded-lg shadow-lg mt-12">
          <h2 className="text-3xl font-bold mb-4 text-secondary">Following</h2>
          {following.length > 0 ? (
            <ul>
              {following.map(user => (
                <li key={user.id} className="text-lg">{user.name}</li>
              ))}
            </ul>
          ) : (
            <p>You are not following anyone yet.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
