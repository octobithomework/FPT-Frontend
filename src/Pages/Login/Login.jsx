import React, { useState , useEffect} from 'react' 
import './Login.css'
import email_icon from '../../Assets/email.png'
import password_lock from '../../Assets/password.png'
export const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch('your-endpoint-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      // Handle your data here
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <div className='container'> 
     <div className="header">
      <div className="company-header"> Community Lifting Forum</div>
      <div className="text">Login</div>
      <div className="underline"></div>
     </div>
     <div className="inputs">
     <div className="input">
      <img src={email_icon} alt="" />
      <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)}/>
     </div>
     <div className="input">
      <img src={password_lock} alt="" />
      <input type="password" placeholder='Password' onChange={e =>setPassword(e.target.value)}/>
     </div>
     </div>
     <div className="forgot-password">Lost Password?<span>Click Here!</span></div>
     <div className="submit-container">
      <div className="submit">Login</div>
     </div>
     <div className="not-a-user">Not a user? <span>Register!</span></div>
    </div>
  )
}

export default Login