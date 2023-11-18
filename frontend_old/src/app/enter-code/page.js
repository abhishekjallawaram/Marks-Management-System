"use client"

import { useState, useEffect, useRef } from 'react';
import { Button, Typography, Input,Alert } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation'; 
import styled from 'styled-components';
import { MailOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'; 

// Typography
const { Title } = Typography;

// Page layout and styling
const PageLayout = styled.div`
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 50px;
`;

const LoginCard = styled.div`
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  color: #333;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const InputContainer = styled.div`
  margin-top: 1rem;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 2rem;
  background-color: #0052cc;
  color: #fff;
  border: none;
  padding: 0.5rem 0;

  &:hover,
  &:focus {
    background-color: #0066ff;
    color: #fff;
    border: none;
  }
`;

export default function EnterCodePage() {
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const timeoutRef = useRef(null); // Initialize timeoutRef using useRef
  
    // Client-side validation for a 6-digit numeric code
    const isValidCode = (code) => {
        return /^\d{6}$/.test(code); // Regex to ensure the code is 6 digits
      };
  
      // Session timeout logic
      useEffect(() => {
        // Reset timeout on code change
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          // Logic to handle session expiration
          setErrorMessage('Session expired. Please restart the process.');
          // Redirect to login page
          router.push('/login');
        }, 600000); // 10 minutes timeout
  
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      }, [code, router]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!isValidCode(code)) {
        setErrorMessage('The code must be a 6-digit number.');
        return;
      }
  
      // Placeholder for reCAPTCHA validation
      // Implement reCAPTCHA here if needed
  
      // Assuming isCodeValid is a result from your API call
      const isCodeValid = true; // Replace with actual validation logic
      if (isCodeValid) {
        router.push('/reset-password'); 
      } else {
        setErrorMessage('Invalid or expired code. Please try again.');
      }
    };
  
    return (
      <PageLayout>
        <LoginCard>
          <StyledTitle level={2}>Enter Verification Code</StyledTitle>
          <form onSubmit={handleSubmit}>
            {errorMessage && <Alert message={errorMessage} type="error" />}
            <InputContainer>
              <Input size="large" placeholder="Email" value={email} readOnly />
            </InputContainer>
            <InputContainer>
              <Input
                size="large"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </InputContainer>
            <LoginButton type="primary" htmlType="submit" icon={<CheckOutlined />}>
              Submit Code
            </LoginButton>
          </form>
          <Button
            type="default"
            onClick={() => router.push('/forgot-password')}
            style={{ marginTop: '1rem' }}
            icon={<ArrowLeftOutlined />} 
          >
            Return to Forgot Password
          </Button>
        </LoginCard>
      </PageLayout>
    );
  }

