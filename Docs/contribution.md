## Contribuição

A StoreWay API é um projeto de código aberto que evolui graças à comunidade de desenvolvedores que contribuem com novos recursos, correções de bugs e melhorias na documentação. Sua contribuição é fundamental para o crescimento contínuo deste projeto. A seguir, estão as diretrizes para ajudar a garantir que suas contribuições sejam integradas de maneira eficiente e colaborativa.

### 1. Fork do Repositório

Para começar, você precisa fazer um fork do repositório oficial da StoreWay API para o seu perfil do GitHub:

- Acesse o repositório oficial no GitHub.
- No canto superior direito da página, clique no botão **Fork**. Isso criará uma cópia exata do repositório no seu perfil.

### 2. Clonando o Repositório

Após fazer o fork, clone o repositório do seu fork localmente para que você possa começar a trabalhar nas suas alterações:

```bash
git clone https://github.com/seu-usuario/storeway-api.git
```

Este comando clonará o projeto para o seu ambiente de desenvolvimento local.

### 3. Crie uma Branch para Suas Alterações

Para manter as mudanças organizadas e facilitar o processo de revisão, crie uma nova branch com um nome descritivo que indique o que você está desenvolvendo ou corrigindo:

```bash
git checkout -b minha-nova-feature
```

Sugestões para nomeação de branches:

- **feature/nova-funcionalidade**: Para novos recursos.
- **bugfix/corrigir-algo**: Para correções de bugs.
- **docs/atualizar-documentacao**: Para melhorias ou alterações na documentação.

### 4. Faça Suas Alterações

Agora, você pode começar a fazer as modificações no código. Lembre-se de:

- Seguir o estilo de código do projeto. Revise as convenções de código e os arquivos de configuração (como o `eslint`) para garantir que o código esteja consistente com o restante do projeto.
 
- Garantir que qualquer nova funcionalidade seja devidamente testada e, se possível, inclua testes automatizados. Isso ajuda a evitar regressões e mantém a qualidade do código.

- Documentar suas mudanças. Se você adicionar novas funcionalidades, certifique-se de atualizar a documentação relevante para que outros desenvolvedores saibam como utilizar o novo recurso.

### 5. Commit das Alterações

Após finalizar suas alterações, adicione os arquivos modificados ao controle de versão, e faça um commit com uma mensagem clara e descritiva sobre o que foi alterado:

```bash
git add . git commit -m "Descrição clara da alteração realizada"
```

Aqui estão algumas dicas para uma boa mensagem de commit:

- Comece com um verbo no imperativo (ex.: "Corrige", "Adiciona", "Atualiza").
- Seja claro e direto ao ponto, explicando o que foi alterado e, se possível, por que.
- Se necessário, adicione mais detalhes na descrição do commit (ex.: resolvendo uma issue ou adicionando uma funcionalidade específica).
- Traduza os commits para o Inglês para manter o backend padrão

### 6. Envie Suas Alterações para o GitHub

Envie suas alterações para o seu repositório no GitHub (o fork que você fez anteriormente):

```bash
git push origin minha-nova-feature
```

### 7. Abra um Pull Request (PR)

Com suas alterações enviadas para o GitHub, é hora de abrir um Pull Request para o repositório original da StoreWay API. Para isso:

1. Navegue até o seu repositório fork no GitHub.
2. Clique no botão **Compare & pull request**.
3. Verifique se a base branch está configurada para **main**.
4. Preencha o título e a descrição do seu Pull Request. Certifique-se de:
    - Descrever claramente o que foi alterado, adicionado ou corrigido.
    - Incluir o motivo das alterações.
    - Mencionar quaisquer issues que esse PR resolve, utilizando a sintaxe `Closes #numero-da-issue` para que a issue seja fechada automaticamente quando o PR for aceito.
    - Se aplicável, incluir links para documentação ou testes relacionados às suas mudanças.

