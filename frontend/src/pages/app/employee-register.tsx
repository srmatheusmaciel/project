import React, { useState } from 'react';

// Função para validar o e-mail
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Função para validar e formatar o CPF (apenas números)
const validateAndFormatCPF = (cpf: string): string => {
  const cpfRegex = /^\d{11}$/; // Verifica se o CPF tem 11 dígitos
  if (cpfRegex.test(cpf)) {
    // Formatar CPF como 000.000.000-00
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf; // Retorna o CPF original se não for válido
};

// Função para validar e formatar o telefone (formato (XX) XXXXX-XXXX)
const validateAndFormatPhone = (phone: string): string => {
  // Verifica se o telefone tem 11 dígitos, sem parênteses ou espaços
  const phoneRegex = /^\d{11}$/;
  if (phoneRegex.test(phone)) {
    // Formatar telefone como (XX) XXXXX-XXXX
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone; // Retorna o telefone original se não for válido
};

// Função para validar a data de admissão (não pode ser uma data no futuro)
const validateAdmissionDate = (date: string): boolean => {
  const admissionDate = new Date(date);
  const currentDate = new Date();
  return admissionDate <= currentDate;
};

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  dataAdmissao: string;
}

// Definindo o tipo do estado de erros
interface Errors {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  dataAdmissao: string;
}

const EmployeeRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    dataAdmissao: '',
  });

  const [errors, setErrors] = useState<Errors>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    dataAdmissao: '',
  });

  // Função para lidar com as mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors: Errors = {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      endereco: '',
      dataAdmissao: '',
    };

    // Validação do nome (máximo de 20 caracteres)
    if (formData.nome.length > 20) {
      valid = false;
      newErrors.nome = 'Nome não pode ter mais de 20 caracteres';
    }

    // Validação do email
    if (!validateEmail(formData.email)) {
      valid = false;
      newErrors.email = 'Email inválido';
    }

    // Validação do CPF
    const formattedCPF = validateAndFormatCPF(formData.cpf);
    if (formattedCPF === formData.cpf) {
      valid = false;
      newErrors.cpf = 'CPF inválido';
    } else {
      formData.cpf = formattedCPF; // Atualiza o CPF formatado
    }

    // Validação do telefone
    const formattedPhone = validateAndFormatPhone(formData.telefone);
    if (formattedPhone === formData.telefone) {
      valid = false;
      newErrors.telefone = 'Telefone inválido. Use o formato (XX) XXXXX-XXXX';
    } else {
      formData.telefone = formattedPhone; // Atualiza o telefone formatado
    }

    // Validação do endereço (máximo de 200 caracteres)
    if (formData.endereco.length > 200) {
      valid = false;
      newErrors.endereco = 'Endereço não pode ter mais de 200 caracteres';
    }

    // Validação da data de admissão (não pode ser no futuro)
    if (!validateAdmissionDate(formData.dataAdmissao)) {
      valid = false;
      newErrors.dataAdmissao = 'A data de admissão não pode ser no futuro';
    }

    setErrors(newErrors);

    if (valid) {
      alert('Cadastro de empregado realizado com sucesso!');
      // Aqui você pode enviar os dados para um servidor ou fazer outras ações necessárias
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cadastro de Colaboradores</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-gray-700">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            maxLength={20}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome"
            required
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o e-mail"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-gray-700">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            maxLength={11}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o CPF"
            required
          />
          {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-gray-700">Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o telefone (formato: (XX) XXXXX-XXXX)"
            required
          />
          {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
        </div>

        {/* Endereço */}
        <div>
          <label htmlFor="endereco" className="block text-gray-700">Endereço</label>
          <textarea
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            maxLength={200}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o endereço"
            required
          />
          {errors.endereco && <p className="text-red-500 text-sm">{errors.endereco}</p>}
        </div>

        {/* Data de Admissão */}
        <div>
          <label htmlFor="dataAdmissao" className="block text-gray-700">Data de Admissão</label>
          <input
            type="date"
            id="dataAdmissao"
            name="dataAdmissao"
            value={formData.dataAdmissao}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.dataAdmissao && <p className="text-red-500 text-sm">{errors.dataAdmissao}</p>}
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Cadastrar Colaborador
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegister;
