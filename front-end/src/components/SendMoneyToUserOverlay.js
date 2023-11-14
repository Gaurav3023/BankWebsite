import React, { useState } from 'react'

import '../css/AddBankAccountOverlay.css';
import '../css/BankAccountOverview.css';
import '../css/LoginPage.css';

export default function SendMoneyToUser({open, onClose, sendMoney})
{
    const [moneySent, setMoneySent] = useState(1);
    const [email, setEmail] = useState("");

    if (!open) return null;

    const handleEmailChange = (event) =>
    {
        setEmail(event.target.value);
    }

    const handleMoneySentChange = (event) =>
    {
        setMoneySent(event.target.value);
    }

    const handleSubmit = () =>
	{
		sendMoney(email, moneySent)
	};

    return(
        <>
            <div id = "overlay-background"></div>

            <div id = "main-overlay">

                <h2>SEND MONEY</h2>
                <br></br><br></br>
                <div className="login-input-container" id = "sendMoney-emailInput">
					<input type="text" value = {email} onChange={handleEmailChange} required />
					<label id="input-container-label" htmlFor="userfirstName">Send To Email</label>
				</div>

                {/* <label className="bank-app-label">Send To: </label>
                <input type = "text" value = {email} onChange = {handleEmailChange} placeholder = "Email address"></input> */}

                <br/><br/>
                <label className="bank-app-label">From: </label>
				<select className = "bank-account-dropdown">
					<option className = "bank-account-dropdown-option" value = "chequings">Chequings</option>
				</select>

                <br/><br/><br/><br/>
                <div className="login-input-container" id = "sendMoney-emailInput">
					<input type="number" name = "deposit-amount" value = {moneySent} onChange={handleMoneySentChange} min = '1' max = '10000' required />
					<label id="input-container-label" htmlFor="userfirstName">Amount</label>
				</div>
                {/* <label>Amount: </label>
			    <input type="number" name = "deposit-amount" value = {moneySent} onChange = {handleMoneySentChange} min='1' max='10000' placeholder='Minimum of $1' /> */}
                <br/><br/>
				<button type = "submit" className = "bank-app-buttons" id = "overlayButton-openAccount" onClick = {handleSubmit} >Confirm</button>
				<button className = "bank-app-buttons" id = "overlayButton-exit" onClick = {onClose}>Cancel</button>
            </div>

        </>
        
    )
    
}