Exemplo de descrição de Pull Request:
### Descrição
Adiciona a funcionalidade de renovação automática de tokens de autenticação. Isso melhora a experiência do usuário, evitando a necessidade de realizar login novamente quando o token de acesso expira.

### Alterações realizadas
- Adiciona a função `startTokenRenewalTimer` no frontend.
- Atualiza o README.md com a nova documentação sobre o sistema de renovação de tokens.

### Issues relacionadas
Closes #42

### Testes
- Foram realizados testes de integração para garantir que o token de renovação funciona corretamente.


### 8. Aguarde a Revisão

Após abrir o Pull Request, os mantenedores do projeto revisarão suas alterações. Este processo pode incluir feedback sobre o código, sugestões de melhorias ou correções. Esteja preparado para fazer ajustes com base nas revisões.

### 9. Integração da Contribuição

Quando seu Pull Request for aprovado e mesclado na branch principal, você terá contribuído oficialmente para a StoreWay API!

---

## Como Reportar Problemas

Se você encontrar um bug, tiver uma sugestão de melhoria ou encontrar algo que não está funcionando como esperado, sua ajuda em reportar esses problemas é extremamente importante para a evolução do projeto. Para isso:

1. **Abra uma Issue** no repositório do GitHub. Certifique-se de fornecer o máximo de detalhes possíveis, incluindo:
    - Descrição do problema.
    - Passos para reproduzir o erro.
    - Comportamento esperado e comportamento observado.
    - Informações sobre o seu ambiente de desenvolvimento (sistema operacional, versão do Node.js, etc.).

2. **Exemplo de Relatório de Bug**:

    - **Título**: *Erro ao atualizar token de autenticação*.
    - **Descrição**: "Quando o `accessToken` expira, a função de renovação não está sendo chamada corretamente, resultando em um erro 401."

    **Passos para reproduzir**:
    1. Fazer login com um usuário válido.
    2. Aguardar a expiração do `accessToken`.
    3. Verificar que o token de renovação não está sendo enviado automaticamente.

    **Comportamento esperado**: "O `accessToken` deveria ser renovado automaticamente usando o `refreshToken`."

    **Ambiente**:
    - Sistema operacional: Windows 10
    - Versão do Node.js: v14.17.0
    - Navegador: Google Chrome 92.0.4515.131


---

### Agradecimento pela Contribuição

Todas as contribuições, sejam grandes ou pequenas, são altamente apreciadas! A comunidade em torno da StoreWay API depende da participação e do esforço de colaboradores como você para crescer e evoluir. Muito obrigado por ajudar a melhorar este projeto!!

## Considerações Finais

A StoreWay API foi criada com o objetivo de ser uma solução eficiente e escalável para e-commerce, oferecendo flexibilidade para atender a diferentes necessidades do mercado. Agradecemos o interesse e o tempo investido em utilizar, reportar problemas ou contribuir para este projeto.

Nosso compromisso é continuar aprimorando a API com base nas contribuições da comunidade e nas necessidades dos usuários. Se você tiver dúvidas, sugestões ou encontrar algum problema, não hesite em entrar em contato ou abrir uma issue no repositório.

Sua participação é fundamental para que possamos manter este projeto atualizado e em constante evolução. Juntos, podemos construir uma plataforma mais robusta e acessível.

Agradecemos por fazer parte desta jornada!

---
**Equipe StoreWay** (‾◡◝)

Para entrar em contato diretamente, envie um e-mail para: carloseduardorm4@gmail.com

## Sumário

- [Visão Geral](../README.md)
- [Introdução](./introduction.md)
- [Guia de Configurações do Ambiente sem Docker Compose](./enviromentConfig/defaultEnvironmentConfiguration.md) 
- [Guia de Configurações do Ambiente com Docker Compose](./enviromentConfig/configWithDockerCompose.md)
- [Endpoints](./Endpoints.md)
- [Autenticação do Usuário](./authentication.md)
- [Contribuição](#contribuição)
