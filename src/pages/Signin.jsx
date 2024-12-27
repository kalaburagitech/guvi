import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; // Import the CSS file
import NavBar from "../components/NavBar";


const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/signin', { email, password });
            alert('Sign in successful!');
            // Store the token and user info in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('authToken', data.token); // Store the token separately
        } catch (error) {
            alert(error.response.data.message || 'Sign in failed.');
        }
    };

    return (
        <div>
        <NavBar />
        <div className="signin-container">
           
            <div className="signin-form">
                <h2 className="signin-heading">Sign In</h2>
                <form onSubmit={handleSubmit} className="signin-form-content">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="submit-btn">Sign In</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Signin;
