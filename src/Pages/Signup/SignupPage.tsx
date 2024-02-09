import React, { useState } from 'react';
import Header from './SignUpHeader';
import Footer from './SignUpFooter';
import './Signup.css';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/signup', { // change /api/signup to the actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('User signed up successfully');
        // Add logic to handle successful signup (e.g., redirect to a new page)
      } else {
        console.error('Error signing up:', response.statusText);
        // Add logic to handle signup error
      }
    } catch (error) {
      console.error('Error signing up:');
      // Add logic to handle network error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

