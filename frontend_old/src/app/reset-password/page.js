'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Input, Progress, Alert } from 'antd';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';

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

  &:disabled {
    background-color: #cccccc; // Grey color for disabled state
    color: #666666; // Dimmed text color
    cursor: not-allowed; // Change cursor to indicate disabled state
  }
`;

const PasswordStrengthMeter = styled(Progress)`
  margin-top: 1rem;

  .ant-progress-inner {
    background-color: #f3f4f6;
  }

  .ant-progress-bg {
    height: 10px !important;
    border-radius: 5px;
    background-color: ${(props) => {
      if (props.percent < 40) return '#ff4d4f';
      if (props.percent < 75) return '#faad14';
      return '#52c41a';
    }};
  }
`;

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const timeoutRef = useRef(null); // Initialize timeoutRef using useRef

  // Check if the password can be reset (rate limiting logic)
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

  const validateEmail = () => {
    // Basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailPattern)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    if (newPassword !== retypePassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setPasswordStrength(calculateStrength(value));
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
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canResetPassword()) {
      setErrorMessage('Password reset can only be done once a day.');
      setIsButtonDisabled(true);
      return;
    }

    // Validate email and password
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      // Replace with actual API call for password reset
      // Set the time of the last successful password reset
      localStorage.setItem('lastPasswordReset', new Date().toISOString());

      // After successful password reset, redirect to the login page or a confirmation page
      router.push('/login');
    }
  };

  return (
    <PageLayout>
      <LoginCard>
        <StyledTitle level={2}>Reset Password</StyledTitle>
        <form onSubmit={handleSubmit}>
          {errorMessage && <Alert message={errorMessage} type="error" />}
          <InputContainer>
            <Input
              size="large"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onBlur={validateEmail}
            />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          </InputContainer>
          <InputContainer>
            <Input.Password
              size="large"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              onBlur={validatePassword}
            />
          </InputContainer>
          <InputContainer>
            <Input.Password
              size="large"
              placeholder="Retype Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
              onBlur={validatePassword}
            />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          </InputContainer>
          <PasswordStrengthMeter
            percent={passwordStrength}
            status={
              passwordStrength < 40
                ? 'error'
                : passwordStrength < 75
                ? 'warning'
                : 'success'
            }
          />
          <LoginButton
            type="primary"
            htmlType="submit"
            disabled={isButtonDisabled}
          >
            Reset Password
          </LoginButton>
        </form>
        <Button
          type="default"
          onClick={() => router.push('/login')}
          style={{ marginTop: '1rem' }}
          icon={<ArrowLeftOutlined />}
        >
          Return to Login
        </Button>
      </LoginCard>
    </PageLayout>
  );
}

export default ResetPassword;
