import React, { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { getAuth, postAuth, putAuth } from '../../Utils/APIHelpers';
import { UserProfile } from '../../Interfaces/UserProfile';
import defaultAvatar from '../../Assets/default-profile-icon.jpg';
import './UserProfile.css';
import { SingleValue } from 'react-select';

const UserProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const getUserProfile = async () => {
        try {
            const response = await getAuth('/user-details');
            if (!response || !response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const json = await response.json();

            setUserProfile(json);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleAvatarUpload = async (file: File) => {
        if (!userProfile) {
            console.error('UserProfile is null');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        // Add additional user profile information to formData
        formData.append('firstName', userProfile.firstName);
        formData.append('lastName', userProfile.lastName);
        formData.append('age', String(userProfile.age || "") || "");
        formData.append('gender', userProfile.gender || "");
        formData.append('bio', userProfile.bio || "");

        try {
            const response = await putAuth('/users', formData);

            if (!response.ok) {
                throw new Error('Failed to upload avatar');
            }

            const updatedUser = await response.json();
            console.log('Updated user:', updatedUser)
            setUserProfile(updatedUser);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };


    const handleAvatarClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            // Asserting e.target as HTMLInputElement
            const target = e.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            if (file) {
                await handleAvatarUpload(file);
            }
        };
        fileInput.click();
    };


    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <div className="avatar-container" onClick={handleAvatarClick}>
                    <img src={userProfile?.avatar ? `data:image/jpeg;base64,${userProfile.avatar}` : defaultAvatar} alt="User Avatar" className="user-avatar" />
                    <div className="avatar-overlay">
                        <span>+</span>
                    </div>
                </div>
                <h1>{userProfile?.firstName} {userProfile?.lastName}</h1>
            </div>
            <div className="user-profile-details">
                <p>Age: {userProfile?.age}</p>
                <p>Gender: {userProfile?.gender}</p>
                <p>Visibility: {userProfile?.visibility}</p>
                <p>Bio: {userProfile?.bio}</p>
                <p>Roles: {userProfile?.roles.join(', ')}</p>
            </div>
        </div>
    );
};

export default UserProfilePage;

