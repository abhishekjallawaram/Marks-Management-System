"use client"

import { useState,useEffect, useRef } from 'react';
import { Button, Typography, Input, Alert } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'; 
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';

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

const ReturnButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  background-color: #f3f4f6;
  color: #333;
  border: 1px solid #d9d9d9;
  padding: 0.5rem 0;
  transition: background-color 0.3s, color 0.3s, border 0.3s;

  &:hover,
  &:focus {
    background-color: #d9d9d9;
    color: #333;
    border: 1px solid #d9d9d9;
  }
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Client-side validation for email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const timeoutRef = useRef(null); // Initialize timeoutRef using useRef

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
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side email format validation
    if (!isValidEmail(email)) {
        // Ideally, show a user-friendly error message here
        alert('Please enter a valid email address.');
        return;
      }
    // Replace this with your actual API call to send the code
    // After successfully sending the code, navigate to enter-code page with email as a query parameter
    router.push('/enter-code?' + createQueryString('email', email));
  };

  const createQueryString = (name, value) => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
  };

  return (
    <PageLayout>
      <LoginCard>
        <StyledTitle level={2}>Forgot Password</StyledTitle>
        {errorMessage && <Alert message={errorMessage} type="error" />} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputContainer>
          <LoginButton type="primary" htmlType="submit">
            Send Verification Code
          </LoginButton>
          <ReturnButton
            type="default"
            onClick={() => router.push('/login')} 
            icon={<ArrowLeftOutlined />} 
          >
            Return to Login Page
          </ReturnButton>
        </form>
      </LoginCard>
    </PageLayout>
  );
}

export default ForgotPasswordPage;
