import { useEffect, useState } from "react";
import { ZERO_ADDRESS } from "./constants";
import server from "./server";
import { getDataFromLocalStorage, removeDataFromLocalStorage } from "./utils";

function Wallet({ address, balance, setBalance, setAddress }) {
  const [walletAddress, setWalletAddress] = useState(address);

  async function onChange(evt) {
    const _address = evt.target.value;
    setWalletAddress(_address);
  }

  const [ownedwalletAddresses, setOwnedWalletAddresses] = useState([]);

  useEffect(() => {
    if (address.length) {
      setWalletAddress(address);
    }

    if (ownedwalletAddresses.length) {
      if (address.length && !ownedwalletAddresses.includes(address)) {
        // optimistic update
        setOwnedWalletAddresses([...ownedwalletAddresses, address]);
      }
    } else {
      const data = Object.keys(getDataFromLocalStorage());
      if (address.length) {
        data.push(address);
      }

      // set default selected address
      setAddress(data[0]);

      setOwnedWalletAddresses(data);
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      if (walletAddress) {
        const {
          data: { balance },
        } = await server.get(`balance/${walletAddress}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    })();
  }, [walletAddress]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>Your Wallet Addresses</label>
      <div>
        {(ownedwalletAddresses.length > 0
          ? ownedwalletAddresses
          : [ZERO_ADDRESS]
        ).map((ownedAddress) => (
          <div className="button-group background-gray" key={ownedAddress}>
            {ownedAddress}

            <input
              type="submit"
              onClick={() => {
                setAddress(ownedAddress);
              }}
              className="button fixed"
              disabled={address === ownedAddress}
              value={address === ownedAddress ? "✔" : "Select"}
            />
          </div>
        ))}

        {ownedwalletAddresses.length > 0 ? (
          <input
            type="submit"
            onClick={async () => {
              await removeDataFromLocalStorage();
              setOwnedWalletAddresses([]);
            }}
            className="button-outlined danger margin-top-10"
            value="Remove All"
          />
        ) : (
          <></>
        )}
      </div>

      <label />
      <label>Selected Wallet Address</label>
      <input
        placeholder="Type an address, for example: 0x1"
        value={walletAddress}
        onChange={onChange}
      />
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
