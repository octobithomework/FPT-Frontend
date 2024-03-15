export interface UserProfile {
    userProfileId: number;
    firstName: string;
    lastName: string;
    age?: string;
    gender?: string;
    visibility: 'PUBLIC' | 'PRIVATE' | '';
    bio?: string;
    avatar?: string;
    roles?: string[];
}