'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import useAuthStore from '../../../../store/authStore';
import { SERVER_URL } from '../../../constants';
import './forgotpasswordstyles.css';
import { router } from 'next/client';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SimpleForm = () => {
  const [otp, setOtp] = useState('');
  const email = useAuthStore((state) => state.setEmail);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, otp: otp }),
      });
      const data = await response.json();
      await router.push('/home');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <div>
        <TextField
          required
          id="email-required"
          label="Email"
          defaultValue={email}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
      <div>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </Container>
  );
};

export default SimpleForm;
