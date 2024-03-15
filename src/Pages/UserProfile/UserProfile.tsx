import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import { getAuth, putAuth } from '../../Utils/APIHelpers';
import { UserProfile } from '../../Interfaces/UserProfile';
import defaultAvatar from '../../Assets/default-profile-icon.jpg';
import './UserProfile.css';
import { OptionType } from '../../Interfaces/OptionType';

const UserProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<SingleValue<OptionType> | null>(null);
    const [visibility, setVisibility] = useState<SingleValue<OptionType> | null>(null);
    const [bio, setBio] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formError, setFormError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [ageError, setAgeError] = useState('');
    const formRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await getAuth('/user-details');
                if (!response || !response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const json: UserProfile = await response.json();

                setUserProfile(json);

                if (json) {
                    setFirstName(json.firstName);
                    setLastName(json.lastName);
                    setAge(json.age || '');

                    const genderValue = json.gender?.toLowerCase() || '';
                    const capitalizedGender = genderValue.charAt(0).toUpperCase() + genderValue.slice(1);
                    setGender({ value: json.gender, label: capitalizedGender });

                    const visibilityValue = json.visibility.toLowerCase();
                    const capitalizedVisibility = visibilityValue.charAt(0).toUpperCase() + visibilityValue.slice(1);
                    setVisibility({ value: json.visibility, label: capitalizedVisibility });

                    setBio(json.bio || '');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        getUserProfile();
    }, []);

    const handleAvatarClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            if (file) {
                setAvatarFile(file);
            }
        };
        fileInput.click();
    };

    const validateForm = () => {
        let isValid = true;
        if (!firstName.trim()) {
            setFirstNameError('First name is required.');
            isValid = false;
        } else {
            setFirstNameError('');
        }

        if (!lastName.trim()) {
            setLastNameError('Last name is required.');
            isValid = false;
        } else {
            setLastNameError('');
        }

        if (!age?.toString().trim() || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 150) {
            setAgeError('Please enter a valid age between 0 and 150.');
            isValid = false;
        } else {
            setAgeError('');
        }

        return isValid;
    };


    const handleSubmit = async () => {
        setFormSuccess('');
        setFormError('');

        if (formRef.current) {
            formRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        if (!validateForm()) {
            return;
        }

        if (!userProfile) {
            console.error('UserProfile is null, unable to save.');
            setFormError('UserProfile is null, unable to save.');
            return;
        }

        const updatedProfile = new FormData();
        if (avatarFile) {
            updatedProfile.append('avatar', avatarFile);
        }
        updatedProfile.append('firstName', firstName);
        updatedProfile.append('lastName', lastName);
        updatedProfile.append('visibility', visibility?.value || userProfile.visibility);
        updatedProfile.append('age', age);
        updatedProfile.append('gender', gender?.value || "");
        updatedProfile.append('bio', bio);

        try {
            const response = await putAuth('/users', updatedProfile);
            if (!response.ok) {
                throw new Error('Failed to save profile');
            }
            const savedProfile = await response.json();
            console.log('Profile saved successfully:', savedProfile);
            setUserProfile(savedProfile);
            setFormSuccess('Profile updated successfully.');
        } catch (error) {
            console.error('Error saving profile:', error);
            setFormError('Error saving profile.');
        }
    };

    return (
        <div className="user-profile-container">
            <div className="user-profile-box" ref={formRef}>
                {formSuccess ? (
                    <FormControl isInvalid={!!formSuccess} className="form-success">
                        <FormErrorMessage>{formSuccess}</FormErrorMessage>
                    </FormControl>
                ) : formError ? (
                    <FormControl isInvalid={!!formError} className="form-error">
                        <FormErrorMessage>{formError}</FormErrorMessage>
                    </FormControl>
                ) : null}

                <div className="user-profile-header">
                    <div className="avatar-container" onClick={handleAvatarClick}>
                        <img src={userProfile && userProfile.avatar ? `data:image/jpeg;base64,${userProfile.avatar}` : defaultAvatar} alt="User Avatar" className="user-avatar" />
                        <div className="avatar-overlay">
                            <span>+</span>
                        </div>
                    </div>
                </div>
                <div className="user-profile-details">
                    <FormControl isInvalid={!!firstNameError}> 
                        <FormLabel>First Name</FormLabel>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        {firstNameError && <FormErrorMessage>{firstNameError}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={!!lastNameError}>
                        <FormLabel>Last Name</FormLabel>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        {lastNameError && <FormErrorMessage>{lastNameError}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isInvalid={!!ageError}>
                        <FormLabel>Age</FormLabel>
                        <Input value={age} type="number" onChange={(e) => setAge(e.target.value)} />
                        {ageError && <FormErrorMessage>{ageError}</FormErrorMessage>}
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
                        <FormLabel>Profile Visibility</FormLabel>
                        <Select
                            options={[
                                { value: 'PUBLIC', label: 'Public' },
                                { value: 'PRIVATE', label: 'Private' },
                            ]}
                            value={visibility}
                            onChange={setVisibility}
                            placeholder=''
                            classNamePrefix="select"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Biography</FormLabel>
                        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                    </FormControl>

                    <Button mr={3} onClick={handleSubmit} className='user-profile-save'>Save</Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
