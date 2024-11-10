from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from datetime import datetime  # Importando para manipular datas
from werkzeug.security import generate_password_hash, check_password_hash
from bson.errors import InvalidId



app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

client = MongoClient('mongodb://mongo:27017/')
db = client.ongdb  # Conecta ao banco de dados chamado "ongdb"
patients_collection = db.patients  # Conecta à coleção "patients"
employees_collection = db.employees  # Conecta à coleção "employees"
reports_collection = db.reports  # Conecta à coleção "reports"
users_collection = db.users  # Conecta à coleção "users"


#------------- USUÁRIOS --------------

# Rota para adicionar um novo usuário
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = {
        "nome": data['nome'],
        "email": data['email'],
        "password": hashed_password,
        "tipo": data.get('tipo', 'comum')  # Define o tipo de usuário, 'admin' ou 'comum'
    }
    result = users_collection.insert_one(new_user)
    return jsonify({"message": "Usuário adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para listar todos os usuários
@app.route('/users', methods=['GET'])
def get_users():
    users = list(users_collection.find({}))
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200    

# Rota para visualizar detalhes de um usuário específico
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({"error": "Usuário não encontrado"}), 404


# Rota para atualizar um usuário
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    updated_data = {}

    # Verifica e atualiza apenas os campos fornecidos no JSON
    if 'nome' in data:
        updated_data['nome'] = data['nome']
    if 'email' in data:
        updated_data['email'] = data['email']
    if 'password' in data:
        updated_data['password'] = generate_password_hash(data['password'])
    if 'tipo' in data:
        updated_data['tipo'] = data['tipo']  # Atualiza o tipo do usuário, se fornecido

    # Verifica se existe algum campo para atualizar
    if updated_data:
        result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updated_data})
        if result.modified_count > 0:
            return jsonify({"message": "Usuário atualizado com sucesso"}), 200
        else:
            return jsonify({"message": "Nenhuma modificação realizada"}), 200
    else:
        return jsonify({"error": "Nenhum dado fornecido para atualização"}), 400

 # Rota para deletar um usuário
@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Usuário deletado com sucesso"}), 200
    return jsonify({"error": "Usuário não encontrado"}), 404   


#------------- LOGIN -----------------

# Rota de login para verificar credenciais
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({"email": data['email']})
    if user and check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Login bem-sucedido", "tipo": user['tipo']}), 200
    return jsonify({"error": "Credenciais inválidas"}), 401



#------------- SERVIÇOS --------------    

# Rota para listar todos os serviços
@app.route('/services', methods=['GET'])
def get_services():
    services = list(db.services.find({}))  # Recupera todos os serviços do MongoDB
    for service in services:
        service['_id'] = str(service['_id'])  # Converte ObjectId para string
        
    return jsonify(services), 200

# Rota para adicionar um novo serviço
@app.route('/services', methods=['POST'])
def add_service():
    data = request.get_json()
    new_service = {
         "name": data["name"],
        "description": data["description"],
        "price": data["price"],
        "date": datetime.now(),
        "employee_id": None,  # Inicialmente, sem atribuição
        "patient_id": None    # Inicialmente, sem atribuição
    }
    result = db.services.insert_one(new_service)  # Insere o novo serviço no MongoDB
    return jsonify(str(result.inserted_id)), 201


#--------- ATRIBUIR SERVICES ---------------
# Rota para atribuir um serviço a um funcionário e um paciente
@app.route('/assign_service', methods=['POST'])
def atribuir_servico():
    data = request.json
    service_id = data["service_id"]
    employee_id = data["employee_id"]
    patient_id = data["patient_id"]

    try:
        service = db.services.find_one({"_id": ObjectId(service_id)})
        employee = db.employees.find_one({"_id": ObjectId(employee_id)})
        patient = db.patients.find_one({"_id": ObjectId(patient_id)})
    except Exception as e:
        return jsonify({"message": f"Erro na busca: {str(e)}"}), 400

    if not service:
        return jsonify({"message": "Serviço não encontrado"}), 404
    if not employee:
        return jsonify({"message": "Funcionário não encontrado"}), 404
    if not patient:
        return jsonify({"message": "Paciente não encontrado"}), 404

    # Atribuir o funcionário e paciente ao serviço
    db.services.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": {"employee_id": ObjectId(employee_id), "patient_id": ObjectId(patient_id)}}
    )

    return jsonify({"message": "Serviço atribuído com sucesso"}), 200

 

# Rota para visualizar detalhes de um serviço específico
@app.route('/services/<service_id>', methods=['GET'])
@app.route('/services/<service_id>', methods=['GET'])
def get_service(service_id):
    # Procurar o serviço no banco de dados usando o id fornecido
    service = db.services.find_one({"_id": ObjectId(service_id)})
    
    if not service:
        return jsonify({"message": "Serviço não encontrado"}), 404

    # Garantir que a data seja um objeto datetime, ajustando para o formato correto
    service_date = service["date"]
    if isinstance(service_date, str):
        # Ajuste para o formato correto da string sem milissegundos e sem o sufixo 'Z'
        service_date = datetime.strptime(service_date, '%Y-%m-%dT%H:%M:%S')  # Ajuste para o formato correto

    # Procurar o funcionário e paciente associados ao serviço
    employee = db.employees.find_one({"_id": ObjectId(service.get('employee_id'))}) if service.get('employee_id') else None
    patient = db.patients.find_one({"_id": ObjectId(service.get('patient_id'))}) if service.get('patient_id') else None

    # Construir a resposta com os dados do serviço, funcionário e paciente
    service_data = {
        "service": {
            "id": str(service["_id"]),
            "name": service["name"],
            "description": service["description"],
            "price": service["price"],
            "date": service_date.strftime('%Y-%m-%d %H:%M:%S'),  # Convertendo para string formatada
            "employee": {
                "id": str(employee["_id"]) if employee else None,
                "name": employee["nome"] if employee else None
            },
            "patient": {
                "id": str(patient["_id"]) if patient else None,
                "name": patient["nome"] if patient else None
            }
        }
    }

    return jsonify(service_data), 200


