const url = "http://127.0.0.1:5000/medicamentos";

const formulario = document.getElementById("formMedicamento");
const lista = document.getElementById("listaMedicamentos");
const mensagem = document.getElementById("mensagem");

async function listarMedicamentos() {
    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar medicamentos");
        }

        const medicamentos = await resposta.json();

        lista.innerHTML = "";

        if (medicamentos.length === 0) {
            lista.textContent = "Nenhum medicamento cadastrado.";
            return;
        }

        medicamentos.forEach(function(medicamento) {
            const item = document.createElement("div");
            item.className = "medicamento";

            const nome = document.createElement("h3");
            nome.textContent = medicamento.nome;

            const detalhes = document.createElement("p");
            detalhes.textContent =
                "Fabricante: " + medicamento.fabricante +
                " | Preço: R$ " + Number(medicamento.preco).toFixed(2) +
                " | Estoque: " + medicamento.estoque;

            item.appendChild(nome);
            item.appendChild(detalhes);
            lista.appendChild(item);
        });

    } catch (erro) {
        lista.textContent = "Erro ao carregar os medicamentos.";
        console.error(erro);
    }
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        fabricante: document.getElementById("fabricante").value,
        preco: document.getElementById("preco").value,
        estoque: document.getElementById("estoque").value
    };

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao cadastrar");
        }

        mensagem.textContent = resultado.mensagem;
        formulario.reset();

        await listarMedicamentos();

    } catch (erro) {
        mensagem.textContent = erro.message;
        console.error(erro);
    }
});

listarMedicamentos();
