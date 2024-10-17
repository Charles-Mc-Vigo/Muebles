import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/setting/my-profile/view', {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-5 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-5">Profile</h1>
      <div className="flex flex-col items-center mb-5">
        {profile.image ? (
          <img
            src={profile.image.startsWith('data:') ? profile.image : profile.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-3"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <h2 className="text-lg font-semibold">{profile.firstname} {profile.lastname}</h2>
        <p className="text-gray-600">{profile.role}</p>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p><strong>Email:</strong> <span className="text-gray-700">{profile.email}</span></p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p><strong>Phone Number:</strong> <span className="text-gray-700">{profile.phoneNumber}</span></p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p><strong>Gender:</strong> <span className="text-gray-700">{profile.gender}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
