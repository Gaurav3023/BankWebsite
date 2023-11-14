import React, { useState } from 'react'

import '../css/AddBankAccountOverlay.css';
import '../css/BankAccountOverview.css';

export default function AddBankAccountOverlay({open, onClose, accountAdded}) 
{
	const [value, setValue] = useState("chequings");
	if (!open) return null;

	const handleChange = (event) =>
	{
		setValue(event.target.value);
	};

	const handleSubmit = () =>
	{
		accountAdded(value);
		onClose();
	};

	return (
	<>
		<div id = "overlay-background"/>

		<div id = "main-overlay">

				<label className = "bank-app-label"> Please select the account you would like to open: 
					<br/><br/>
					<select className = "bank-account-dropdown" value = {value} onChange = {handleChange}>
						<option className = "bank-account-dropdown-option" value = "chequings">Chequings Account</option>
						<option className = "bank-account-dropdown-option" value = "savings">Savings Account</option>
					</select>

				</label>

				<br/><br/><br/>
				<button className = "bank-app-buttons" id = "overlayButton-openAccount"onClick = {handleSubmit}> Open Account </button>
				<button className = "bank-app-buttons" id = "overlayButton-exit" onClick = {onClose}> Exit </button>		
		</div>
	</>	
	
  )
}
