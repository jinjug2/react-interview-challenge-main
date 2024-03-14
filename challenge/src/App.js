import "./App.css";
import TransactionForm from "./components/TransactionForm";
import AccountForm from "./components/AccountForm";
import { useState } from "react";

function App() {
  const [account, setAccount] = useState();

  return (
    <div className="App">
      {account ? (
        <TransactionForm account={account} />
      ) : (
        <AccountForm setAccount={setAccount} />
      )}
    </div>
  );
}

export default App;
