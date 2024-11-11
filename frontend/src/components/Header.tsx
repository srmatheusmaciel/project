import React, { useState, useRef, useEffect } from 'react';

// Componente Header
const Header: React.FC = () => {
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [isServicosOpen, setIsServicosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Variável para armazenar o nome do usuário
  const [userName, setUserName] = useState('João Silva'); // Exemplo de nome

  // Referências para os menus
  const registrarMenuRef = useRef(null);
  const servicosMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Função para fechar os menus quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      registrarMenuRef.current && !registrarMenuRef.current.contains(event.target as Node) &&
      servicosMenuRef.current && !servicosMenuRef.current.contains(event.target as Node) &&
      userMenuRef.current && !userMenuRef.current.contains(event.target as Node)
    ) {
      setIsRegistrarOpen(false);
      setIsServicosOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  // Adiciona o evento de clique fora do menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para abrir um menu e fechar os outros
  const handleMenuToggle = (menu: string) => {
    if (menu === 'registrar') {
      setIsRegistrarOpen(!isRegistrarOpen);
      setIsServicosOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'servicos') {
      setIsServicosOpen(!isServicosOpen);
      setIsRegistrarOpen(false);
      setIsUserMenuOpen(false);
    } else if (menu === 'user') {
      setIsUserMenuOpen(!isUserMenuOpen);
      setIsRegistrarOpen(false);
      setIsServicosOpen(false);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex max-w-7xl mx-auto flex items-center justify-between">
        {/* Home / Dentalis */}
        <div className="text-2xl font-semibold">
        <a href="/" className="block px-4 py-2 hover:bg-gray-100">Dentalis</a>
        </div>

        {/* Menu Principal */}
        <nav className="flex gap-4">
          {/* Registrar */}
          <div className="relative" ref={registrarMenuRef}>
            <span
              className="cursor-pointer"
              onClick={() => handleMenuToggle('registrar')}
            >
              Registrar
            </span>
            {isRegistrarOpen && (
              <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                <ul className="space-y-2 p-2">
                  <li><a href="/employee-register" className="block px-4 py-2 hover:bg-gray-100">Novo Colaborador</a></li>
                  <li><a href="/patient-register" className="block px-4 py-2 hover:bg-gray-100">Novo Paciente</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Serviços */}
          <div className="relative" ref={servicosMenuRef}>
            <span
              className="cursor-pointer"
              onClick={() => handleMenuToggle('servicos')}
            >
              Serviços
            </span>
            {isServicosOpen && (
              <div className="absolute top-8 left-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
                <ul className="space-y-2 p-2">
                  <li><a href="/service-register" className="block px-4 py-2 hover:bg-gray-100">Serviço</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Relatórios */}
          <span className="cursor-pointer">Relatórios</span>
        </nav>

        {/* Foto de Usuário com Submenu */}
        <div className="relative flex items-center" ref={userMenuRef}>
          {/* Foto do usuário */}
          <img
            src="https://randomuser.me/api/portraits/men/4.jpg"
            alt="Foto do usuário"
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => handleMenuToggle('user')}
          />

          {/* Nome do usuário ao lado da foto */}
          <span className="ml-2 text-sm font-medium">{userName}</span>

          {isUserMenuOpen && (
            <div className="absolute top-12 right-0 bg-white text-black rounded-md shadow-lg w-48 z-10">
              <ul className="space-y-2 p-2">
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Meu Perfil</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Configurações</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Sair</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
