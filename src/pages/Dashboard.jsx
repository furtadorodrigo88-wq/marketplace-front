import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const [servicos, setServicos] = useState([]);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [precoComDesconto, setPrecoComDesconto] = useState("");
    const [imagenCapa, setImagenCapa] = useState("");
    const [estado, setEstado] = useState(true);

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");


    /*
     * =====================================================
     * GET - LISTAR SERVIÇOS
     * =====================================================
     */

    const carregarServicos = async () => {

        try {

            const token = localStorage.getItem("meu_token");

            // Se não existir token, voltar para Login
            if (!token) {
                navigate("/login");
                return;
            }

            const resposta = await fetch(
                `${import.meta.env.VITE_API_URL}/v1/servicos?page=0&size=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            /*
             * Token inválido ou expirado
             */
            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                localStorage.removeItem("meu_token");

                navigate("/login");

                return;
            }

            const dados = await resposta.json();

            console.log("Serviços recebidos:", dados);

            setServicos(dados.content || []);

        } catch (error) {

            console.error(error);

            setErro("Erro ao carregar os serviços.");
        }
    };


    /*
     * =====================================================
     * POST - CRIAR SERVIÇO
     * =====================================================
     */

    const criarServico = async (event) => {

        event.preventDefault();

        setMensagem("");
        setErro("");

        try {

            const token = localStorage.getItem("meu_token");

            if (!token) {
                navigate("/login");
                return;
            }

            const resposta = await fetch(
                `${import.meta.env.VITE_API_URL}/v1/servicos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        titulo: nome,
                        descricao: descricao,
                        preco: Number(preco),
                        precoComDesconto: Number(precoComDesconto),
                        estado: estado,
                        imagenCapa: imagenCapa,
                    }),
                }
            );

            /*
             * Token inválido ou expirado
             */
            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                localStorage.removeItem("meu_token");

                navigate("/login");

                return;
            }

            const texto = await resposta.text();

            let dados = {};

            try {
                dados = JSON.parse(texto);
            } catch {
                dados = {
                    mensagem: texto
                };
            }

            /*
             * Verificar erro
             */
            if (!resposta.ok) {

                setErro(
                    dados.erro ||
                    dados.Erro ||
                    dados.mensagem ||
                    "Erro ao criar o serviço."
                );

                return;
            }

            /*
             * Serviço criado
             */
            setMensagem("Serviço criado com sucesso!");

            /*
             * Limpar formulário
             */
            setNome("");
            setDescricao("");
            setPreco("");
            setPrecoComDesconto("");
            setEstado(true);
            setImagenCapa("");

            /*
             * Atualizar lista
             */
            carregarServicos();

        } catch (error) {

            console.error(error);

            setErro("Erro ao conectar com o servidor.");
        }
    };


    /*
     * =====================================================
     * LOGOUT
     * =====================================================
     */

    const logout = () => {

        localStorage.removeItem("meu_token");

        navigate("/login");
    };


    /*
     * =====================================================
     * CARREGAR SERVIÇOS
     * =====================================================
     */

    useEffect(() => {

        carregarServicos();

    }, []);


    /*
     * =====================================================
     * HTML DO DASHBOARD
     * =====================================================
     */

    return (
        <div>

            <h1>Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Serviços</h2>

            {erro && (
                <p>
                    {erro}
                </p>
            )}

            {mensagem && (
                <p>
                    {mensagem}
                </p>
            )}

            {servicos.length === 0 ? (

                <p>
                    Nenhum serviço encontrado.
                </p>

            ) : (

                <div>

                    {servicos.map((servico) => (

                        <div key={servico.id}>

                            <h3>
                                {servico.titulo || servico.nome}
                            </h3>

                            <p>
                                {servico.descricao}
                            </p>

                            <p>
                                Preço: {servico.preco}
                            </p>

                            <p>
                                Preço com desconto:{" "}
                                {servico.precoComDesconto}
                            </p>

                            <p>
                                Estado:{" "}
                                {servico.estado
                                    ? "Ativo"
                                    : "Inativo"}
                            </p>

                            <p>
                                Imagem de capa:{" "}
                                {servico.imagenCapa}
                            </p>

                            <hr />

                        </div>

                    ))}

                </div>

            )}


            <hr />


            <h2>Criar Serviço</h2>

            <form onSubmit={criarServico}>

                <div>

                    <label>
                        Nome
                    </label>

                    <br />

                    <input
                        type="text"
                        value={nome}
                        onChange={(event) =>
                            setNome(event.target.value)
                        }
                        placeholder="Nome do serviço"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Descrição
                    </label>

                    <br />

                    <textarea
                        value={descricao}
                        onChange={(event) =>
                            setDescricao(event.target.value)
                        }
                        placeholder="Descrição do serviço"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Preço
                    </label>

                    <br />

                    <input
                        type="number"
                        step="0.01"
                        value={preco}
                        onChange={(event) =>
                            setPreco(event.target.value)
                        }
                        placeholder="Preço"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Preço com Desconto
                    </label>

                    <br />

                    <input
                        type="number"
                        step="0.01"
                        value={precoComDesconto}
                        onChange={(event) =>
                            setPrecoComDesconto(event.target.value)
                        }
                        placeholder="Preço com desconto"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Estado
                    </label>

                    <br />

                    <input
                        type="checkbox"
                        checked={estado}
                        onChange={(event) =>
                            setEstado(event.target.checked)
                        }
                    />

                </div>

                <br />

                <div>

                    <label>
                        Imagem de Capa
                    </label>

                    <br />

                    <input
                        type="text"
                        value={imagenCapa}
                        onChange={(event) =>
                            setImagenCapa(event.target.value)
                        }
                        placeholder="URL da imagem"
                    />

                </div>

                <br />

                <button type="submit">
                    Criar Serviço
                </button>

            </form>

        </div>
    );
}

export default Dashboard;

