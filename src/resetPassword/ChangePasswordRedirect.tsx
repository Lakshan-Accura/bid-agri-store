import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ChangePasswordRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (token && email) {
      // Store in sessionStorage to pass to ResetPasswordForm
      sessionStorage.setItem('resetToken', token);
      sessionStorage.setItem('resetEmail', email);
      
      // Redirect to reset-password
      navigate('/reset-password');
    } else {
      // If no parameters, redirect to forgot-password
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Redirecting...
    </div>
  );
};

export default ChangePasswordRedirect;