# Rota para remover um serviço do MongoDB
@app.route('/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    result = db.services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Serviço deletado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

# Rota para atualizar um serviço
@app.route('/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    updated_data = request.get_json()
    result = db.services.update_one({"_id": ObjectId(service_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Serviço atualizado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404


# ---------------- PACIENTES ---------------- 

# Rota para adicionar um novo paciente
@app.route('/patients', methods=['POST'])
def add_patient():
    new_patient = request.get_json()  # Pega os dados enviados no corpo da requisição
    result = patients_collection.insert_one(new_patient)  # Insere o novo paciente no MongoDB
    return jsonify({"message": "Paciente adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para listar todos os pacientes
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = list(patients_collection.find({}))  # Recupera todos os pacientes do MongoDB
    for patient in patients:
        patient['_id'] = str(patient['_id'])  # Converte ObjectId para string
    return jsonify(patients), 200    

# Rota para visualizar detalhes de um paciente específico
@app.route('/patients/<patient_id>', methods=['GET'])
def get_patient_details(patient_id):
    patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        patient['_id'] = str(patient['_id'])
        return jsonify(patient), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

# Rota para remover um paciente do MongoDB
@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    result = patients_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Paciente deletado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

# Rota para atualizar os dados de um paciente
@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    updated_data = request.get_json()  # Pega os dados enviados no corpo da requisição
    result = patients_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Paciente atualizado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado"}), 404    


# ---------------- FUNCIONÁRIOS ----------------

# Rota para listar todos os funcionários
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = list(employees_collection.find({}))  # Recupera todos os funcionários do MongoDB
    for employee in employees:
        employee['_id'] = str(employee['_id'])  # Converte ObjectId para string
    return jsonify(employees), 200

# Rota para adicionar um novo funcionário
@app.route('/employees', methods=['POST'])
def add_employee():
    new_employee = request.get_json()
    new_employee['date_hired'] = datetime.now()  # Adiciona a data de contratação como a data atual
    result = employees_collection.insert_one(new_employee)  # Insere o novo funcionário no MongoDB
    return jsonify({"message": "Funcionário adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para visualizar detalhes de um funcionário específico
@app.route('/employees/<employee_id>', methods=['GET'])
def get_employee_details(employee_id):
    employee = employees_collection.find_one({"_id": ObjectId(employee_id)})
    if employee:
        employee['_id'] = str(employee['_id'])
        employee['date_hired'] = employee['date_hired'].strftime('%Y-%m-%d %H:%M:%S')  # Formata a data para string
        return jsonify(employee), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

# Rota para remover um funcionário do MongoDB
@app.route('/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    result = employees_collection.delete_one({"_id": ObjectId(employee_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Funcionário deletado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

# Rota para atualizar um funcionário
@app.route('/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    updated_data = request.get_json()
    result = employees_collection.update_one({"_id": ObjectId(employee_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Funcionário atualizado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

# ---------------- RELATÓRIOS ----------------
    
# Rota para listar todos os relatórios
@app.route('/reports', methods=['GET'])
def get_reports():
    reports = list(reports_collection.find({}))  # Recupera todos os relatórios do MongoDB
    for report in reports:
        report['_id'] = str(report['_id'])  # Converte ObjectId para string
    return jsonify(reports), 200

# Rota para adicionar um novo relatório
@app.route('/reports', methods=['POST'])
def add_report():
    new_report = request.get_json()
    new_report['data_geracao'] = datetime.now()  # Adiciona a data de geração atual

    result = reports_collection.insert_one(new_report)  # Insere o novo relatório no MongoDB
    return jsonify({"message": "Relatório adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para visualizar detalhes de um relatório específico
@app.route('/reports/<report_id>', methods=['GET'])
def get_report_details(report_id):
    report = reports_collection.find_one({"_id": ObjectId(report_id)})
    if report:
        report['_id'] = str(report['_id'])
        report['data_geracao'] = report['data_geracao'].strftime('%Y-%m-%d %H:%M:%S')  # Formata a data para string
        return jsonify(report), 200
    return jsonify({"error": "Relatório não encontrado"}), 404

# Rota para remover um relatório do MongoDB
@app.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    result = reports_collection.delete_one({"_id": ObjectId(report_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Relatório deletado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404

# Rota para atualizar um relatório
@app.route('/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    updated_data = request.get_json()
    result = reports_collection.update_one({"_id": ObjectId(report_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Relatório atualizado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404  










if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
