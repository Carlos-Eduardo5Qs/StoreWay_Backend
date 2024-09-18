## Autenticação

### 1. Autenticar

Autentica um usuário e retorna dois tokens: um para acesso (`accessToken`) e outro para renovação (`refreshToken`).

- **Endpoint:**  
    `POST http://localhost:3000/users/auth`
    
- **Parâmetros da Requisição:**
    - `email` (string): Email do usuário.
    - `password` (string): Senha do usuário.

- **Resposta de Sucesso (Status 200 OK):**
    ```json
    {
      "data": {
        "accessToken": "token_de_acesso",
        "refreshToken": "token_de_renovacao"
      }
    }
    ```

Após o login bem-sucedido, os tokens devem ser armazenados no `localStorage` do navegador para uso posterior nas requisições e renovação automática.

---

### 2. Renovação de Tokens

Renova o token de acesso (`accessToken`) e o token de renovação (`refreshToken`) usando o `refreshToken`.

- **Endpoint:**  
    `POST http://localhost:3000/token/refresh`

- **Parâmetros da Requisição:**
    - `refreshToken` (string): Token de renovação obtido na autenticação inicial.

- **Resposta de Sucesso (Status 200 OK):**
    ```json
    {
      "data": {
        "newAccessToken": "novo_token_de_acesso",
        "newRefreshToken": "novo_token_de_renovacao"
      }
    }
    ```

Os novos tokens devem substituir os antigos no `localStorage`, garantindo que o acesso à API continue sem interrupções.

---

### 3. Gerenciamento de Tokens no Frontend

1. **Armazenamento dos Tokens no Login:**

    Ao receber os tokens `accessToken` e `refreshToken` após o login, ambos devem ser armazenados no `localStorage` do navegador. Isso garante que os tokens estejam disponíveis para autenticação em rotas privadas e para a renovação automática dos tokens.
    
    Exemplo de como armazenar os tokens:
    ```javascript
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    ```

2. **Renovação Automática de Tokens:**

    Para evitar que o usuário seja desconectado quando o `accessToken` expirar, é importante configurar um sistema de renovação automática.
    
    A lógica consiste em verificar periodicamente o tempo de expiração do `accessToken` e, se ele estiver prestes a expirar, usar o `refreshToken` para obter novos tokens.

    **Passos:**
    
    - **Decodificar o `accessToken`** para extrair o tempo de expiração (usando bibliotecas como `jwt-decode` ou manualmente).
    - **Iniciar um temporizador** que executa a renovação dos tokens um pouco antes do `accessToken` expirar.
    - **Enviar o `refreshToken`** para o endpoint de renovação e, caso seja bem-sucedido, atualizar os tokens no `localStorage`.

    Exemplo básico de implementação:
    ```javascript
    // Função que inicia o temporizador de renovação
    function startTokenRenewalTimer() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
    
      // Verifique se os tokens estão disponíveis
      if (!accessToken || !refreshToken) return;
    
      // Decodifique o token para obter o tempo de expiração
      const decodedToken = parseJwt(accessToken);
      const expirationTime = decodedToken.exp * 1000; // Tempo de expiração em milissegundos
      const currentTime = Date.now();
    
      // Calcule o tempo restante até o token expirar
      const timeUntilExpiration = expirationTime - currentTime;
      const renewalTime = timeUntilExpiration - 60000; // Renova 1 minuto antes de expirar
    
      if (renewalTime > 0) {
        setTimeout(() => {
          renewTokens(refreshToken);
        }, renewalTime);
      } else {
        renewTokens(refreshToken);
      }
    }
    
    // Função que faz a requisição para renovar os tokens
    function renewTokens(refreshToken) {
      fetch('http://localhost:3000/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })
      .then(response => response.json())
      .then(data => {
        if (data.newAccessToken && data.newRefreshToken) {
          localStorage.setItem('accessToken', data.newAccessToken);
          localStorage.setItem('refreshToken', data.newRefreshToken);
    
          // Reinicia o temporizador de renovação
          startTokenRenewalTimer();
        }
      })
      .catch(error => console.error('Erro ao renovar tokens:', error));
    }
    
    // Inicializar a renovação dos tokens logo após o login ou ao carregar a página
    startTokenRenewalTimer();
    ```

---

### 4. Requisições em Rotas Privadas:

Para acessar rotas privadas que requerem autenticação, o `accessToken` deve ser incluído no cabeçalho de cada requisição HTTP.

Exemplo de como adicionar o token no cabeçalho:
```javascript
fetch('http://localhost:3000/private-route', {
  method: 'GET',
  headers: {
    'Authorization': `${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro na requisição:', error));
```


O `accessToken` tem um tempo de vida limitado, enquanto o `refreshToken` geralmente tem uma duração mais longa. A renovação do token de acesso garante que o usuário permaneça autenticado sem precisar realizar login repetidamente.

Certifique-se de que os tokens armazenados no navegador sejam protegidos e, se possível, utilize uma política de expiração curta para o `accessToken` junto com a renovação automática.
## Sumário

- [Visão Geral](../../README.md)
- [Introdução](./introduction.md)
- [Guia de Configurações do Ambiente sem Docker Compose](../enviromentConfig/defaultEnvironmentConfiguration.md) 
- [Guia de Configurações do Ambiente com Docker Compose](../enviromentConfig/configWithDockerCompose.md)
- [Endpoints](./Endpoints)
- [Autenticação do Usuário](./authentication)
- [Contribuição](./contribution.md)