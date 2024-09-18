## Endpoints

Nesta seção, você encontrará uma descrição completa dos endpoints disponíveis na API, tanto para acesso público quanto para acesso privado. Cada endpoint é apresentado com detalhes sobre como utilizá-lo, os parâmetros necessários e o formato da resposta.

### Endpoints Públicos

Os **endpoints públicos** são acessíveis sem a necessidade de autenticação. Eles permitem que qualquer usuário interaja com funcionalidades básicas da aplicação. Nesta seção, você encontrará rotas para criar uma conta de usuário, autenticar usuários, listar todos os produtos e buscar produtos por categoria.

- **`POST /users/create-account`**
    - **Descrição:** Cria uma nova conta de usuário.
    - **Corpo da Solicitação:** `name`, `email`, `password`, `confirmPassword`.
    - **Resposta:** Detalhes da conta criada ou mensagem de erro.

- **`POST /users/auth`**
    - **Descrição:** Autentica um usuário existente e gera um token de acesso.
    - **Corpo da Solicitação:** `email`, `password`.
    - **Resposta:** Token de acesso e refresh token ou mensagem de erro.

- **`GET /products`**
    - **Descrição:** Lista todos os produtos disponíveis.
    - **Resposta:** Lista de produtos com detalhes.

- **`GET /products/category/:category`**
    - **Descrição:** Lista produtos filtrados por categoria.
    - **Parâmetros da URL:** `category` (nome da categoria).
    - **Resposta:** Lista de produtos na categoria especificada
### Endpoints Privados

Os **endpoints privados** requerem autenticação e autorização para acesso. Esses endpoints são protegidos e só podem ser utilizados por usuários autenticados ou com permissões específicas. Aqui você encontrará rotas para operações que envolvem a criação, atualização e exclusão de produtos, bem como a gestão de avaliações e tokens de acesso.

- **`POST /token/refresh`**
    - **Descrição:** Renova o token de acesso utilizando um refresh token.
    - **Corpo da Solicitação:** `refreshToken`.
    - **Resposta:** Novo token de acesso ou mensagem de erro.

- **`POST /products/create`**
    - **Descrição:** Adiciona um novo produto ao catálogo.
    - **Corpo da Solicitação:** `name`, `description`, `price`, `category`, `brand`, `stock`.
    - **Resposta:** Detalhes do produto criado ou mensagem de erro.

- **`PUT /products/update`**
    - **Descrição:** Atualiza as informações de um produto existente.
    - **Corpo da Solicitação:** `name`, `description`, `price`, `category`, `brand`, `stock`.
    - **Resposta:** Detalhes do produto atualizado ou mensagem de erro.

- **`DELETE /products/delete/:id`**
    - **Descrição:** Remove um produto do catálogo pelo ID.
    - **Parâmetros da URL:** `id` (ID do produto).
    - **Resposta:** Confirmação de deleção ou mensagem de erro.

- **`POST /products/assessment`**
    - **Descrição:** Cria uma avaliação para um produto.
    - **Corpo da Solicitação:** `productID`, `userId`, `text`, `stars`.
    - **Resposta:** Detalhes da avaliação criada ou mensagem de erro.

- **`POST /products/assessment/addPhoto`**
    - **Descrição:** Adiciona uma foto a uma avaliação existente.
    - **Corpo da Solicitação:** `assessmentId`, `file` (imagem).
    - **Resposta:** Confirmação de adição da foto ou mensagem de erro.
## Exemplos de solicitação

Abaixo, são fornecidos exemplos de como fazer solicitações para cada endpoint disponível.

### Criar uma conta de usuário

Para criar uma conta de usuário, faça uma solicitação POST para o endpoint `/users/create-account`, incluindo os seguintes parâmetros no corpo da solicitação:

- `name` (string): O nome do usuário.
- `email` (string): O email do usuário.
- `password` (string): A senha do usuário.
- `confirmPasword` (string) A confirmação da senha do usuário.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function createUserAccount(name, email, password, confirmPassword) {
  try {
    const response = await fetch('http://localhost:3000/users/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error creating user account:', error);
  }
}
```

### Autenticar um usuário

Para autenticar um usuário, faça uma solicitação POST para o endpoint `/users/auth`, incluindo os seguintes parâmetros no corpo da solicitação:

- `email` (string) O email de acesso do usuário.
- `password` (string) A senha de acesso do usuário.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function authenticateUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error authenticating user:', error);
  }
}
```

### Renovar tokens de acesso

Para renovar tokens de acesso, faça uma solicitação POST para o endpoint `/token/refresh`, incluindo os seguintes parâmetro no corpo da requisição:

