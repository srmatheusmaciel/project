import React, { useState } from 'react';


interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
    } else {
      // Lógica de envio do formulário (ex: envio para API)
      alert('Formulário enviado com sucesso');
      console.log(formData);
    }
  };

  return (
    <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-1 rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cadastro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu nome"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Criar Conta
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">Já tem uma conta? <a href="#" className="text-blue-500 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
