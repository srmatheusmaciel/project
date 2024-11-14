# Sistema de Gerenciamento de Laboratório de Prótese Dentária

Este projeto é um sistema CRUD desenvolvido com Flask e MongoDB, que permite gerenciar pacientes, funcionários, serviços e relatórios para um laboratório de prótese dentária. Ele registra dados de pacientes e funcionários, permite o acompanhamento dos serviços realizados e gera relatórios periódicos com o valor total recebido e as comissões pagas aos funcionários.

## Estrutura do Projeto

- `app.py`: Arquivo principal da aplicação, contém todas as rotas CRUD para `patients`, `employees`, `services`, `reports` e `users`.
- `docker-compose.yml`: Arquivo de configuração do Docker Compose para iniciar o MongoDB no Docker.
- Banco de Dados: MongoDB configurado para rodar na porta `27017` dentro do Docker.

### Pré-requisitos

- Python 3.12+
- Docker e Docker Compose

### Configuração e Inicialização do Projeto

  1. **Clonar o Repositório**

   ```bash
   git clone https://github.com/srmatheusmaciel/project
   cd project
   ```

  2. **Criar uma Branch para Alterações**

   ```bash
   git checkout -b <nome-da-branch>

   ```
  3. **Configurar o Docker e MongoDB**
   ```bash
 
  docker-compose build
  docker-compose up -d


   ```
  4. **Instalar Dependências do Python**
   ```bash
  pip install -r requirements.txt


   ```
 5. **Iniciar a Aplicação**
   ```bash
  python app.py


   ```

A API estará disponível em [http://localhost:5000](http://localhost:5000).

