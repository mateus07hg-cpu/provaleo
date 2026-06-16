# Sistema de Controle de Almoxarifado

## Descrição

Este projeto foi desenvolvido para auxiliar no controle de materiais de um almoxarifado, permitindo o cadastro, consulta, atualização e exclusão de itens em estoque.

A aplicação utiliza uma API MockAPI para armazenar os dados e simular operações reais de um sistema de gerenciamento de estoque.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- MockAPI
- Git e GitHub

## Funcionalidades

### Cadastro de Materiais
Permite cadastrar novos materiais informando:
- Nome
- Categoria
- Quantidade em estoque

### Listagem de Materiais
Exibe todos os materiais cadastrados na API.

### Busca de Materiais
Permite localizar materiais cadastrados através da pesquisa.

### Baixa de Estoque
Permite retirar uma quantidade do estoque de um material.

### Exclusão de Materiais
Permite remover materiais do sistema.

### Dashboard
Apresenta informações gerais sobre os materiais cadastrados.

## Regras de Negócio

### Validação de Retirada

A função:

```javascript
function validarRetirada(estoqueAtual, quantidadeRetirada)

Projeto atualizado em 16/06/2026.git status