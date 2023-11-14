import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../css/LoginPage.css';

const hiddenStyle = "hidden";
const showErrorStyle = "login-error-box";
var errorMessageStyle = hiddenStyle;

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [otp, setotp] = useState('')
	const navigate = useNavigate();
	const [disotp, setdisotp] = useState(false)
	const [otptoken, setotptoken] = useState('')
	const token = localStorage.getItem('token');
	if (token) localStorage.removeItem('token');

	async function loginUser(event) {
		event.preventDefault();

		/*
		* After the user inputs their email/password, it's going to send a POST request to the database, asking it to check and see
		* if there is an email/password combination in the database that matches the email/password combination inputted in the Login Page.
		* (this part of the code goes to backend/routes/login.js).
		*/
		const response = await fetch('http://localhost:5000/login',
			{
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json',
					'otp-token':otptoken
				},
				body: JSON.stringify(
					{
						email,
						password,
						otp
					}
				),
			})

		// Waits until the database sends back the response, then gets the results and puts it in this variable.
		const data = await response.json();

		// Found the user
		if (data.user) {
			localStorage.setItem('token', data.user);
			errorMessageStyle = hiddenStyle;
			alert("Login successful!");
			navigate("/bankAccountOverview");
		}
		else {
			errorMessageStyle = showErrorStyle;
			if(data.message){
				setError(data.message)
			}else{
			setError("Error! Invalid email address and/or password.");
			}
			navigate("/login");
		}
	}

	const sendotp=async()=>{
		const response=await fetch('http://localhost:5000/login/otp',{
			method:"post",
			headers:
				{
					'Content-Type': 'application/json',
				},
			body:JSON.stringify({email,password,register:false})
		})

		const json=await response.json();
		if (email === "") {
			alert('Email is required')
		}
		else if (password === "") {
			alert('Password is required')
		}
		else if(json.success){
			alert('otp sent')
			setdisotp(true)
			setotptoken(json.token)
		}else {
			alert('Error! Invalid email address and/or password.')
			setdisotp(false)
		}
	}

	return (
		<div className="bank-app-div" id="bank-app-overview-container">

			<div>
				<h1 className="bank-app-title">Bank Application</h1>
			</div>

			<div id={errorMessageStyle}>{error}</div>

			<div className="bank-app-div" id="login-container">

				<form onSubmit={loginUser}>

					<span id="login-signIn-title">Sign In</span>

					{
						disotp?
						<><div className="login-input-container">
						<input id="otp" type="text" name="otp" value={otp} onChange={(e) => setotp(e.target.value)} required />
						<label  htmlFor="otp">OTP</label>
					</div>

					<br /><br /></>:<><div className="login-input-container">
						<input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						<label id="input-container-label" htmlFor="email">Email Address</label>
					</div>

					<br /><br />
					<div className="login-input-container">
						<input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						<label id="input-container-label">Password</label>
					</div></>
					}

					<br />
					{
						!disotp ? <input className="bank-app-buttons" onClick={() => {
							sendotp()
							
						}} value="Login" /> :
							<input className="bank-app-buttons" type="submit" value="Authenticate" />

					}

					<br />
					<div className="bank-app-div" id="signUp-link-div">

						<label className="bank-app-static-label"> Don't have an account? </label>

						<Link to="/register">
							<label className="bank-app-static-label">Sign Up</label>
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
};

export default LoginPage;
