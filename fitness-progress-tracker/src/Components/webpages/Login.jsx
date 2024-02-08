import React, { useState } from 'react' 
import './Login.css'
import email_icon from '../Assets/email.png'
import password_lock from '../Assets/password.png'
export const Login = () => {

  const [action,setAction] = useState("Login");
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
      <input type="email" placeholder='Email'/>
     </div>
     <div className="input">
      <img src={password_lock} alt="" />
      <input type="password" placeholder='Password' />
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