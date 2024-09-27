from flask import Flask, jsonify, request

# Inicializa a aplicação Flask
app = Flask(__name__)

# Simulação de banco de dados em memória (lista de projetos)
projects = []
# Rota para retornar todos os projetos (GET)
@app.route('/projects', methods=['GET'])
def get_projects():
 return jsonify(projects), 200
# Rota para adicionar um novo projeto (POST)
@app.route('/projects', methods=['POST'])
def add_project():
 new_project = request.get_json() # Pega os dados enviados no corpo da requisição
 projects.append(new_project)
 return jsonify(new_project), 201
# Ponto de entrada para rodar a aplicação
if __name__ == '__main__':
 app.run(host='0.0.0.0', port=5000, debug=True)