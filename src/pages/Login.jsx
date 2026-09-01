import { useState } from "react";

function Login({ entrar }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [erro, setErro] = useState("");

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

            const token = await resposta.text();

            console.log("Resposta do login:", token);

            if (!resposta.ok) {
                setErro(
                    token.erro ||
                    token.Erro ||
                    "Username ou password inválidos"
                );

                return;
            } else {
                console.log("Token recebido:", token);



                if (!resposta.ok) {
                    setErro("Username ou password inválidos");
                    return;
                }
                localStorage.setItem("meu_token", token);
                entrar(token);
            }


        } catch (error) {
            console.error(error);
            setErro("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div>
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
        </div>
    );
}

export default Login;