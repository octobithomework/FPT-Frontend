import React, { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { getAuth, postAuth, putAuth } from '../../Utils/APIHelpers';
import { UserProfile } from '../../Interfaces/UserProfile';
import defaultAvatar from '../../Assets/default-profile-icon.jpg';
import './UserProfile.css';
import { OptionType } from '../../Interfaces/OptionType';
import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';

const UserProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<SingleValue<OptionType>>(null);
    const [visibility, setVisibility] = useState<SingleValue<OptionType>>(null);
    const [bio, setBio] = useState('');
    const [roles, setRoles] = useState<SingleValue<OptionType>>(null);

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
        if (userProfile) {
            setFirstName(userProfile.firstName);
            setLastName(userProfile.lastName);
            setAge(userProfile.age || '');

            const gender = userProfile.gender?.toLowerCase() || '';
            const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
            setGender({ value: userProfile.gender, label: capitalizedGender });

            const visibility = userProfile.visibility.toLowerCase();
            const capitalizedVisibility = visibility.charAt(0).toUpperCase() + visibility.slice(1);
            setVisibility({ value: userProfile.visibility, label: capitalizedVisibility });

            setBio(userProfile.bio || '');
        }
    }, [userProfile]);


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
        formData.append('visibility', userProfile.visibility);
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
            </div>
            <div className="user-profile-details">
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Age</FormLabel>
                    <Input value={age} type="number" onChange={(e) => setAge(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                        options={[
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' },
                            { value: 'OTHER', label: 'Other' },
                        ]}
                        value={gender}
                        onChange={setGender}
                        placeholder=''
                        classNamePrefix="select"
                        isSearchable={false}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                        options={[
                            { value: 'PUBLIC', label: 'Public' },
                            { value: 'PRIVATE', label: 'Private' },
                        ]}
                        value={visibility || { value: '', label: '' }}
                        onChange={setVisibility}
                        placeholder=''
                        classNamePrefix="select"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </FormControl>

                {/* <FormControl>
                    <FormLabel>Roles</FormLabel>
                    <Select
                        options={[
                            { value: 'Admin', label: 'Admin' },
                        ]}
                        value={roles}
                        onChange={setRoles}
                        classNamePrefix="select"
                    />
                </FormControl> */}
            </div>
        </div>
    );
};

export default UserProfilePage;

