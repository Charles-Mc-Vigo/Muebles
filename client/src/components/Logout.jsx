import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from cookies
    Cookies.remove('authToken');
    
    // Redirect the user to the login page
    navigate('/login');
  }, [navigate]);

  return null;
}

export default Logout;
