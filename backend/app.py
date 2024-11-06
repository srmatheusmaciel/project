from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps


# Inicializa a aplicação Flask e a conexão com MongoDB
app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")  # Usando localhost
db = client['lab_proteses']  # Nome do banco de dados

# Coleções do MongoDB
patients_collection = db['patients']
employees_collection = db['employees']
services_collection = db['services']
reports_collection = db['reports']
users_collection = db['users']

# Rota inicial
@app.route('/')
def index():
    return "API para gerenciamento de laboratório de prótese dentária. Use as rotas /patients, /employees, /services, e /reports para acessar os dados."



# Decorador para proteger rotas com autenticação
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token de acesso não fornecido'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({"_id": ObjectId(data['user_id'])})
        except:
            return jsonify({'message': 'Token inválido ou expirado'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Rota de cadastro de usuário
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Gera o hash da senha usando o método 'scrypt'
    hashed_password = generate_password_hash(data['password'], method='scrypt')
    new_user = {
        "name": data['name'],
        "username": data['username'],
        "password": hashed_password,
        "role": data.get('role', 'employee')  # Define o papel do usuário (ex.: 'employee' ou 'admin')
    }
    users_collection.insert_one(new_user)
    return jsonify({"message": "Usuário registrado com sucesso"}), 201

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    auth = request.get_json()
    user = users_collection.find_one({"username": auth['username']})
    if not user or not check_password_hash(user['password'], auth['password']):
        return make_response('Login inválido!', 401)
    
    token = jwt.encode({'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, 
                       app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({'token': token})

# Exemplo de rota protegida apenas para administradores
@app.route('/admin/reports', methods=['GET'])
@token_required
def get_all_reports(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Acesso não autorizado'}), 403
    
    reports = list(reports_collection.find())
    for report in reports:
        report['_id'] = str(report['_id'])
    return jsonify(reports), 200

# Exemplo de rota de usuário autenticado para visualizar seu perfil
@app.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    current_user['_id'] = str(current_user['_id'])
    del current_user['password']  # Remove o campo de senha da resposta
    return jsonify(current_user), 200    

# CRUD para Pacientes
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = list(patients_collection.find())
    for patient in patients:
        patient['_id'] = str(patient['_id'])
    return jsonify(patients), 200

@app.route('/patients', methods=['POST'])
def add_patient():
    new_patient = request.get_json()
    result = patients_collection.insert_one(new_patient)
    new_patient['_id'] = str(result.inserted_id)
    return jsonify(new_patient), 201

@app.route('/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        patient['_id'] = str(patient['_id'])
        return jsonify(patient), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    updated_data = request.get_json()
    result = patients_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Paciente atualizado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    result = patients_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Paciente deletado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado"}), 404


    # CRUD para Funcionários
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = list(employees_collection.find())
    for employee in employees:
        employee['_id'] = str(employee['_id'])
    return jsonify(employees), 200

@app.route('/employees', methods=['POST'])
def add_employee():
    new_employee = request.get_json()
    result = employees_collection.insert_one(new_employee)
    new_employee['_id'] = str(result.inserted_id)
    return jsonify(new_employee), 201

@app.route('/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    employee = employees_collection.find_one({"_id": ObjectId(employee_id)})
    if employee:
        employee['_id'] = str(employee['_id'])
        return jsonify(employee), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

@app.route('/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    updated_data = request.get_json()
    result = employees_collection.update_one({"_id": ObjectId(employee_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Funcionário atualizado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

@app.route('/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    result = employees_collection.delete_one({"_id": ObjectId(employee_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Funcionário deletado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

# CRUD para Serviços
@app.route('/services', methods=['GET'])
def get_services():
    services = list(services_collection.find())
    for service in services:
        service['_id'] = str(service['_id'])
    return jsonify(services), 200

@app.route('/services', methods=['POST'])
def add_service():
    new_service = request.get_json()
    result = services_collection.insert_one(new_service)
    new_service['_id'] = str(result.inserted_id)
    return jsonify(new_service), 201

@app.route('/services/<service_id>', methods=['GET'])
def get_service(service_id):
    service = services_collection.find_one({"_id": ObjectId(service_id)})
    if service:
        service['_id'] = str(service['_id'])
        return jsonify(service), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

@app.route('/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    updated_data = request.get_json()
    result = services_collection.update_one({"_id": ObjectId(service_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Serviço atualizado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

@app.route('/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    result = services_collection.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Serviço deletado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

    # CRUD para Relatórios
@app.route('/reports', methods=['GET'])
def get_reports():
    reports = list(reports_collection.find())
    for report in reports:
        report['_id'] = str(report['_id'])
    return jsonify(reports), 200

@app.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    report = reports_collection.find_one({"_id": ObjectId(report_id)})
    if report:
        report['_id'] = str(report['_id'])
        return jsonify(report), 200
    return jsonify({"error": "Relatório não encontrado"}), 404

@app.route('/reports', methods=['POST'])
def create_report():
    data = request.get_json()
    periodo = data.get('periodo', 'mensal')
    data_geracao = datetime.now().isoformat()

    # Busca todos os serviços e calcula valores
    services = list(services_collection.find())
    valor_total = sum(service['preco'] for service in services)
    total_servicos = len(services)

    # Calcula total de comissões
    total_comissoes = 0
    for service in services:
        employee_id = service.get('funcionario_id')
        if employee_id:
            employee = employees_collection.find_one({"_id": ObjectId(employee_id)})
            if employee and 'comissao' in employee:
                comissao = employee['comissao'] * service['preco'] / 100
                total_comissoes += comissao

    # Cria o novo relatório
    new_report = {
        "periodo": periodo,
        "total_servicos": total_servicos,
        "valor_total": valor_total,
        "total_comissoes": total_comissoes,
        "data_geracao": data_geracao
    }
    result = reports_collection.insert_one(new_report)
    new_report['_id'] = str(result.inserted_id)
    return jsonify(new_report), 201

@app.route('/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    updated_data = request.get_json()
    result = reports_collection.update_one({"_id": ObjectId(report_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Relatório atualizado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404

@app.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    result = reports_collection.delete_one({"_id": ObjectId(report_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Relatório deletado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404


# Exemplo de CRUD para Funcionários, Serviços e Relatórios seria semelhante
# com collections employees_collection, services_collection e reports_collection

# Ponto de entrada para rodar a aplicação
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
