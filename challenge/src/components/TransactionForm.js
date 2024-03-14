import React, { useEffect, useReducer, useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import axios from "axios";

import "../Form.css";

const ACC_TYPE = Object.freeze({
  CHECKING: "checking",
  SAVINGS: "savings",
  CREDIT: "credit",
});

const initialWithdrawal = {
  total: 0,
  lastWithdrawalDate: null,
};

const TransactionForm = ({ account }) => {
  const [transType, setTransType] = useState("withdraw");
  const [amount, setAmount] = useState(0);
  const [wState, wDispatch] = useReducer(reducer, initialWithdrawal);

  const transTypeChanged = (_, newType) => {
    setTransType(newType);
  };

  const handleAmountChanged = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/accounts/${account.account_number}`
      );

      const resData = response.data?.[0];

      console.log(resData);

      wDispatch({
        type: transType,
        accountId: account.account_number,
        amount: +amount,
        accountType: account.type,
        balance: +resData.amount,
        creditLimit: account.credit_limit,
      });
    } catch (err) {
      console.error("Api request error", err);
    }
  };

  return (
    <div className="Form">
      <ToggleButtonGroup
        color="primary"
        value={transType}
        onChange={transTypeChanged}
        exclusive
      >
        <ToggleButton value="withdraw">Withdraw</ToggleButton>
        <ToggleButton value="deposit">Deposit</ToggleButton>
        <ToggleButton value="balance">Balance</ToggleButton>
      </ToggleButtonGroup>
      {transType === "balance" ? (
        // Rule #8 The customer should be output their balance when selecting this option.
        <h4>{`Balance: $${wState.newBalance ?? account.amount ?? 0}`}</h4>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            id="dollar-input"
            label="Amount"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            helperText={wState.error}
            value={amount}
            onChange={handleAmountChanged}
          />
          <Button variant="outlined" onClick={handleSubmit}>
            {transType === "withdraw" ? "Withdraw" : "Deposit"}
          </Button>
        </div>
      )}
    </div>
  );
};

function reducer(state, action) {
  const currentDate = new Date().toDateString();

  switch (action.type) {
    case "withdraw":
      let tempState = {};

      // update last withdraw date and reset
      if (state.lastWithdrawalDate !== currentDate) {
        tempState.lastWithdrawalDate = currentDate;
        tempState.total = 0;
      } else {
        tempState = { ...state };
      }

      if (action.accountType === ACC_TYPE.CREDIT) {
        // Rule #5 unless it is a credit account, in which case they cannot withdraw more than their credit limit
        const availableCredit =
          action.creditLimit + (action.balance - action.amount);
        if (availableCredit >= 0) {
          return commonValidation(state, action, tempState);
        } else {
          return { ...state, error: "Exceeded credit limit" };
        }
      } else {
        // checking or savings
        return commonValidation(state, action, tempState);
      }
    case "deposit":
      console.log("bal", action.balance);
      console.log("amt", action.amount);
      const newBalance = action.balance + action.amount;

      // Rule #7 If this is a credit account, the customer cannot deposit more in their
      // account than is needed to 0 out the account.
      if (action.accountType === ACC_TYPE.CREDIT) {
        console.log("newbal", newBalance);
        if (newBalance > 0) {
          return { ...state, error: "Cannot deposit more than owed" };
        } else if (action.amount > 1000) {
          return { ...state, error: "Deposit exceeded" };
        }
      } else if (action.amount > 1000) {
        // Rule #6 A customer cannot deposit more than $1000 in a single transaction.
        return { ...state, error: "Deposit exceeded" };
      }

      // update db
      updateDbBalance(action.accountId, newBalance);
      return { ...state, newBalance };
    case "balance":
      break;
    default:
      break;
  }
}

const commonValidation = (state, action, tempState) => {
  if (action.amount > 200) {
    // Rule #1 A customer can withdraw no more than $200 in a single transaction.
    return { ...state, error: "No more than $200" };
  } else if (tempState.total + action.amount > 400) {
    // Rule #2 A customer can withdraw no more than $400 in a single day.
    return { ...state, error: "No more than $400 per day" };
  } else if (action.amount % 5 !== 0) {
    // Rule #3 A customer can withdraw any amount that can be dispensed in $5 bills.
    return { ...state, error: "Only be dispensed in $5" };
  } else if (
    action.accountType !== ACC_TYPE.CREDIT &&
    action.balance - action.amount < 0
  ) {
    // Rule #4 The customer cannot withdraw more than they have in their account, unless it is a credit account
    return { ...state, error: "Withdrawal exceeded" };
  } else {
    const newAmount = action.balance - action.amount;
    // update db
    updateDbBalance(action.accountId, newAmount);
    // execute withdrawal
    return {
      ...tempState,
      total: tempState.total + action.amount,
      newBalance: newAmount,
    };
  }
};

const updateDbBalance = async (account_number, amount) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/updateBalance",
      { account_number, amount }
    );
  } catch (err) {
    console.error("Error", err);
  }
};

export default TransactionForm;
