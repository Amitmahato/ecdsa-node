import { keccak256 } from "ethereum-cryptography/keccak";
import { sign } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export const generateAddress = (publicKey) => {
  return `0x${toHex(keccak256(publicKey).slice(-20))}`;
};

export const getDataFromLocalStorage = () => {
  let _data = localStorage.getItem("privateKeys");
  if (!_data) {
    _data = JSON.stringify({});
  }

  return JSON.parse(_data);
};

export const addDataToLocalStorage = async (data) => {
  let storedData = getDataFromLocalStorage();
  storedData = { ...storedData, ...data };
  const storeData = JSON.stringify(storedData);

  return Promise.resolve().then(function () {
    localStorage.setItem("privateKeys", storeData);
  });
};

export const removeDataFromLocalStorage = async () => {
  localStorage.removeItem("privateKeys");
};

export const hashMessage = (data) => {
  return keccak256(utf8ToBytes(JSON.stringify(data)));
};

export const signMessage = async (
  hashedMessage,
  privateKey,
  recover = true
) => {
  return await sign(hashedMessage, privateKey, { recovered: recover });
};
