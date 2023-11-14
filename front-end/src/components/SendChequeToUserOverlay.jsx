import React, { useState } from 'react'
import axios from "axios"

import '../css/LoginPage.css';

export default function SendChequeToUserOverlay({open, onClose, sendCheque})
{
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [chequeID, setChequeID] = useState("");
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);
  const [accountType, setAccountType] = useState("chequings");
  

  if (!open) return null;

  const handleFirstName = (event) =>
  {
    setFirstName(event.target.value);
  }

  const handleLastName = (event) =>
  {
    setLastName(event.target.value);
  }

  const handleChequeID = (event) =>
  {
    setChequeID(event.target.value);
  }

  const handleChequePage = (event) =>
  {
    setPage(event.target.value);
  }

  const handleAmount = (event) =>
  {
    setAmount(event.target.value);
  }

  const handleAccountType = (event) =>
  {
    setAccountType(event.target.value);
  }

  const handleSubmit = () =>
  {
    sendCheque(firstName, lastName, chequeID, page, amount, accountType);
  }

  return (
    <>
        <div id = "overlay-background"></div>

        <div id = "main-overlay">
          <h2>DEPOSIT CHEQUE</h2>
          <br/>

          <br/>
          <div className="login-input-container">
            <input type="text" value = {firstName} onChange={handleFirstName} required />
            <label id="input-container-label" htmlFor="userfirstName">First Name</label>
          </div>

          <br/>
          <div className="login-input-container">
            <input type="text" value = {lastName} onChange={handleLastName} required />
            <label id="input-container-label" htmlFor="userLastName">Last Name</label>
          </div>

          <br/>
          <div className="login-input-container">
            <input type="text" value = {chequeID} onChange={handleChequeID} required />
            <label id="input-container-label" htmlFor="userChequeID">Cheque ID</label>
          </div>

          <br/>
          <div className="login-input-container">
            <input type="number" name = "pageNumber" value = {page} onChange={handleChequePage} min = '1' max = '100' required />
            <label id="input-container-label" htmlFor="userChequePageNumber">Page Number</label>
          </div>

          <br/>
          <div className="login-input-container" id = "sendMoney-emailInput">
            <input type="number" name = "deposit-amount" value = {amount} onChange={handleAmount} min = '10' max = '10000' required />
            <label id="input-container-label" htmlFor="userChequeAmount">Amount</label>
          </div>

          <br/>
          <label className="bank-app-label">Deposit to:</label>
          <select className="bank-account-dropdown" value={accountType} onChange={handleAccountType}>
            <option className="bank-account-dropdown-option" value="chequings">Chequings</option>
            <option className="bank-account-dropdown-option " style={{ marginTop: "10px" }} value="savings">Savings</option>
          </select>

          <br/><br/><br/>
          <button type = "submit" className = "bank-app-buttons" id = "overlayButton-openAccount" onClick = {handleSubmit}>Confirm</button>
          <button className="bank-app-buttons" id="overlayButton-exit" onClick={onClose}>Cancel</button>
        </div>
    </>
  )
}
// const SendChequeToUserOverlay = ({ onClose, open, sendCheque}) => {

//     const [first_name, setfirst_name] = useState('')
//     const [last_name, setlast_name] = useState('')
//     const [amount, setamount] = useState(10)
//     const [page, setpage] = useState(1)
//     const [accountType, setaccountType] = useState('chequings')
//     const [chequeId, setchequeId] = useState('')

//     const handleSubmit = () =>
//     {
//       sendCheque(first_name, last_name, chequeId, accountType, page, amount)
//     }

//     return (
//         <>{
//             open ? <>
//                 <div id="overlay-background"></div>

//                 <div id="main-overlay">

//                   <h2>DEPOSIT CHEQUE</h2>
//                   <br/><br/>

//                   <div className="login-input-container">
//                     <input type="text" value = {first_name} onChange={(e) => setfirst_name(e.target.value)} required />
//                     <label id="input-container-label" htmlFor="userfirstName">First Name</label>
//                   </div>

