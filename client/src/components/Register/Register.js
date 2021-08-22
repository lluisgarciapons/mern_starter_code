import React, { useState, useContext } from 'react';
import { withRouter } from "react-router-dom";
import "./Register.css";
import axios from "axios";

import { GlobalState } from '../../GlobalState';

//TODO agafar token de globalstate

function Register(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const state = useContext(GlobalState);
    const [, setToken] = state.token;

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            sendDetailsToServer();
        } else {
            props.showError('Passwords do not match');
        }
    };

    const sendDetailsToServer = async () => {
        if (!name.length && !email.length && !password.length) {
            return props.showError('Please enter valid name, username and password');
        }

        props.showError(null);
        const payload = {
            name,
            email,
            password,
            passwordValidation: confirmPassword
        };
        try {
            const response = await axios.post(`api/auth/register`, payload);
            if (!response.data.success) {
                return props.showError(response.data.message);
            }
            setSuccessMessage('Registration successful. Redirecting to home page..');
            localStorage.setItem("firstLogin", true);
            props.showError(null);
            setToken(response.data.token);
        }

        catch (err) {
            console.log(err);
            props.showError(err.response.data.message);
        }

    };

    const redirectToLogin = () => {
        props.history.push('/login');
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Name</label>
                    <input type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your name"
                        value={email}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                {successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>
        </div>
    );
};

export default withRouter(Register);