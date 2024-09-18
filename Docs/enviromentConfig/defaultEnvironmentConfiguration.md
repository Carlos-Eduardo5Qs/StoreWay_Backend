## Configurando o Projeto StoreWay sem Docker Compose

Antes de iniciar o projeto, siga as instruções abaixo para configurar o ambiente.

### 1. Clone o projeto em sua máquina

```bash
  git clone https://github.com/Carlos-Eduardo5Qs/StoreWay_Backend.git
```

### 2. Criar uma conta no Mailtrap

A StoreWay APi utiliza o serviço Mailtrap para testar o envio de e-mails. Siga as etapas abaixo para criar uma conta no Mailtrap:

- Acesse [Mailtrap](https://mailtrap.io/).
- Crie uma conta gratuitamente.
- Após o login, crie uma nova inbox.

Anote as seguintes informações do seu inbox no Mailtrap:

- `MAIL_HOST`: Endereço do servidor SMTP.
- `MAIL_PORT`: Porta do servidor SMTP.
- `MAIL_USER`: Nome de usuário para autenticação no servidor SMTP.
- `MAIL_PASS`: Senha para autenticação no servidor SMTP.

Lembre-se de atualizar as configurações do .env com as informações do seu inbox Mailtrap.

### 3. Criar uma conta na Backblaze

A StoreWay API utiliza o serviço Backblaze para armazenar imagens dos usuários e de produtos. Siga as etapas abaixo para criar uma conta na Backblaze:

- Acesse o site da [Backblaze](https://www.backblaze.com/).
- Clique em "Get Started" para criar uma nova conta.
- Na opção  `B2 Cloud Storage` clique em `Try for Free`.
- Preencha as informações necessárias e siga as instruções para verificar sua conta.
- Faça login na sua conta da Backblaze.
- No painel, vá para "Buckets" e clique em "Create a Bucket".
- Siga as instruções para configurar seu novo bucket.

Anote as seguintes informações do seu Bucket:

- `BUCKET_ID`: Id do bucket.
- `BUCKET_NAME`: Nome do Bucket.
- `APP_KEY`: Chave de aplicação.
- `KEY_ID`: Id da chave de aplicação.

Lembre-se de atualizar as configurações do .env com as informações do seu Bucket.

### 4. Configuração do Banco de Dados (MySQL)

Para utilizar o **StoreWay**, você precisa configurar um banco de dados MySQL localmente. Siga os passos abaixo para configurar o MySQL no seu sistema:

#### 4.1. Instalação do MySQL

1. **Download e instalação do MySQL**:

   - Acesse [MySQL Downloads](https://dev.mysql.com/downloads/mysql/) e baixe a versão apropriada para o seu sistema operacional (Windows, macOS ou Linux).
   - Siga as instruções de instalação fornecidas no site ou use o gerenciador de pacotes para Linux, como `apt` ou `yum`:
     - Para **Debian/Ubuntu**:
       ```bash
       sudo apt update
       sudo apt install mysql-server
       ```
     - Para **RedHat/CentOS**:
       ```bash
       sudo yum install mysql-server
       ```

2. **Inicie o MySQL**:
   - Após a instalação, inicie o serviço MySQL com o comando:
     - Para **Debian/Ubuntu**:
       ```bash
       sudo systemctl start mysql
       ```
     - Para **RedHat/CentOS**:
       ```bash
       sudo systemctl start mysqld
       ```

3. **Acessando o MySQL**:
   - Após iniciar o serviço, acesse o MySQL com o usuário root:
     ```bash
     sudo mysql -u root -p
     ```

#### 4.2. Configuração do Banco de Dados

1. **Criando o Banco de Dados e Usuário**:
   - Após entrar no MySQL, crie um banco de dados para o **StoreWay**:
     ```sql
     CREATE DATABASE storeway_db;
     ```
   - Crie um usuário com permissões adequadas e defina uma senha:
     ```sql
     CREATE USER 'storeway_user'@'localhost' IDENTIFIED BY 'minhasenha';
     GRANT ALL PRIVILEGES ON storeway_db.* TO 'storeway_user'@'localhost';
     FLUSH PRIVILEGES;
     ```

2. **Configurações no projeto**:
   - No seu arquivo de configuração da aplicação (como o `.env` ou `config.js`), defina as variáveis de ambiente para conectar ao banco de dados:
     ```bash
     DB_HOST=localhost
     DB_USER=storeway_user
     DB_PASSWORD=minhasenha
     DB_NAME=storeway_db
     DB_PORT=3306
     ```

3. **Testando a Conexão**:
   - Certifique-se de que sua aplicação pode se conectar ao MySQL utilizando as credenciais configuradas. Caso encontre problemas de conexão, verifique se o MySQL está rodando e se o firewall está configurado para permitir conexões na porta 3306.


### Executar o script SQL para criar as tabelas

Após configurar o MySQL, você precisará executar o script SQL fornecido para criar as tabelas necessárias para a aplicação.

- Abra o arquivo `script.sql` localizado na pasta `database`.
- Copie todo o conteúdo do arquivo `script.sql`.`
- Abra o terminal ou cliente MySQL e conecte-se ao seu servidor MySQL.
- Cole o conteúdo do arquivo `script.sql` no terminal ou cliente MySQL e execute-o.

Isso criará as tabelas e definirá a estrutura necessária para o banco de dados da aplicação.

Lembre-se de que este script SQL cria a estrutura do banco de dados e suas tabelas, portanto, deve ser executado apenas uma vez, preferencialmente durante a configuração inicial do ambiente de desenvolvimento.

Após seguir estas etapas, seu banco de dados estará configurado e pronto para ser usado com a aplicação. Certifique-se de atualizar as configurações do arquivo `.env` com as informações do seu banco de dados MySQL, conforme mencionado anteriormente.

### 5. Configuração do Arquivo `.env`

Crie um arquivo .env na raiz do projeto e preencha as variáveis de ambiente com as informações do Mailtrap e do banco de dados:

```ini
# porta em que o servidor será executado
SERVER_PORT=3000

# Configurações do Banco de Dados
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

# Configurações do inbox Mailtrap
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM= # Email remetente

# Senha para assinar e verificar tokens JWT
SECRET_KEY=

# Configurações da Backblaze B2
BUCKET_ID=
BUCKET_NAME=
APP_KEY=
KEY_ID=
```

Preencha as variáveis acima de acordo com os dados do seu inbox no Mailtrap, do seu banco de dados e do seu Bucket da sua conta Backblaze. Configure uma senha para assinar e verificar tokens JWT em **SECRET_KEY** (Pode ser qualquer senha da sua preferência, mas eu recomendo que seja uma senha forte).

### Executar o servidor de desenvolvimento

Após configurar o ambiente e o banco de dados, você pode iniciar o servidor de desenvolvimento. Certifique-se de estar na raiz do projeto e execute o seguinte comando:

```bash
npm run dev
```

Isso iniciará o servidor de desenvolvimento na porta especificada no arquivo .env e estará pronto para aceitar conexões.

## Sumário

- [Visão Geral](../../README.md)
- [Introdução](../introduction.md)
- [Guia de Configurações do Ambiente sem Docker Compose](defaultEnvironmentConfiguration.md)
- [Guia de Configurações do Ambiente com Docker Compose](../enviromentConfig/configWithDockerCompose.md)  
- [Endpoints](../Endpoints.md)
- [Autenticação do Usuário](../authentication.md)
- [Contribuição](../contribution.md)
