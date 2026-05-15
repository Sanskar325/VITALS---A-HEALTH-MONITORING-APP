import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodGroup: string;
    smokerStatus: string;
    existingIssues: string;
    aboutMe: string;
}

interface UserContextType {
    user: UserProfile;
    updateUserProfile: (data: Partial<UserProfile>) => void;
}

const initialUser: UserProfile = {
    firstName: 'Sanskar',
    lastName: 'Verma',
    email: 'sanskariverma30@gmail.com',
    phone: '+91 9113124540',
    age: '21',
    gender: 'Male',
    weight: '75',
    height: '168',
    bloodGroup: 'A+',
    smokerStatus: 'Non-smoker',
    existingIssues: 'No significant health issues reported.',
    aboutMe: '4th year ECE student at VIT Vellore. Home is in Patna, Bihar.'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(initialUser);

    const updateUserProfile = (data: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ user, updateUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
