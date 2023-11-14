import React, { Component, useEffect, useState } from 'react';
import AddBankAccountOverlay from './AddBankAccountOverlay';
import SendMoneyToUserOverlay from './SendMoneyToUserOverlay';
import SendChequeToUserOverlay from './SendChequeToUserOverlay.jsx';
import ViewTransactionsOverlay from './ViewTransactionsOverlay';

import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import '../css/BankAccountOverview.css';
import '../css/LoginPage.css';

const validator = require('validator');

var hasOpenedChequingsAccount = false;
var hasOpenedSavingsAccount = false;

const hiddenStyle = "hidden";
const showAccountStyle = "bank-account-prefabs";

var chequingsAccountStyle = showAccountStyle;
var savingsAccountStyle = showAccountStyle;
var creditCardAccountStyle = hiddenStyle;
var addBankAccountButtonStyle = "bank-app-buttons";
var addCreditCardAccountButtonStyle = "bank-app-buttons";

export default class BankAccountOverview extends Component {
	constructor(props) {
		super(props);

		// When creating a new function, make sure to bind it using this format; otherwise, it will not work.
		// e.g. this.[functionName] = this.[functionName].bind(this); (remove the square brackets).
		this.updateUser = this.updateUser.bind(this);
		this.getUserAccountsFromDatabase = this.getUserAccountsFromDatabase.bind(this);
		this.findAccountID = this.findAccountID.bind(this);
		this.findAccountBalance = this.findAccountBalance.bind(this);
		this.createNewAccount = this.createNewAccount.bind(this);

		// this.updateDepositForAccount = this.updateDepositForAccount.bind(this);

		this.updateDepositForSavingsAccount = this.updateDepositForSavingsAccount.bind(this);
		this.updateWithdrawForSavingsAccount = this.updateWithdrawForSavingsAccount.bind(this);

		this.updateDepositForchequingAccount = this.updateDepositForchequingAccount.bind(this);
		this.updateWithdrawForchequingAccount = this.updateWithdrawForchequingAccount.bind(this);

		this.updateDepositForCreditCardAccount = this.updateDepositForCreditCardAccount.bind(this);
		this.updateWithdrawForCreditCardAccount = this.updateWithdrawForCreditCardAccount.bind(this);

		this.updateUserInDatabase = this.updateUserInDatabase.bind(this);

		this.depositCheque = this.depositCheque.bind(this);
		this.getAccountTransactions = this.getTransactions.bind(this);
		this.postSelectAccountTransactions = this.postSelectAccountTransactions.bind(this);

		this.findChequeId = this.findChequeId.bind(this);
		this.isOverlayOpen = this.isOverlayOpen.bind(this);
		this.isOverlayOpen2 = this.isOverlayOpen2.bind(this);
		this.isTransOverlayOpen = this.isTransOverlayOpen.bind(this);
		this.sendMoneyToUser = this.sendMoneyToUser.bind(this);

		// Default state of the variable.
		this.state =
		{
			user:
			{
				firstName: "",
				lastName: "",
				email: "",
				accounts: []
			},
			isOpen: false,
			isOpen2: false,
			isTransOverlayOpen: false,
			viewTransAccountType: "",
			transactions: []
		}
	}

