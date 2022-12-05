const { keccak256 } = require("ethereum-cryptography/keccak");
const { recoverPublicKey } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const hashMessage = (data) => {
  return keccak256(utf8ToBytes(JSON.stringify(data)));
};

const recoverPublicKeyFromSignature = (data, signature, recoveryBit) => {
  const hashedMessage = hashMessage(data);
  return recoverPublicKey(hashedMessage, signature, recoveryBit);
};

const generateAddress = (publicKey) => {
  return `0x${toHex(keccak256(publicKey).slice(-20))}`;
};

module.exports = {
  hashMessage,
  recoverPublicKeyFromSignature,
  generateAddress,
};
