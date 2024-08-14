import React, { FC } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { decodeToken } from 'react-jwt';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    jti: string;
    // Add other fields as needed
}

interface GoogleLoginButtonProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ setIsLoading }) => {
    const clientId = '62900804960-n7pcro85gqfibr4m6tbv88mhq4ok32p0.apps.googleusercontent.com'; // Replace with your Google Client ID
    const navigate = useNavigate()
    const handleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            const userObject = decodeToken(response.credential) as GoogleUser; // Decoding the JWT
            console.log('Google User Details:', userObject);
            // Handle the login response (e.g., save user details to state or send to backend)
            sessionStorage.setItem('token', userObject.jti);
            sessionStorage.setItem('userDetails', JSON.stringify({ name: userObject.name, email: userObject.email }))
            toast.success('User Loged In');
            navigate('home/dashBoard');
            setIsLoading(false)
        } else {
            console.error('No credential returned from Google');
        }
    };

    const handleError = () => {
        console.error('Google Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
