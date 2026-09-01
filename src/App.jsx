import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("meu_token")
  );

  const entrar = (novoToken) => {
    localStorage.setItem("meu_token", novoToken);
    setToken(novoToken);
  };

  const sair = () => {
    localStorage.removeItem("meu_token");
    setToken(null);
  };

  if (!token) {
    return <Login entrar={entrar} />;
  }

  return <Dashboard sair={sair} />;
}

export default App;