//                   <br/>
//                   <div className="login-input-container">
//                     <input type="text" value = {last_name} onChange={(e) => setlast_name(e.target.value)} required />
//                     <label id="input-container-label" htmlFor="userLastName">Last Name</label>
//                   </div>

//                   <br/>
//                   <div className="login-input-container">
//                     <input type="text" value = {chequeId} onChange={(e) => setchequeId(e.target.value)} required />
//                     <label id="input-container-label" htmlFor="userChequeID">Cheque ID</label>
//                   </div>

//                   <br/>
//                   <div className="login-input-container">
//                     <input type="number" name = "page #" value = {page} onChange={(e) => setpage(e.target.value)} min = '1' max = '100' required />
//                     <label id="input-container-label" htmlFor="userChequePageNumber">Page Number</label>
//                   </div>

//                   <br/>
//                   <div className="login-input-container" id = "sendMoney-emailInput">
//                     <input type="number" name = "deposit-amount" value = {amount} onChange={(e) => setamount(e.target.value)} min = '10' max = '10000' required />
//                     <label id="input-container-label" htmlFor="userfirstName">Amount</label>
//                   </div>

//                   <br />
//                   <label className="bank-app-label">Deposit to:</label>
//                   <select className="bank-account-dropdown" value={accountType} onChange={(e) => { setaccountType(e.target.value) }}>
//                       <option className="bank-account-dropdown-option" value="chequings">Chequings</option>
//                       <option className="bank-account-dropdown-option " style={{ marginTop: "10px" }} value="savings">Savings</option>
//                   </select>
//                     {/* <label className="bank-app-label">First Name : </label>
//                     <input type="text" value={first_name} onChange={(e) => setfirst_name(e.target.value)} placeholder="First Name"></input> */}

//                     {/* <br /><br />
//                     <label className="bank-app-label">Last Name : </label>
//                     <input type="text" value={last_name} onChange={(e) => setlast_name(e.target.value)} placeholder="Last Name"></input> */}

                    

//                     {/* <br /><br /> */}
//                     {/* <label>Cheque ID: </label>
//                     <input type="text" value={chequeId} onChange={(e) => setchequeId(e.target.value)} placeholder='Cheque ID' /> */}
//                     {/* <br /><br /><br /> */}
//                     {/* <label>Page #: </label>
//                     <input type="number" name="page #" value={page} onChange={(e) => setpage(e.target.value)} min='1' max='100' placeholder='Minimum #1' /> */}
//                     {/* <br /><br /><br />
//                     <label>Amount: </label>
//                     <input type="number" name="deposit-amount" value={amount} onChange={(e) => setamount(e.target.value)} min='10' max='10000' placeholder='Minimum of $1' /> */}
//                     <br /><br /><br />
//                     <button type = "submit" className = "bank-app-buttons" id = "overlayButton-openAccount" onClick = {handleSubmit}>Confirm</button>
//                     {/* <button type="submit" className="bank-app-buttons" id="overlayButton-openAccount" onClick={async () => {
//                       try {
//                         const response = await axios.post('http://localhost:5000/bank/depositcheque', {
//                         firstName:first_name,
//                           lastName:last_name,
//                           chequeId,
//                           accountType,
//                           page,
//                           amount
//                         }, {
//                           headers: {
//                             token: localStorage.getItem('token')
//                           }
//                         });
                      
//                         if (response.data.success === true) {
//                           alert(response.data.message);
//                           window.location.reload()
//                         }
//                       } catch (error) {
//                         console.log(error)
//                         alert(error.response.data.message);
//                       }
                      
//                     }} >Confirm</button> */}
//                     <button className="bank-app-buttons" id="overlayButton-exit" onClick={onClose}>Cancel</button>
//                 </div>

//             </> : ""
//         }

//         </>
//     )
// }

// export default SendChequeToUserOverlay