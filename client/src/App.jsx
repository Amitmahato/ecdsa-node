import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import PrivateKey from "./PrivateKey";
import { getDataFromLocalStorage } from "./utils";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [storedData, setStoredData] = useState({});

  useEffect(() => {
    const data = getDataFromLocalStorage();
    setStoredData(data);
  }, []);

  useEffect(() => {
    if (address.length > 0 && Object.keys(storedData).length > 0) {
      setPrivateKey(storedData[address]);
    }
  }, [address]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <PrivateKey
        privateKey={privateKey}
        address={address}
        setPrivateKey={setPrivateKey}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
      />
    </div>
  );
}

export default App;
