import React, { useState } from "react";

export default function App() {
  const [hashText, setHashText] = useState("");
  const [hashed, setHashed] = useState("");
  const [verifyText, setVerifyText] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const [encText, setEncText] = useState("");
  const [encrypted, setEncrypted] = useState("");

  const [decText, setDecText] = useState("");
  const [decrypted, setDecrypted] = useState("");

  async function callAPI(endpoint, data) {
    const res = await fetch(`http://localhost:8080/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function handleHash() {
    const r = await callAPI("hash", { text: hashText });
    setHashed(r["hash Text"] || "");
  }

  async function handleVerify() {
    const r = await callAPI("verify", {
      hash_text: verifyHash,
      text: verifyText,
    });
    setVerifyResult(r.match);
  }

  async function handleEncrypt() {
    const r = await callAPI("encrypt", { text: encText });
    setEncrypted(r.encrypted_text);
  }

  async function handleDecrypt() {
    const r = await callAPI("decrypt", { decrypt_text: decText });
    setDecrypted(r.decrypted_text);
  }

  return (
    <div className="p-10 space-y-10 max-w-xl mx-auto text-gray-900">
      <h1 className="text-2xl font-bold">Simple Crypto Test UI</h1>

      {/* HASH TEXT */}
      <div className="p-5 rounded-2xl shadow bg-white space-y-3">
        <h2 className="font-semibold text-lg">Hash Text</h2>
        <input
          className="border p-2 rounded w-full"
          placeholder="text to hash"
          value={hashText}
          onChange={(e) => setHashText(e.target.value)}
        />
        {hashed && (
          <div className="break-all mt-2 text-sm">Hashed: {hashed}</div>
        )}
        <button
          onClick={handleHash}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Hash
        </button>
      </div>

      {/* VERIFY HASH */}
      <div className="p-5 rounded-2xl shadow bg-white space-y-3">
        <h2 className="font-semibold text-lg">Verify Hash</h2>
        <input
          className="border p-2 rounded w-full"
          placeholder="hash"
          value={verifyHash}
          onChange={(e) => setVerifyHash(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="text"
          value={verifyText}
          onChange={(e) => setVerifyText(e.target.value)}
        />
        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Verify
        </button>
        {verifyResult !== null && (
          <div className="mt-2">Match: {verifyResult ? "true" : "false"}</div>
        )}
      </div>

      {/* ENCRYPT */}
      <div className="p-5 rounded-2xl shadow bg-white space-y-3">
        <h2 className="font-semibold text-lg">Encrypt Text</h2>
        <input
          className="border p-2 rounded w-full"
          placeholder="text to encrypt"
          value={encText}
          onChange={(e) => setEncText(e.target.value)}
        />
        <button
          onClick={handleEncrypt}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Encrypt
        </button>
        {encrypted && (
          <div className="break-all mt-2 text-sm">Encrypted: {encrypted}</div>
        )}
      </div>

      {/* DECRYPT */}
      <div className="p-5 rounded-2xl shadow bg-white space-y-3">
        <h2 className="font-semibold text-lg">Decrypt Text</h2>
        <input
          className="border p-2 rounded w-full"
          placeholder="encrypted base64"
          value={decText}
          onChange={(e) => setDecText(e.target.value)}
        />
        <button
          onClick={handleDecrypt}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Decrypt
        </button>
        {decrypted && (
          <div className="mt-2 text-sm">Decrypted: {decrypted}</div>
        )}
      </div>
    </div>
  );
}
