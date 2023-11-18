'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Input, Alert, Progress } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import styled from 'styled-components';
import useAuthStore, { authenticateUser } from '../../store/auth.store';
import Captcha from 'react-captcha-code';

const MAX_LOGIN_ATTEMPTS = 500; // Define the maximum login attempts allowed

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

  // Styling for the disabled state
  &:disabled {
    background-color: #cccccc; // Grey color for disabled state
    color: #666666; // Dimmed text color
    cursor: not-allowed; // Change cursor to indicate disabled state
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #0052cc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledCaptcha = styled.div`
  margin-top: 20px;
  .react-captcha-code {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    canvas {
      width: 100%;
      height: 100%;
    }
  }
`;

// Email validation function - Security Feature: Input Validation
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation function - Security Feature: Input Validation
const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

// Password strength calculation - Security Feature: User Feedback on Password Strength
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 7) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[!@#$%^&*]/.test(password)) strength += 25;
  return strength;
};

const PasswordStrengthMeter = styled(Progress)`
  margin-top: 1rem;

  .ant-progress-inner {
    background-color: #f3f4f6;
  }

  .ant-progress-bg {
    height: 10px !important;
    border-radius: 5px;

    // You can customize the color based on the strength if needed
    background-color: ${(props) => {
      if (props.percent < 40) return '#ff4d4f';
      if (props.percent < 75) return '#faad14';
      return '#52c41a';
    }};
  }
`;

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const setJWT = useAuthStore((state) => state.setJWTToken);
  const setRole = useAuthStore((state) => state.setRole);
  // Session Timeout - Security Feature: Session Management
  useEffect(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      const attempts = parseInt(savedAttempts, 10);
      setLoginAttempts(attempts);
      setIsLoginDisabled(attempts >= MAX_LOGIN_ATTEMPTS);
    }

    const handleActivity = () => {
      window.clearTimeout(window.sessionTimeout);
      window.sessionTimeout = setTimeout(
        () => {
          // Invalidate the session here
          console.log('Session timed out. User should be logged out.');
        },
        30 * 60 * 1000,
      ); // 30 minutes
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.clearTimeout(window.sessionTimeout);
    };
  }, []);

  const validateInput = () => {
    if (!email || !password || !enteredCaptcha) {
      setError('Please enter email, password, and CAPTCHA.');
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      return false;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      return false;
    }
    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long and include uppercase letters, numbers, and special characters.',
      );
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      return false;
    }
    if (enteredCaptcha !== captchaValue) {
      setError('Incorrect CAPTCHA. Please try again.');
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      return false;
    }

    // If all validations pass, clear the error and return true
    setError('');
    return true;
  };

  // Function to handle login click
  const handleLoginClick = async () => {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      setError('Too many failed login attempts. Please try again later.');
      setIsLoginDisabled(true);
      return;
    }

    if (validateInput()) {
      try {
        const data = await authenticateUser(email, password);
        setJWT(data.accessToken);
        setRole(data.role);
        router.push('/home');
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
      } catch (e) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        setError(e.message);
      }
    }
  };

  return (
    <PageLayout>
      <LoginCard>
        <StyledTitle level={2}>Sign In</StyledTitle>
        {error && <Alert message={error} type="error" showIcon closable />}
        <InputContainer>
          <Input
            size="large"
            placeholder="Email"
            prefix={<UserOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthMeter
            percent={calculatePasswordStrength(password)}
          />
        </InputContainer>
        <StyledCaptcha>
          <Captcha
            charNum={6}
            onChange={setCaptchaValue}
            bgColor={'white'}
            fontSize={40}
            height={100}
            width={400}
          />
        </StyledCaptcha>
        <Input
          size="large"
          placeholder="Enter CAPTCHA"
          value={enteredCaptcha}
          onChange={(e) => setEnteredCaptcha(e.target.value)}
        />
        <LoginButton
          type="primary"
          onClick={handleLoginClick}
          disabled={isLoginDisabled} // Disable the button based on login attempts
        >
          Sign In
        </LoginButton>
        <ForgotPasswordLink onClick={() => router.push('/forgot-password')}>
          Forgot password?
        </ForgotPasswordLink>
      </LoginCard>
    </PageLayout>
  );
}

export default LoginPage;
