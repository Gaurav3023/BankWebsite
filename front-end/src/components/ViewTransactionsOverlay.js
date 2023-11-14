import React, { useState } from 'react'

import '../css/AddBankAccountOverlay.css';
import '../css/BankAccountOverview.css';

export default function ViewTransactions({open, onClose, email, accType, accountTrans, showBaseAmount})
{
    const [showAmount, setShowAmount] = useState(showBaseAmount);
    const dayjs = require('dayjs')

    if (!open) return null;

    var count = 0;
    var style = "bank-app-buttons";

    for (var i = 0; i < accountTrans.data.length; i++)
    {
        if (accountTrans.data[i].email === email && accountTrans.data[i].accType === accType)
        {
            count++;
        }

        if (count > showAmount)
        {
            style = "bank-app-buttons"
        }
        else
        {
            style = "hidden"
        }
    }

    const handleShowMore = (event) =>
    {
        for (var i = 0; i < accountTrans.data.length; i++)
        {
            if (accountTrans.data[i].email === email && accountTrans.data[i].accType === accType)
            {
                count++;
            }

            setShowAmount(event.target.value);

            if (count > showAmount)
            {
                style = "bank-app-buttons"
            }
            else
            {
                style = "hidden"
            }
        }
    }

    return(
        <>
            <div id = "overlay-background"></div>
            
                <div id = "main-overlay">
                <h2>{accType.toUpperCase()} ACCOUNT TRANSACTIONS</h2>
                    <br></br>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountTrans.data
                            .filter((trans) => trans.email === email && trans.accType === accType)
                            .slice(0, showAmount)
                            .map(trans =>
                                {
                                    let amountStyle = "base";
                                    let amountText = ""

                                    if (trans.isDeduct && trans.amount != 0)
                                    {
                                        amountStyle = "table-transaction-withdraw-amount"
                                        amountText = ("-$" + trans.amount)
                                    }
                                            
                                    if (!trans.isDeduct && trans.amount != 0)
                                    {
                                        amountStyle = "table-transaction-deposit-amount"
                                         amountText = ("+$" + trans.amount)
                                    }

                                    return(
                                        <tr key = {trans.date}>
                                            <td>{dayjs(trans.date).format('YYYY/MM/DD')}</td>
                                            <td>{trans.transType.toUpperCase()}</td>
                                            <td id = {amountStyle} >{amountText}</td>
                                        </tr>  
                                        )     
                                          
                                })}
                        </tbody>
                    </table>

                <br></br>
                <button className = {style} value = {Number(showAmount) + Number(5)} onClick = {handleShowMore}>Show More</button>
                <br></br>
                <button className = "bank-app-buttons" id = "overlayButton-exit" onClick = {onClose}>Exit</button>
            </div>
        
        </>
    )
}