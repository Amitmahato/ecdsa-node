import { getPublicKey, utils } from "ethereum-cryptography/secp256k1";

import { toHex } from "ethereum-cryptography/utils";
import { useEffect, useState } from "react";
import { ZERO_ADDRESS } from "./constants";
import { addDataToLocalStorage, generateAddress } from "./utils";

function PrivateKey({ address, setAddress, setPrivateKey }) {
  const [localAddress, setLocalAddress] = useState(address || ZERO_ADDRESS);
  const [localPrivateKey, setLocalPrivateKey] = useState();
  const [error, setError] = useState();

  async function onChange(evt) {
    const _privateKey = evt.target.value;
    setLocalPrivateKey(_privateKey);
  }

  useEffect(() => {
    if (localPrivateKey?.length) {
      try {
        const publicKey = getPublicKey(localPrivateKey);
        const addr = generateAddress(publicKey);
        setLocalAddress(addr);
        setError(null);
      } catch (e) {
        setLocalAddress(ZERO_ADDRESS);
        setError("Invalid Private Key");
      }
    } else {
      setError(null);
    }
  }, [localPrivateKey]);

  const storePrivateKey = () => {
    if (error) {
      setPrivateKey(localPrivateKey);
      setAddress(localAddress);
      addDataToLocalStorage({
        [localAddress]: localPrivateKey,
      });
    }
  };

  const generateAndStorePrivateKey = async () => {
    const _privateKey = toHex(utils.randomPrivateKey());
    const _address = generateAddress(getPublicKey(_privateKey));

    // setLocalAddress(_address);
    setLocalPrivateKey(_privateKey);

    setPrivateKey(_privateKey);
    setAddress(_address);

    await addDataToLocalStorage({
      [_address]: _privateKey,
    });
  };

  return (
    <div className="container wallet">
      <h1>Your Private Key</h1>

      <label>Private Key</label>
      <input
        placeholder="Type a private key to store in the local storage"
        value={localPrivateKey}
        onChange={onChange}
      />
      <p className="danger font-small margin-top-five">{error}</p>

      <div className="address">Address: {localAddress}</div>

      <div className="button-group margin-top-20">
        <input
          type="submit"
          onClick={generateAndStorePrivateKey}
          className="button-outlined"
          value="Generate and Store"
        />
        <input
          type="submit"
          disabled={error}
          onClick={storePrivateKey}
          className="button"
          value="Store"
        />
      </div>
    </div>
  );
}

export default PrivateKey;
