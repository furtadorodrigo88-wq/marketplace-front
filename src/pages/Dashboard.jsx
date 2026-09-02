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

        // ==========================================
        // 1 - CRIAR O SERVIÇO
        // ==========================================

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
                    imagenCapa: "",
                }),
            }
        );

        if (resposta.status === 401 || resposta.status === 403) {
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
                mensagem: texto,
            };
        }

        if (!resposta.ok) {
            setErro(
                dados.erro ||
                dados.Erro ||
                dados.mensagem ||
                "Erro ao criar o serviço."
            );

            return;
        }

        console.log("Serviço criado:", dados);

        // ==========================================
        // 2 - PEGAR O ID DO SERVIÇO
        // ==========================================

        const idServico = dados.id;

        if (!idServico) {
            setErro(
                "Serviço criado, mas o servidor não devolveu o ID."
            );

            console.error("Resposta:", dados);

            return;
        }

        // ==========================================
        // 3 - FAZER UPLOAD DA IMAGEM AUTOMATICAMENTE
        // ==========================================

        if (imagenCapa) {

            const formData = new FormData();

            formData.append("file", imagenCapa);

            const respostaUpload = await fetch(
                `${import.meta.env.VITE_API_URL}/v1/servicos/${idServico}/upload-capa`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (
                respostaUpload.status === 401 ||
                respostaUpload.status === 403
            ) {
                localStorage.removeItem("meu_token");
                navigate("/login");
                return;
            }

            if (!respostaUpload.ok) {

                const erroUpload =
                    await respostaUpload.text();

                console.error(
                    "Erro no upload:",
                    erroUpload
                );

                setErro(
                    "Serviço criado, mas ocorreu um erro ao enviar a imagem."
                );

                return;
            }

            console.log(
                "Imagem enviada com sucesso!"
            );
        }

        // ==========================================
        // 4 - SUCESSO
        // ==========================================

        setMensagem(
            "Serviço criado e imagem enviada com sucesso!"
        );

        // Limpar formulário
        setNome("");
        setDescricao("");
        setPreco("");
        setPrecoComDesconto("");
        setEstado(true);
        setImagenCapa(null);

        // Atualizar serviços
        carregarServicos();

    } catch (error) {

        console.error(error);

        setErro(
            "Erro ao conectar com o servidor."
        );
    }
};

