import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// Função para formatar número como moeda (R$)
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

interface FormData {
  serviceType: string;
  price: string;
  materials: string;
  serviceDate: Date | null;
  description: string;
}

const ServiceRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    price: '',
    materials: '',
    serviceDate: null,
    description: '',
  });

  // Função para tratar o campo de preço
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');

    // Converte para número e divide por 100 para tratar centavos
    const numericValue = parseFloat(value) / 100;

    // Formata o valor como moeda
    const formattedValue = formatCurrency(numericValue);

    setFormData((prev) => ({ ...prev, price: formattedValue }));
  };

  // Função para atualizar o estado dos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para atualizar a data selecionada
  const handleDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      serviceDate: date,
    }));
  };

  

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Exemplo de validação simples
    if (formData.serviceType.length === 0 || formData.materials.length === 0 || formData.description.length === 0) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (formData.serviceDate === null) {
      alert('Por favor, selecione uma data.');
      return;
    }

    // Lógica para enviar os dados (por exemplo, para uma API)
    alert('Serviço cadastrado com sucesso!');
    console.log(formData);
  };

  return (
    <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-1 rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cadastro de Serviço</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Serviço */}
          <div>
            <label htmlFor="serviceType" className="block text-gray-700">Tipo de Serviço</label>
            <input
              type="text"
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              maxLength={40}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Consultoria, Manutenção"
              required
            />
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="price" className="block text-gray-700">Preço (R$)</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handlePriceChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o preço"
              required
            />
          </div>

          {/* Materiais */}
          <div>
            <label htmlFor="materials" className="block text-gray-700">Materiais</label>
            <input
              type="text"
              id="materials"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              maxLength={20}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Ferramentas, Equipamentos"
              required
            />
          </div>

          {/* Data do Serviço */}
          <div>
            <label htmlFor="serviceDate" className="block text-gray-700">Data do Serviço</label>
            <DatePicker
              selected={formData.serviceDate}
              onChange={handleDateChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="materials" className="block text-gray-700">Materiais</label>
            <input
              type="text"
              id="materials"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              maxLength={200}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Ferramentas, Equipamentos"
              required             
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Cadastrar Serviço
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;
