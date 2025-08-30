import { useEffect, useState } from "react";

function App() {
  // APIから取得するメッセージを格納するState
  const [message, setMessage] = useState<string>("Loading...");

  // コンポーネント初回レンダー時にAPIを呼び出す
  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error("API call failed:", err);
        setMessage("Error fetching data");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>React + TypeScript + Vite</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
