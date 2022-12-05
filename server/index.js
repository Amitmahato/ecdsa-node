const express = require("express");
const app = express();
const cors = require("cors");
const { generateAddress, recoverPublicKeyFromSignature } = require("./utils");

const port = 3042;

app.use(cors());
app.use(express.json());

// key - wallet address
// value - balance for corresponding wallet address
const balances = {
  "0x0495951b865b38ece48d5c9a4d2d26e8ef5ee218": 100,
  "0xf3bb44837de36076123386a46db8a64f8e491e82": 50,
  "0xc216c3cddc4a01f8f6222bb4cb82f8dd7fad83d5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  try {
    const { message, signature, recoveryBit } = req.body;
    const { recipient, amount } = message;

    // The order in which original object data was placed before using JSON.stringify should not alter
    // otherwise the hash message generated will be completely different than it was originally generated
    // at client side, that is why it is best to send the data used to generate the hash be sent in its own object
    const publicKey = recoverPublicKeyFromSignature(
      message,
      signature,
      recoveryBit
    );

    const sender = generateAddress(publicKey);

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
