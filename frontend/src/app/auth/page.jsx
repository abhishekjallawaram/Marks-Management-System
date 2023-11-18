'use client';

import styled from 'styled-components';
import { Button, TextField, Typography, FormControl } from '@mui/material';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useAuthStore, { authenticateUser } from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import Captcha from 'react-captcha-code';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Separator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 99vh;
`;

const LoginContext = styled.div`
  text-align: center;
  margin: 0 auto;
`;

const StyledInputField = styled(TextField)`
  width: 18rem;
  margin: 8px;
`;

const ForgotPasswordContainer = styled.div`
  margin-left: 350px;
  margin-top: 25px;
`;

const LoginButtonStyle = styled(Button)`
  background-color: black;
  color: white;
  width: 10rem;
  border-radius: 20px;
  margin-top: 20px;
`;

const ForgotPasswordBtn = styled(Button)`
  color: black;
`;

const HelperText = styled.div`
  position: absolute;
  top: 90%;
  text-align: center;
  align-self: center;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 80vh;
  width: 60vw;
  margin: 60px;
`;

const LoginImage = styled(Image)`
  border-radius: 40px;
`;

const CaptchaContainer = styled.div`
  align-items: center;
  justify-content: center;
  align-self: center;
  text-align: center;
  margin-top: 16px;
`;

const PerformLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const MAX_LOGIN_ATTEMPTS = 5;

  const setJWT = useAuthStore((state) => state.setJWTToken);
  const setRole = useAuthStore((state) => state.setRole);

  // Email and password validation functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  };

  useEffect(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      const attempts = parseInt(savedAttempts, 10);
      setLoginAttempts(attempts);
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        setGeneralError(
          'Maximum login attempts exceeded. Please try again later.',
        );
      }
    }

    const handleActivity = () => {
      window.clearTimeout(window.sessionTimeout);
      window.sessionTimeout = setTimeout(
        () => {
          console.log('Session timed out. User should be logged out.');
          // Invalidate the session here
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
    //console.log("Generated Captcha:", captchaValue);
    //console.log("Entered Captcha:", enteredCaptcha);
    //console.log("Login Attempts:", loginAttempts);
    setGeneralError('');
    setEmailError(false);
    setPasswordError(false);
    setCaptchaError(false);

    if (!email || !password || !enteredCaptcha) {
      setGeneralError('Please enter email, password, and CAPTCHA.');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      setGeneralError('Invalid email format.');
      return false;
    }
    if (!validatePassword(password)) {
      setPasswordError(true);
      setGeneralError(
        'Password must be at least 8 characters long and include uppercase letters, numbers, and special characters.',
      );
      return false;
    }
    if (enteredCaptcha !== captchaValue) {
      setCaptchaError(true);
      setGeneralError('Incorrect CAPTCHA. Please try again.');
      return false;
    }

    return true;
  };

  const performAuth = async () => {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      setGeneralError(
        'Maximum login attempts exceeded. Please try again later.',
      );
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
      } catch (err) {
        console.error(err);
        setGeneralError('Authentication failed. Please try again.');
      }
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
    }
  };

  const onEmailChange = (event) => setEmail(event.target.value);
  const onPasswordChange = (event) => setPassword(event.target.value);

  return (
    <AuthContainer>
      <Separator>
        <LoginContext>
          <Typography variant="h3">Welcome back!</Typography>
          <Typography variant="caption">
            Please enter your login credentials
          </Typography>

          <div>
            <FormControl error={emailError}>
              <StyledInputField
                id="email-field"
                label="Email Id"
                type="email"
                variant="standard"
                placeholder="johndoe@example.com"
                onChange={onEmailChange}
                helperText={emailError ? 'Invalid email format' : ''}
              />
            </FormControl>
          </div>
          <div>
            <FormControl error={passwordError}>
              <StyledInputField
                id="password-field"
                type="password"
                variant="standard"
                placeholder="*********"
                onChange={onPasswordChange}
                helperText={
                  passwordError
                    ? 'Password must be at least 8 characters long and include uppercase letters, numbers, and special characters'
                    : ''
                }
              />
            </FormControl>
          </div>
          <div>
            <CaptchaContainer>
              <FormControl error={captchaError}>
                <Captcha
                  onChange={setCaptchaValue}
                  bgColor="white"
                  width={200}
                  fontSize={16}
                  charNum={6}
                />

                <StyledInputField
                  id="captcha-validator"
                  type="text"
                  variant="standard"
                  placeholder="Captcha Text"
                  value={enteredCaptcha}
                  onChange={(e) => setEnteredCaptcha(e.target.value)}
                />

                {captchaError && (
                  <Typography color="error">Invalid captcha</Typography>
                )}
              </FormControl>
            </CaptchaContainer>
          </div>

          {generalError && (
            <Typography color="error">{generalError}</Typography>
          )}

          <LoginButtonStyle
            variant="contained"
            onClick={performAuth}
            disabled={loginAttempts >= MAX_LOGIN_ATTEMPTS}
          >
            Login
          </LoginButtonStyle>

          <ForgotPasswordContainer>
            <ForgotPasswordBtn
              variant="text"
              onClick={() => router.push('/auth/forgot')}
            >
              Forgot Password?
            </ForgotPasswordBtn>
          </ForgotPasswordContainer>

          <HelperText>
            <Typography variant="caption">
              Not a member? Contact Admin
            </Typography>
          </HelperText>
        </LoginContext>
      </Separator>
      <Separator>
        <ImageContainer>
          <LoginImage
            src="/login-image.jpg"
            alt="login-image"
            layout="fill"
            objectFit="cover"
          />
        </ImageContainer>
      </Separator>
    </AuthContainer>
  );
};

export default PerformLogin;
