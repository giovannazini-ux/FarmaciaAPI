
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def conectar():
    conexao = sqlite3.connect("farmacia.db")
    conexao.row_factory = sqlite3.Row
    return conexao

def criar_tabela():
    conexao = conectar()

    conexao.execute("""
        CREATE TABLE IF NOT EXISTS medicamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            fabricante TEXT NOT NULL,
            preco REAL NOT NULL,
            estoque INTEGER NOT NULL
        )
    """)

    conexao.commit()
    conexao.close()

@app.route("/medicamentos", methods=["GET"])
def listar_medicamentos():
    conexao = conectar()

    medicamentos = conexao.execute(
        "SELECT * FROM medicamentos"
    ).fetchall()

    conexao.close()

    return jsonify([dict(item) for item in medicamentos])

@app.route("/medicamentos", methods=["POST"])
def cadastrar_medicamento():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Dados não enviados"}), 400

    try:
        nome = dados["nome"].strip()
        fabricante = dados["fabricante"].strip()
        preco = float(dados["preco"])
        estoque = int(dados["estoque"])

        if not nome or not fabricante or preco < 0 or estoque < 0:
            return jsonify({"erro": "Confira os dados informados"}), 400

    except (KeyError, ValueError, TypeError, AttributeError):
        return jsonify({"erro": "Preencha todos os campos corretamente"}), 400

    conexao = conectar()

    conexao.execute(
        """INSERT INTO medicamentos
        (nome, fabricante, preco, estoque)
        VALUES (?, ?, ?, ?)""",
        (nome, fabricante, preco, estoque)
    )

    conexao.commit()
    conexao.close()

    return jsonify({"mensagem": "Medicamento cadastrado com sucesso!"}), 201

if __name__ == "__main__":
    criar_tabela()
    app.run(debug=True, port=5000)