	// Built-in React function. Gets called after a component is mounted.
	componentDidMount() {
		const token = localStorage.getItem('token');
		var user;

		if (token) user = jwtDecode(token);
		else {
			alert("Your session has expired. Redirecting you to the Home Page...");
			window.location = '/';
		}

		if (user) {
			this.updateUser(user);
			this.getTransactions();
		}

		this.interval = setInterval(() => {
			var hasCreditCardAccount = this.findAccountID("credit-card") !== -1 ? true : false;
			if (!hasCreditCardAccount) return;

			//alert("10 seconds have passed. Adding 25% interest to credit card balance...");

			var creditCardBalance = this.findAccountBalance("credit-card");
			if (creditCardBalance <= 0) return;

			var newBalance = parseFloat(creditCardBalance * 1.02);
			this.state.user.accounts[2].balance = parseFloat(newBalance.toFixed(2));

			this.postSelectAccountTransactions(this.state.user.email, 'credit-card', 'interest', false, parseFloat((creditCardBalance * 0.02).toFixed(2)));
			this.setState({ user: this.state.user });
			this.updateUserInDatabase();

			creditCardAccountStyle = showAccountStyle;
			addCreditCardAccountButtonStyle = hiddenStyle;

		}, 10000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	componentDidUpdate() {
		if (this.state.user.accounts && this.state.user.accounts.length > 0) return;

		console.log("Updating...");
		this.getUserAccountsFromDatabase();

		var hasCreditCardAccount = this.findAccountID("credit-card") === -1 ? false : true;

		if (hasCreditCardAccount) {
			creditCardAccountStyle = showAccountStyle;
			addCreditCardAccountButtonStyle = hiddenStyle;
		}
	}

	// ADD ALL NEW FUNCTIONS UNDER THIS COMMENT HERE. MAKE SURE TO BIND THE FUNCTION IN THE CONSTRUCTOR.
	// When calling a function in a HTML tag (div, form, etc), type: {this.[functionName]} (Check the RegisterAccountPage.js script for examples)

	updateUser(newUser) {
		this.setState({ user: newUser });
		this.getUserAccountsFromDatabase();
	}

	isOverlayOpen(value) {
		this.setState({ isOpen: value });
	}

	isOverlayOpen2(value) {
		this.setState({ isOpen2: value });
	}

	isTransOverlayOpen(value, accType)
	{
		this.getTransactions();
		this.setState({isTransOverlayOpen: value});
		this.setState({viewTransAccountType: accType})
	}

	getTransactions()
	{
		axios.get("http://localhost:5000/bank/getTrans").then(allTransactions =>
		{
			this.setState({transactions: allTransactions});
			console.log(this.state.transactions)
		});
	}

	postSelectAccountTransactions(email, accType, transType, isDeduct, amount)
	{
		const transInfo = 
		{
			email: email,
			accType: accType,
			transType: transType,
			isDeduct: isDeduct,
			amount: amount
		}

		axios.post("http://localhost:5000/bank/addTrans", transInfo).then(() => 
		{
			this.getTransactions();
			console.log("Success!")
		})
		.catch((err) => alert("Unable to upload transaction.\n" + err));
	}

	sendMoneyToUser(recipientEmail, value) {
		if (validator.isEmpty(recipientEmail) || recipientEmail.indexOf(' ') >= 0) {
			return alert("Error! Recipient email cannot be left blank.");
		}

		if (isNaN(value) || value <= 0) {
			return alert("Error! Invalid amount to send.");
		}

		if (validator.equals(recipientEmail, this.state.user.email)) {
			return alert("Error! You cannot send yourself money.");
		}

		if (this.findAccountBalance("chequings") < value) {
			return alert("Error! Not enough money in chequings account.");
		}

		const dataToSend =
		{
			email: String(recipientEmail),
			amount: Number(value)
		};

		axios.post(`http://localhost:5000/bank/sendMoney/${this.state.user.email}`, dataToSend)
			.then(() => {
				alert("You have successfully sent $" + value + " to " + recipientEmail);
				window.location = '/bankAccountOverview';

			}
			).catch((err) => alert("Error! No user with that email can be found.\n" + err));

		console.log(recipientEmail);
		console.log(value);

		this.postSelectAccountTransactions(this.state.user.email, "chequings", recipientEmail, true, dataToSend.amount);
		this.postSelectAccountTransactions(recipientEmail, "chequings", this.state.user.email, false, dataToSend.amount);
	}

	getUserAccountsFromDatabase() {
		axios.get(`http://localhost:5000/account/get/${this.state.user.email}`).then(userAccounts => {
			this.setState({ user: { ...this.state.user, accounts: userAccounts.data } });
			var hasCreditCardAccount = this.findAccountID("credit-card") !== -1 ? true : false;

			if (hasCreditCardAccount) {
				console.log("Has account!");
				addCreditCardAccountButtonStyle = hiddenStyle;
				creditCardAccountStyle = showAccountStyle;
			}
			else {
				console.log("No account!")
				addCreditCardAccountButtonStyle = "bank-app-buttons";
				creditCardAccountStyle = hiddenStyle;
			}
		})
			.catch((err) => alert("Unable to pull user bank accounts from database.\n" + err));
	}

	updateUserInDatabase() {
		// e.preventDefault();

		axios.post("http://localhost:5000/register/update", this.state.user).then(() => {
			alert("Data updated.");
		})
			.catch((err) => alert("Unable to update balance to database.\n" + err));

	}

	findAccountID(accType) {
		// console.log(this.state.user);
		if (this.state.user.accounts && this.state.user.accounts.length > 0) {
			for (var i = 0; i < this.state.user.accounts.length; i++) {
				if (this.state.user.accounts[i] === null || this.state.user.accounts[i] === undefined) continue;
				if (this.state.user.accounts[i].accType !== accType) continue;

				return this.state.user.accounts[i].id;
			}
		}

		return -1;
	}

	findAccountBalance(accType) {
		if (this.state.user.accounts && this.state.user.accounts.length > 0) {
			for (var i = 0; i < this.state.user.accounts.length; i++) {
				if (this.state.user.accounts[i] === null || this.state.user.accounts[i] === undefined) continue;
				if (this.state.user.accounts[i].accType !== accType) continue;

				return this.state.user.accounts[i].balance;
			}
		}

		return -1;
	}


	createNewAccount(accountType) {
		const info =
		{
			email: this.state.user.email,
			accType: accountType
		};

		var hasCreditCardAccount = this.findAccountID("credit-card") === -1 ? false : true;

		if (hasCreditCardAccount) {
			addCreditCardAccountButtonStyle = hiddenStyle;
			creditCardAccountStyle = showAccountStyle;
			alert("Already have a credit card account. Ignoring request...");
			this.getUserAccountsFromDatabase();
			this.updateUser(this.state.user);
			return;
		}

		axios.post("http://localhost:5000/account/new", info).then(() => {
			alert(accountType + " account added!");
			addCreditCardAccountButtonStyle = hiddenStyle;
			creditCardAccountStyle = showAccountStyle;
			this.getUserAccountsFromDatabase();
			this.updateUser(this.state.user);
		})
			.catch((err) => alert("Unable to add " + accountType + " to user.\n" + err));
	}

	updateDepositForSavingsAccount(e) {
		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;
		const depositAmount = +Object.fromEntries(new FormData(form))['deposit-amount'];

		// Reset the form
		form.reset();

		if (isNaN(depositAmount)) {
			return alert('Not valid deposit amount');
		}

		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2];

		// Update the account balance
		savingsAccount.balance += depositAmount;

		this.postSelectAccountTransactions(this.state.user.email, 'savings', 'deposit', false, depositAmount);

		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	updateWithdrawForSavingsAccount(e) {
		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;

		// const a = "100";
		// +a === 100;
		const withdrawAmount = +Object.fromEntries(new FormData(form))['withdraw-amount'];

		// Reset the form
		form.reset();

		if (isNaN(withdrawAmount)) {
			return alert('Not valid withdraw amount');
		}

		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2];

		// Update the account balance
		savingsAccount.balance -= withdrawAmount;

		this.postSelectAccountTransactions(this.state.user.email, 'savings', 'withdraw', true, withdrawAmount);

		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	updateDepositForchequingAccount(e) {
		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;
		const depositAmount = +Object.fromEntries(new FormData(form))['deposit-amount'];

		// Reset the form
		form.reset();

		if (isNaN(depositAmount)) {
			return alert('Not valid withdraw amount');
		}

		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2];

		// Update the account balance
		chequingAccount.balance += depositAmount;

		this.postSelectAccountTransactions(this.state.user.email, 'chequings', 'deposit', false, depositAmount);

		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	updateWithdrawForchequingAccount(e) {

		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;

		// const a = "100";
		// +a === 100;
		const withdrawAmount = +Object.fromEntries(new FormData(form))['withdraw-amount'];

		// Reset the form
		form.reset();

		if (isNaN(withdrawAmount)) {
			return alert('Not valid withdraw amount');
		}
		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2];

		// Update the account balance
		chequingAccount.balance -= withdrawAmount;

		this.postSelectAccountTransactions(this.state.user.email, 'chequings', 'withdraw', true, withdrawAmount);

		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	calculateAccountTotal() {
		// Get the right account
		const chequingAccountBalance = this.findAccountBalance("chequings");
		const savingsAccountBalance = this.findAccountBalance("savings")

		const total = chequingAccountBalance + savingsAccountBalance;

		// sets it to two decimal places
		return total.toFixed(2);
	}

	updateDepositForCreditCardAccount(e) {
		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;
		const depositAmount = e.target.depositAmount.value;

		// Reset the form
		form.reset();

		if (isNaN(depositAmount)) {
			return alert('Not valid withdraw amount');
		}

		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2] === null ? this.state.user.accounts[3] : this.state.user.accounts[2];

		// Update the account balance
		creditCardAcc.balance += Number(depositAmount);
		creditCardAcc.balance = Number(creditCardAcc.balance.toFixed(2));

		this.postSelectAccountTransactions(this.state.user.email, 'credit-card', 'charged', false, Number(depositAmount));
		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	updateWithdrawForCreditCardAccount(e) {

		// Prevent page from reloading
		e.preventDefault();

		// Extract the value from the form
		const form = e.target;

		// const a = "100";
		// +a === 100;
		const withdrawAmount = e.target.withdrawAmount.value;

		// Reset the form
		form.reset();

		if (isNaN(withdrawAmount)) {
			return alert('Not valid withdraw amount');
		}

		console.log(this.state.user.accounts)
		// Get the right account
		const chequingAccount = this.state.user.accounts[0];
		const savingsAccount = this.state.user.accounts[1];
		const creditCardAcc = this.state.user.accounts[2] === null ? this.state.user.accounts[3] : this.state.user.accounts[2];


		// Update the account balance
		creditCardAcc.balance -= Number(withdrawAmount);
		creditCardAcc.balance = Number(creditCardAcc.balance.toFixed(2));

		this.postSelectAccountTransactions(this.state.user.email, 'credit-card', 'paid', true, withdrawAmount);

		// Save the data
		// TODO: Change this to API Call
		this.setState({ user: { ...this.state.user, accounts: [chequingAccount, savingsAccount, creditCardAcc] } });
		this.updateUserInDatabase();
	}

	async depositCheque(localFirstName, localLastName, localChequeId, localPage, localAmount, localAccountType)
	{
		
		// firstName, lastName, chequeID, page, amount, accountType
		const dataToSend =
		{
			firstName: String(localFirstName),
			lastName: String(localLastName),
			chequeId: String(localChequeId),
			accountType: String(localAccountType),
			page: Number(localPage),
			amount: Number(localAmount)
		};

		await axios.post("http://localhost:5000/bank/depositcheque", dataToSend, {headers: {token: localStorage.getItem('token')}})
		.then(() => 
		{
			this.postSelectAccountTransactions(this.state.user.email, localAccountType, 'cheque deposit', false, localAmount);
			alert("Cheque successfully deposited!")
			
			// window.location.reload()
			
	// 	// 	this.postSelectAccountTransactions(response.data.user.email, 'chequings', 'cheque', true, depositAmount);
		})
		.catch((err) => alert(err.response.data.message));
		// axios.post(`http://localhost:5000/bank/sendMoney/${this.state.user.email}`, dataToSend)
		// 	.then(() => {
		// 		alert("You have successfully sent $" + value + " to " + recipientEmail);
		// 		window.location = '/bankAccountOverview';

		// 	}
		// 	).catch((err) => alert("Error! No user with that email can be found.\n" + err));
			// try 
			// {
			//     const response = axios.post('http://localhost:5000/bank/depositcheque', 
			// 	{
			//         firstName: localFirstName,
			//         lastName: localLastName,
			//         localChequeId,
			//         localAccountType,
			//         localPage,
			//         localAmount
			//     }, 
			// 	{
			//         headers: 
			// 		{
			//             token: localStorage.getItem('token')
			//         }
			//     });
								  
			//     if (response.data.success === true) 
			// 	{
			//         alert(response.data.message);
			//         window.location.reload()
			//     }
			// } 
			// catch (error) 
			// {
			//     console.log(error)
			//     alert(error.response.data.message);
			// }								  
	}
	// This function will call the `/transfer` endpoint
	// and transfer the amount from the source account to the destination account
	// and given the accountType, it will find the account ID
	// depositChequeForSavingsAccount(e) {
	// 	// e.preventDefault();
	// 	// const form = e.target;
	// 	// const formData = Object.fromEntries(new FormData(form));

	// 	// form.reset();

	// 	// const account = this.findAccountID("savings");
	// 	// const depositAmount = formData['deposit-amount'];
	// 	// const chequeId = formData['cheque-id'];

	// 	// axios.post('http://localhost:5000/register/transfer', {
	// 	// 	chequeId: chequeId,
	// 	// 	accountId: account,
	// 	// 	amount: +depositAmount
	// 	// }).then((response) => {
	// 	// 	// TODO: UPDATE THE USER STATE
	// 	// 	this.setState({ user: { ...this.state.user, ...response.data.user } });
	// 	// 	this.postSelectAccountTransactions(this.state.user.email, 'savings', 'cheque', false, depositAmount);
	// 	// 	this.postSelectAccountTransactions(response.data.user.email, 'savings', 'cheque', true, depositAmount);
	// 	// });

		
	// }

	// depositChequeForChequingAccount(e) {
	// 	// e.preventDefault();
	// 	// const form = e.target;
	// 	// const formData = Object.fromEntries(new FormData(form));

	// 	// form.reset();

	// 	// const account = this.findAccountID("chequings");
	// 	// const depositAmount = formData['deposit-amount'];
	// 	// const chequeId = formData['cheque-id'];

		
	// 	// axios.post('http://localhost:5000/register/transfer', {
	// 	// 	chequeId: chequeId,
	// 	// 	accountId: account,
	// 	// 	amount: +depositAmount
	// 	// }).then((response) => {
	// 	// 	this.setState({ user: { ...this.state.user, ...response.data.user } });
	// 	// 	this.postSelectAccountTransactions(this.state.user.email, 'chequings', 'cheque', false, depositAmount);
	// 	// 	this.postSelectAccountTransactions(response.data.user.email, 'chequings', 'cheque', true, depositAmount);
	// 	// });
	// }

	calculateCreditCardAccountTotal() {
		// Get the right account
		const creditCardBalance = Number(this.findAccountBalance("credit-card"));

		// sets it to two decimal places
		return Number(creditCardBalance.toFixed(2));
	}

	findChequeId(accType) {
		// console.log(this.state.user);
		if (this.state.user.accounts && this.state.user.accounts.length > 0) {
			for (var i = 0; i < this.state.user.accounts.length; i++) {
				if (this.state.user.accounts[i] === null || this.state.user.accounts[i] === undefined) continue;
				if (this.state.user.accounts[i].accType !== accType) continue;

				return this.state.user.accounts[i].chequeId;
			}
		}

		return -1;

	}

	render() {
		return (
			<>
				<div className="bank-app-div" id="bank-account-options">
					<button className="bank-app-buttons" id="bank-account-sendMoney-button" type="button" onClick={() => this.isOverlayOpen(true)}>Send Money</button>
					<button className="bank-app-buttons" id="bank-account-sendMoney-button" style={{ marginTop: "10px" }} type="button" onClick={() => this.isOverlayOpen2(true)}>Deposit Cheque</button>
				</div>
				<div className="bank-app-div" id="bank-app-overview-container">

					<div>
						<h1 className="bank-app-title">Bank Application</h1>

						<Link to="/">
							<button className="bank-app-buttons" id="bank-account-sign-out-button" type="button"> Sign Out </button>
						</Link>

						<h3 id="username-heading">{this.state.user.firstName + " " + this.state.user.lastName}</h3>
					</div>

					<br /><br />

					<SendMoneyToUserOverlay open={this.state.isOpen} onClose={() => this.isOverlayOpen(false)} sendMoney={this.sendMoneyToUser} />
					<SendChequeToUserOverlay open={this.state.isOpen2} onClose={() => this.isOverlayOpen2(false)} sendCheque = {this.depositCheque}/>
					<ViewTransactionsOverlay open={this.state.isTransOverlayOpen} onClose={() => this.isTransOverlayOpen(false, "")} email = {this.state.user.email} accType = {this.state.viewTransAccountType} accountTrans = {this.state.transactions} showBaseAmount = {Number(5)}/>

					<div className="bank-app-div" id="bank-accounts-owned-middle">
						<h2 className="bank-account-heading">Bank Accounts</h2>

						<br />

						<div className={savingsAccountStyle} id="bank-account-prefab01">
							<h3 className="bank-account-prefab-heading" id="bank-account-heading-prefab01">Personal Savings Account</h3>
							<h3 className="bank-account-prefab-number" id="bank-account-number-prefab01">ID: 399-{this.findAccountID("savings")}</h3>
							<h3 className="bank-account-prefab-number" id="bank-account-number-prefab01">Cheque ID: {this.findChequeId("savings")}</h3>
							<p className="bank-account-prefab-balance" id="bank-account-balance-prefab01"> ${this.findAccountBalance("savings")}</p>
						</div>

						<div className = "bank-account-prefabs">
							<form onSubmit={this.updateDepositForSavingsAccount}>
								<div className="login-input-container" id = "depositMoney-inputField">
									<input type="number" name = "deposit-amount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="accountDeposit">Deposit</label>
								</div>
							</form>

							<form onSubmit={this.updateWithdrawForSavingsAccount}>
								<div className="login-input-container" id = "withdrawMoney-inputField">
									<input type="number" name = "withdraw-amount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="userfirstName">Withdraw</label>
								</div>
							</form>

							<button className = "bank-app-buttons" id = "bank-account-transactionButton" onClick={() => this.isTransOverlayOpen(true, "savings")}>Transactions</button>
						</div>


						<div>

						</div>

						{/* <div className = "bank-account-create-new">
	 <button className = {addBankAccountButtonStyle} id = "bank-account-create-new-account-button" type = "button" onClick = {() => setIsOpen(true)}> Add New Account</button>
	 </div> */}
						<br />
						{/* <div className="dropdown">

							<button className="dropbtn">View Statements</button>
							<div className="dropdown-content">
								<a href="/statementFebruary2022">February 2022</a>
								<a href="/statementMarch2022">March 2022</a>
								<a href="/statementApril2022">April 2022</a>
								<a href="/statementMay2022">May 2022</a>
								<a href="/statementJune2022">June 2022</a>
								<a href="/statementJuly2022">July 2022</a>
								<a href="/statementAugust2022">August 2022</a>
								<a href="/statementSeptember2022">September 2022</a>
								<a href="/statementOctober2022">October 2022</a>
								<a href="/statementNovember2022">November 2022</a>
								<a href="/statementDecember2022">December 2022</a>
								<a href="/statementJanuary2023">January 2023</a>
							</div>
						</div> */}

						<br /><br />

						<div className={chequingsAccountStyle} id="bank-account-prefab02">
							<h3 className="bank-account-prefab-heading" id="bank-account-heading-prefab02">Everyday Chequings Account</h3>
							<h3 className="bank-account-prefab-number" id="bank-account-number-prefab02">ID: 399-{this.findAccountID("chequings")}</h3>
							<h3 className="bank-account-prefab-number" id="bank-account-number-prefab01">Cheque ID: {this.findChequeId("chequings")}</h3>
							<p className="bank-account-prefab-balance" id="bank-account-balance-prefab02"> ${this.findAccountBalance("chequings")} </p>
						</div>

						<div className = "bank-account-prefabs">
							<form onSubmit={this.updateDepositForchequingAccount}>
								<div className="login-input-container" id = "depositMoney-inputField">
									<input type="number" name = "deposit-amount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="accountDeposit">Deposit</label>
								</div>
							</form>

							<form onSubmit={this.updateWithdrawForchequingAccount}>
								<div className="login-input-container" id = "withdrawMoney-inputField">
									<input type="number" name = "withdraw-amount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="userfirstName">Withdraw</label>
								</div>
							</form>

							<button className = "bank-app-buttons" id = "bank-account-transactionButton" onClick={() => this.isTransOverlayOpen(true, "chequings")}>Transactions</button>
						</div>

						{/* <div>
							<form onSubmit={this.depositChequeForChequingAccount}>
								<label>Deposit a cheque</label>
								<input type="text" name="" placeholder='Cheque ID' />
								<input type="text" name="cheque-id" placeholder='Cheque ID' />
								<input type="number" name="deposit-amount" min='10' max='10000' placeholder='$' />
								<input type="submit" value="Submit" />
							</form>
						</div> */}

						<br />
						{/* <div className="dropdown">
							<button className="dropbtn">View Statements</button>

							<div className="dropdown-content">
								<a href="/statement2February2022">February 2022</a>
								<a href="/statement2March2022">March 2022</a>
								<a href="/statement2April2022">April 2022</a>
								<a href="/statement2May2022">May 2022</a>
								<a href="/statement2June2022">June 2022</a>
								<a href="/statement2July2022">July 2022</a>
								<a href="/statement2August2022">August 2022</a>
								<a href="/statement2September2022">September 2022</a>
								<a href="/statement2October2022">October 2022</a>
								<a href="/statement2November2022">November 2022</a>
								<a href="/statement2December2022">December 2022</a>
								<a href="/statement2January2023">January 2023</a>
							</div>
						</div> */}

						<br /><br />
						<div className="bank-account-balance-total">
							<h3 className="bank-account-balance-total-title">TOTAL: </h3>
							<p className="bank-account-balance-total-amount"> ${this.calculateAccountTotal()} </p>
						</div>
					</div>

					<br></br> <br></br>
					<div className="bank-app-div" id="credit-cards-owned-bottom">
						<h2 className="bank-account-heading">Credit Cards</h2>
						<br />
						<div className={creditCardAccountStyle} id="credit-account-prefab01">
							<h3 className="bank-account-prefab-heading" id="credit-account-heading-prefab01">Standard Credit Card</h3>
							<h3 className="bank-account-prefab-number" id="credit-account-number-prefab01">{this.findAccountID("credit-card")}</h3>
							<p className="bank-account-prefab-balance" id="credit-account-balance-prefab01"> ${this.findAccountBalance("credit-card")}</p>
						</div>

						<div className={creditCardAccountStyle}>
							<form onSubmit={this.updateDepositForCreditCardAccount}>
								<div className="login-input-container" id = "depositMoney-inputField">
									<input type="number" name = "depositAmount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="accountDeposit">Charge</label>
								</div>
							</form>

							<form onSubmit={this.updateWithdrawForCreditCardAccount}>
								<div className="login-input-container" id = "withdrawMoney-inputField">
									<input type="number" name = "withdrawAmount" min = "10" max = "10000"/>
									<label id="input-container-label" htmlFor="userfirstName">Pay Off</label>
								</div>
							</form>
							{/* <form onSubmit={this.updateDepositForCreditCardAccount}>
								<label>Charge</label>
								<input type="number" name="depositAmount" min='1' max='10000' placeholder='$1' />
								<input type="submit" value="Submit" />
							</form>

							<form onSubmit={this.updateWithdrawForCreditCardAccount}>
								<label>Pay Off</label>
								<input type="number" name="withdrawAmount" min='1' max='10000' placeholder='$1' />
								<input type="submit" value="Submit" />
							</form> */}
							<button className = "bank-app-buttons" id = "bank-account-transactionButton" onClick={() => this.isTransOverlayOpen(true, "credit-card")}>Transactions</button>
						</div>

						<div className="bank-account-create-new">
							<button className={addCreditCardAccountButtonStyle} id="bank-account-create-new-account-button" type="button" onClick={() => this.createNewAccount("credit-card")}>
								Add New Account</button>
						</div>

						<div className="bank-account-balance-total">
							<h3 className="bank-account-balance-total-title">TOTAL: </h3>
							<p className="bank-account-balance-total-amount">${this.calculateCreditCardAccountTotal() === -1 ? "0" : this.calculateCreditCardAccountTotal()}</p>
						</div>
					</div>
				</div>
			</>
		);
	}
}