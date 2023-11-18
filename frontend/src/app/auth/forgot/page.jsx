'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SERVER_URL } from '../../../constants';
import './forgotpasswordstyles.css';
import { useRouter } from 'next/navigation';

const ForgotPasswordContainer = styled.div`
  display: flex;
  margin: 0 auto;
  align-self: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100vh;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [otp, setOTP] = useState(null);
  const [nextPage, setNextPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Add this state

  const route = useRouter();

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const sendOTP = () => {
    setNextPage(true);
    fetch(`${SERVER_URL}/auth/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });
  };

  const canResetPassword = () => {
    const lastReset = localStorage.getItem('lastPasswordReset');
    if (lastReset) {
      const lastResetDate = new Date(lastReset);
      const now = new Date();
      const differenceInTime = now.getTime() - lastResetDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return differenceInDays >= 1;
    }
    return true;
  };

  const resetPassword = () => {
    if (!canResetPassword()) {
      setErrorMessage('Password reset can only be done once a day.');
      setIsButtonDisabled(true);
      return;
    }
    fetch(`${SERVER_URL}/auth/validateForgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: Number(otp),
        newPassword: password,
      }),
    })
      .then(() => {
        localStorage.setItem('lastPasswordReset', new Date().toISOString());
        route.push('/auth');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onSubmit = () => {
    resetPassword();
  };

  return (
    <ForgotPasswordContainer>
      <div className="border-2 border-solid rounded-l shadow-lg w-3/12 pb-16">
        <div
          className="flex justify-between items-center"
          onClick={() => setEmail(false)}
        >
          <div
            className="bg-gray-300 cursor-pointer inline-block rounded-full mt-6 ml-6"
            onClick={() => setNextPage(false)}
          >
            <ArrowBackIcon />
          </div>
          <div className="flex-grow">
            <div className="m-6">
              <Typography variant="h5">Reset Password</Typography>
            </div>
          </div>
        </div>
        {!nextPage ? (
          <div>
            <div className="p-4">
              <TextField
                required
                id="email-required"
                label="Email"
                onChange={onChangeEmail}
                defaultValue=""
              />

              <div>
                <Button
                  variant="contained"
                  className="bg-black font-white mt-5"
                  onClick={() => sendOTP()}
                >
                  Send OTP
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <TextField
              required
              id="email-required"
              label="Email"
              onChange={onChangeEmail}
              defaultValue=""
            />
            <div className="p-4">
              <TextField
                required
                id="otp-required"
                label="OTP"
                onChange={onOTPChange}
                defaultValue=""
              />
            </div>
            <div>
              <TextField
                required
                type="password"
                id="password-required"
                label="Enter Password"
                onChange={onPasswordChange} // Use onChange for password field
                defaultValue=""
              />
            </div>

            <div>
              <Button
                variant="contained"
                className="bg-black font-white mt-5"
                onClick={() => onSubmit()}
                disabled={isButtonDisabled} // Add this to disable the button
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
