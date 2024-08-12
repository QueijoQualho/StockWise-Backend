# StockWise

StockWise é um sistema para realizar o inventario do SENAI Ricardo Lerner de maneira mais facilitada

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Docker**: Plataforma para criar, implantar e executar aplicativos em contêineres.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.

## Pré-requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) 

## Configuração do Ambiente de Desenvolvimento

1. **Clone o Repositório**

    ```bash
    git clone https://github.com/QueijoQualho/TCC-Senai.git
    cd seu-repositorio
    ```

2. **Instale as Dependências**

    ```bash
    npm install
    ```

3. **Configure o Docker**

    O Docker deve estar configurado para rodar a aplicação e o PostgreSQL. Verifique o arquivo Dockerfile e docker-compose.yml para personalizações necessárias.

4. **Build e run Docker**

    Para Buildar o Docker e rodar o contêiner Docker:

    ```bash
    docker-compose up --build
    ```

    Isso irá construir a imagem Docker, iniciar o contêiner da aplicação e configurar o banco de dados PostgreSQL.

# Diagramas
## Diagrama de Classes
  ![Diagrama de Classes](https://github.com/user-attachments/assets/262d00be-0bff-4b13-924d-1f577936b24e)

## Caso de Uso
  ![Caso de Uso](https://github.com/user-attachments/assets/e53533be-2f66-49b2-a02c-d0fd6d650077)
