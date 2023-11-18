'use client';

import React, { useState, useEffect } from 'react';
import authStore from '../../../../store/authStore';
import './ProfilePage.css';

const ProfilePage = () => {
  const token = authStore((state) => state.jwtToken);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('https://localhost:3000/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error('Error fetching profile:', error));
  }, [token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="content-container">
      <div className="profile-container">
        <h1 className="profile-title">Profile Details</h1>
        <div className="profile-details">
          {Object.entries(profile).map(([key, value]) =>
            key !== 'id' ? (
              <div key={key} className="profile-item">
                <strong className="profile-key">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </strong>
                <span className="profile-value">{value}</span>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
