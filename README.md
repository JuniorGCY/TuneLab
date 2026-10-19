# TuneLab

O TuneLab é um aplicativo mobile multiplataforma construida para entusiastas automotivos, permitindo a gestão de veículos e futuras gerações de projetos de tuning com ajuda da Mia, sua assistente IA.

## 🛠️ Tecnologias Utilizadas

O ecossistema do TuneLab é dividido em duas frentes principais:

* **Backend (API):** Desenvolvido em **Go (Golang)**, utilizando rotas nativas, conexão segura com banco de dados e arquitetura leve de alta performance.
* **Frontend (Mobile):** Desenvolvido em **React Native** com **Expo**, focado em performance nativa e experiência de usuário fluida.
* **Autenticação & Segurança:** **Firebase Auth** para gestão de identidade com tokens JWT validados diretamente no backend.
* **Banco de Dados & Nuvem:** **PostgreSQL** hospedado no **Neon** e infraestrutura de servidores em nuvem no **Railway**.


## 🏗️ Arquitetura do Sistema
[ App React Native (Expo) ]
├──> 1. Autenticação (Firebase SDK) -> Gera Token JWT
└──> 2. Requisições HTTP (com Header Bearer Token)
│
▼
[ API Go (Railway) ]
├──> Valida Token (Firebase Admin SDK)
│
▼
[ Banco de Dados (Neon PostgreSQL) ]

## Configuração e Execução Local

Siga os passos abaixo para rodar o projeto em sua máquina para fins de desenvolvimento.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/JuniorGCY/TuneLab.gitt](https://github.com/JuniorGCY/TuneLab.git)
cd tunelab

### 2. Configurar o Backend (Go)
1. Navegue até a pasta da API.
2. Crie um arquivo .env na raiz do backend contendo:
   DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host.neon.tech/neondb?sslmode=require
   FIREBASE_CREDENTIALS={"type": "service_account", ...} # JSON minificado das chaves de serviço do Firebase

3. Execute o servidor: go run main.go

### 3. Configurar o Frontend (React Native)
1. Na raiz do projeto mobile, crie um arquivo .env:
EXPO_PUBLIC_API_URL=http://localhost:8080 # ou o IP da sua rede local para testes no celular

2. Instale as dependências e inicie o Expo:
npm install
npx expo start --clear

```

