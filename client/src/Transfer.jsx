import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";
import { hashMessage, signMessage } from "./utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const amount = parseInt(sendAmount);
      const _data = {
        amount,
        recipient,
      };

      const hashedMessage = hashMessage(_data);
      const [signature, recoveryBit] = await signMessage(
        hashedMessage,
        privateKey
      );

      const { data } = await server.post(`send`, {
        message: _data,
        signature: toHex(signature),
        recoveryBit,
      });
      setBalance(data?.balance);
    } catch (ex) {
      alert(ex);
    }
  }

  /**
   * @todo - sign transaction using the private key for the selected owned address and send funds to the receipient address
   */
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>Sender: {address}</label>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
