import React from 'react';
import { Link } from "react-router-dom";

import '../css/HomePage.css'

const HomePage = () => 
{
	const token = localStorage.getItem('token');
	if (token) localStorage.removeItem('token');
	
	return (
		<div className = "bank-app-div" id = "bank-app-overview-container">
			
			<div>
				<h1 className = "bank-app-title">Bank Application</h1>
			</div>

			<br/><br/><br/><br/>
			<div className = "bank-app-div" id = "button-container">
				<Link to="/login">
					<button className = "bank-app-buttons" id = "home-login-button"type="button">Login</button>
				</Link>

				<Link to="/register">
					<button className = "bank-app-buttons" id = "home-register-button" type="button">Register</button>
				</Link>
			</div>
		</div>		
	);
};

export default HomePage;