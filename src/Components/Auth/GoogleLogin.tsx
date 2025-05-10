import React, { FC } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import http from '../../Services/http/http';

interface GoogleLoginButtonProps {

}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    const navigate = useNavigate();

    const handleSuccess = async (response: CredentialResponse) => {
        const result = response.credential;
        if (result) {
            try {
                const backendResponse = await http({
                    url: `/google/google_login`,
                    method: 'post',
                    data: { token: result },
                });

                if (backendResponse?.data?.code === 'SUCCESS_200') {
                    localStorage.setItem('token', backendResponse.data.data.jwtToken);
                    localStorage.setItem('userDetails', JSON.stringify(backendResponse.data.data.user));
                    toast.success(backendResponse?.data?.message);
                    setTimeout(() => {
                        navigate('home/dashBoard');
                    }, 1000);
                } else {
                    toast.error(backendResponse?.data?.message);
                }
            } catch (error: any) {
                console.error('Error during login:', error);
                toast.warn(error?.response?.data?.message || 'Google login failed.');
            }
        } else {
            console.error('No credential returned from Google');
            toast.error('Google Login Failed');
        }
    };

    const handleError = () => {
        console.error('Google Login Failed');
        toast.error('Google Login Failed');
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
