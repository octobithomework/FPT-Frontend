// SignupPage.tsx
import React from 'react';
import Header from './SignUpHeader';
import Footer from './SignUpFooter';
import './Signup.css';

const SignupPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <Header />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder="First Name" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Last Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;

