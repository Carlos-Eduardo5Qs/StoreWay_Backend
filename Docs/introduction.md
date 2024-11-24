# Introdução

Este projeto foi desenvolvido para gerenciar produtos e transações de e-commerce de forma eficiente. Através dele, busquei aprimorar meu conhecimento em desenvolvimento backend, entender fluxos técnicos de sistemas de e-commerce e aplicar novas habilidades com diferentes tecnologias.

### Funcionalidades já implementadas:

- **✔ CRUD de Produtos**: Gerenciamento de produtos, permitindo listar, criar, editar, excluir e atualizar detalhes dos produtos (Somente para administradores).
- **✔ Autenticação de Usuário**: Funcionalidades de criação de conta, login com token JWT e controle de acesso.
- **✔ Sistema de avaliações**: Usuários podem deixar comentários avaliando os produtos, e podem também editar, atualizar ou deletar seus próprios comentários. Além disso, podem adicionar imagens às avaliações.
- **✔ Envio de Emails**: Integração com o Mailtrap para envio de e-mails da API.
- **✔ Armazenamento de Imagens dos Produtos**: Integração do Backblaze para o armazenamento e gerenciamento (CRUD) de imagens dos produtos.

### Funcionalidades a serem desenvolvidas

- [ ] **Sistema de validação de conta**: Implementação de um sistema de validação de conta, onde os usuários devem validar suas contas após o registro.
- [ ] **Sistema de Pedidos**: Implementação do processamento de dados dos carrinhos recebidos do frontend para criar pedidos no backend.
- [ ] **Gateway de Pagamento**: Sistema que gerenciará a comunicação entre a loja e o processador de pagamento.
- [ ] **Integração com a API Melhor envio**: Os usuários poderão ver o valor dos fretes e terão acesso ao rastreamento de entrega de seus pedidos.
- [ ] **Criar Templates de Emails**: Implementação de templates de e-mails personalizados e estilizados, que serão enviados para os usuários.
- [ ] **Dashboard Administrativo**: Criação de uma interface para que administradores possam visualizar e gerenciar produtos, pedidos e usuários.

Este documento fornecerá orientações detalhadas sobre como configurar o ambiente, autenticar usuários, acessar os endpoints da API, e realizar operações como criação, atualização e exclusão de produtos. Além disso, a APi utiliza serviços externos, como o **Mailtrap** para envio de e-mails e o **Backblaze** para armazenar imagens enviadas para o servidor.

## Sumário

- [Visão Geral](../README.md)
- [Introdução](./introduction.md)
- [Configurações de Ambiente sem Docker Compose](./enviromentConfig/defaultEnvironmentConfiguration.md)
- [Configurações de Ambiente com Docker Compose](./enviromentConfig/configWithDockerCompose.md)  
- [Endpoints](./Endpoints.md)
- [Autenticação do Usuário](./authentication.md)
- [Contribuição](./contribution.md)