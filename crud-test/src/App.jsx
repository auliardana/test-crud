// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   useEffect(() => {
//     fetch("http://localhost:8080/users")
//       .then(res => res.json())
//       .then(data => setUsers(data));
//   }, []);

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { useState } from "react";

function App() {
  const [method, setMethod] = useState("bcrypt"); // or "aes"
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const API_BASE = "http://localhost:8080";

  async function handleEncrypt(e) {
    e.preventDefault();
    setResult(null);
    try {
      const endpoint = method === "bcrypt" ? "/bcrypt/encrypt" : "/aes/encrypt";
      const res = await fetch(API_BASE + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
  }

  async function handleDecrypt(e) {
    e.preventDefault();
    setResult(null);
    try {
      if (method !== "aes") {
        setResult({ error: "Decrypt only available for AES method." });
        return;
      }
      const res = await fetch(API_BASE + "/aes/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyResult(null);
    try {
      const res = await fetch(API_BASE + "/bcrypt/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, hash: verifyHash }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch (err) {
      setVerifyResult({ error: err.message });
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, sans-serif",  }}>
      <h2>Encrypt/Decrypt Demo</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="radio"
            value="bcrypt"
            checked={method === "bcrypt"}
            onChange={() => setMethod("bcrypt")}
          />{" "}
          bcrypt (one-way hash)
        </label>{" "}
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            value="aes"
            checked={method === "aes"}
            onChange={() => setMethod("aes")}
          />{" "}
          AES-256-GCM (reversible)
        </label>
      </div>

      <form onSubmit={handleEncrypt}>
        <div>
          <textarea
            rows={4}
            cols={60}
            placeholder="Masukkan teks..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Encrypt / Hash</button>{" "}
          <button type="button" onClick={handleDecrypt} disabled={method !== "aes"}>
            Decrypt (AES only)
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 12 }}>
          <h4>Result</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <hr />

      <h3>Verify bcrypt hash</h3>
      <form onSubmit={handleVerify}>
        <div>
          <input
            style={{ width: "60%" }}
            placeholder="Plain text to verify"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            style={{ width: "60%" }}
            placeholder="Hash (from bcrypt/encrypt)"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Verify</button>
        </div>
      </form>
      {verifyResult && (
        <div style={{ marginTop: 12 }}>
          <strong>Verify result:</strong>
          <pre>{JSON.stringify(verifyResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