- `refreshToken` (string) O token de renovação do usuário.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function renewToken(refreshToken) {
  try {
    const response = await fetch('http://localhost:3000/token/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error renewing access tokens:', error);
  }
}
```

### Criar um produto

Para criar um produto, faça uma solicitação POST para o endpoint `/products/create`, incluindo os seguintes parâmetros  no corpo da requisição:

- `name` (string) Nome do produto.
- `file` (file) imagem do produto.
- `description` (string) Descrição do produto.
- `price` (string) Preço para o produto.
- `category` (string) Categoria do produto.
- `brand` (string) Marca do produto.
- `stock` (string) Estoque do produto.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function createProduct(name, file, description, price, category, brand, stock) {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('stock', stock);

    const response = await fetch('http://localhost:3000/products/create', {
      method: 'POST',
      headers: {
        'authorization': 'Seu token de autorização aqui',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
  }
}
```

### Atualizar um produto

Para atualizar um produto, faça uma solicitação PUT para o endpoint `/products/update`, incluindo os seguintes parâmetros  no corpo da requisição:

- `name` (string) Nome do produto.
- `description` (string) Descrição do produto.
- `price` (string) Preço para o produto.
- `category` (string) Categoria do produto.
- `brand` (string) Marca do produto.
- `stock` (string) Estoque do produto.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function updateProduct(id, name, description, price, category, brand, stock) {
  try {
    const response = await fetch(`http://localhost:3000/products/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Seu token de autorização aqui',
      },
      body: JSON.stringify({ name, description, price, category, brand, stock })
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
  }
}
```

### Deletar um produto

Para deletar um produto, faça uma solicitação DELETE para o endpoint `/products/delete/:id`, incluindo os seguintes parâmetros na url:

- `id` (string) ID do produto à ser deletado.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/products/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Seu token de autorização aqui',
      },
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}
```

### Listar todos os produtos

Para listar todos os produtos, faça uma solicitação GET para o endpoint `/products`:

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function listAllProducts() {
  try {
    const response = await fetch('http://localhost:3000/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error listing all products:', error);
  }
}
```

### Listar produtos por categoria

Para listar produtos por categoria, faça uma solicitação GET para o endpoint `/products/category/:category`, incluindo os seguintes parâmetros na url:

- `category` (string) Nome da categoria à ser listada.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function listProductsByCategory(category) {
  try {
    const response = await fetch(`http://localhost:3000/products/category/${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}
```

### Criar avaliação para um produto

Para criar uma avaliação para um produto, faça uma solicitação POST para o endpoint `/products/assessment`, incluindo os seguintes parâmetros no corpo da requisição:

!productId || !userId || !text || !stars

- `productID` (string) ID do produto a ser avaliado.
- `userId` (string) ID do usuário que está avaliando o produto.
- `text` (string) Comentário que o usuário.
- `stars` (string) estrelas que o usuário está dando ao produto.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function createAssessment(productID, userId, text, stars) {
  try {
    const response = await fetch('http://localhost:3000/products/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Seu token de autorização aqui',
      },
      body: JSON.stringify({ productID, userId, text, stars, }),
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error creating assessment:', error);
  }
}
```

### adicionando imagens á avaliações

Para adicionar imagens á avaliações, faça uma solicitação POST para o endpoint `/products/assessment/addPhoto`, incluindo os seguintes parâmetros no corpo da requisição:

- `avaliationId` (string) ID da avaliação.
- `file` (file) imagem que será adicinada na avaliação.

Exemplo de solicitação usando `fetchAPI`:

```javascript
async function addPhotoToAssessment(assessmentId, file) {
  try {
    const formData = new FormData();
    formData.append('assessmentId', assessmentId);
    formData.append('file', file);

    const response = await fetch('http://localhost:3000/products/assessment/addPhoto', {
      method: 'POST',
      headers: {
        'authorization': 'Seu token de autorização aqui',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error adding image to assessment:', error);
  }
}
```

Os endpoints descritos acima formam a base para interagir com a API do Backshophub, permitindo criar, atualizar, deletar e consultar produtos, bem como gerenciar usuários e avaliações. Com esses endpoints, você pode integrar funcionalidades essenciais em suas aplicações e garantir uma experiência completa para os usuários.

Se você precisar de mais detalhes sobre como utilizar esses endpoints, encontrar algum problema ou tiver dúvidas, não hesite em entrar em contato. Você pode me alcançar através das seguintes opções:

- **E-mail:** carloseduardorm4@gmail.com
- **GitHub:** [Carlos-Eduardo5Qs]([Carlos-Eduardo5Qs (Carlos Eduardo) (github.com)](https://github.com/Carlos-Eduardo5Qs))
- **Issues:** Abra uma issue
## Sumário

- [Visão Geral](../../README.md)
- [Introdução](../introduction.md)
- [Guia de Configurações do Ambiente sem Docker Compose](../enviromentConfig/defaultEnvironmentConfiguration.md) 
- [Guia de Configurações do Ambiente com Docker Compose](../enviromentConfig/configWithDockerCompose.md)
- [Endpoints](#endpoints)
- [Autenticação do Usuário](./authentication.md)
- [Contribuição](./contribution.md)
