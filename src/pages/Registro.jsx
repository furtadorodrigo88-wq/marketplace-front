import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registro() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const fazerRegistro = async (e) => {

        e.preventDefault();

        try {

            const resposta = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password,
                        email: email
                    })
                }
            );

            if (resposta.ok) {

                alert("Conta criada com sucesso!");

                navigate("/login");

            } else {

                const erro = await resposta.text();

                alert(
                    erro || "Erro no registro!"
                );
            }

        } catch (error) {

            console.error(error);

            alert("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div>

            <h1>Registo</h1>

            <form onSubmit={fazerRegistro}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Registar
                </button>

            </form>

            <p>
                Já tens conta?
                {" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Registro;