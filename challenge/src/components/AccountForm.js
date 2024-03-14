import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import "../Form.css";

const AccountForm = ({ setAccount }) => {
  const [accountNo, setAccountNo] = useState("");
  const [helperText, setHelperText] = useState("");

  const handleClicked = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/accounts/${accountNo}`
      );
      const resData = response.data?.[0];
      if (!resData) setHelperText("Account not found");
      setAccount(resData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Form">
      <TextField
        id="account-number"
        label="Account number"
        variant="outlined"
        helperText={helperText}
        value={accountNo}
        onChange={(e) => {
          setHelperText();
          setAccountNo(e.target.value);
        }}
      />
      <Button variant="outlined" onClick={handleClicked}>
        Confirm
      </Button>
    </div>
  );
};

export default AccountForm;
