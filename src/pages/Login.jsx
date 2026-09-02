import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    const fazerLogin = async (event) => {
        event.preventDefault();

        setErro("");

        try {
            const resposta = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            );

            const dados = await resposta.text();

            console.log("Resposta do login:", dados);

            if (!resposta.ok) {
                setErro(
                    dados || "Username ou password inválidos"
                );

                return;
            }

            const token = dados;

            console.log("Token recebido:", token);

            // Guardar token
            localStorage.setItem("meu_token", token);

            // Ir para o Dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setErro("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="bg-red-500">
            <h1>Login</h1>
            {erro && (
                <p>
                    {erro}
                </p>
            )}
            <form onSubmit={fazerLogin}>
                <div>
                    <label>
                        Username
                    </label>
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                    />
                </div>
                <br />
                <div>
                    <label>
                        Password
                    </label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>
                <br />
                <button type="submit">
                    Entrar
                </button>
            </form>
            <p>
                Não tens uma conta?
                {" "}
                <Link to="/register">
                    Registrar
                </Link>
            </p>
        </div>
    );
}

export default Login;