# Changelog

Todas as mudanças relevantes deste projeto são registradas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).
Enquanto estiver em 0.x, o app ainda está em desenvolvimento e a API interna pode mudar sem aviso.

## [Não lançado]
- Mudanças em andamento antes de fechar uma nova versão.

## [0.4.0] - 2026-10-09
Login com Google e análise grátis por celular verificado.

### Adicionado
- Login com Google. Sair do app também sai da conta Google, para o próximo login perguntar qual conta usar.
- Análise grátis: ao confirmar o celular por SMS, a conta ganha 1 análise. O convite aparece como banner na Home.
- Tela de confirmação do celular, com máscara de número, código de 6 dígitos, reenvio após 60 segundos e opção de trocar o número.
- Quando faltam créditos na análise, o alerta leva direto para a tela de liberar a análise grátis.

### Alterado
- Conta nova começa com 0 créditos; a análise grátis vem do celular verificado.
- Mensagens de erro de login e de SMS traduzidas para o usuário (código errado, código expirado, muitas tentativas, celular já usado em outra conta, entre outras).

### Removido
- Cadastro e login por e-mail e senha.

### Segurança
- Cada celular libera a análise grátis uma única vez, mesmo em contas diferentes ou depois de apagar a conta.
- O número do celular não é guardado no banco: a API guarda só um código protegido por segredo (HMAC), que serve para saber se o número já foi usado.
- O celular, o nome e o e-mail gravados pela API vêm do token do Firebase, nunca do que o app envia. Contas sem e-mail verificado não são sincronizadas.

## [0.3.0] - 2026-10-07
Análise do carro por IA, de ponta a ponta.

### Adicionado
- Análise por IA: o usuário envia até 4 fotos (frente, lateral, traseira e motor), informa o carro e o objetivo, e recebe um setup com peças de performance, itens visuais, custo estimado, potência e uma linha do tempo de instalação.
- Campo opcional "Qual é o seu carro?" (marca, modelo e ano), que deixa as sugestões mais precisas.
- País do usuário lido do idioma do aparelho, para a IA considerar peças e preços do mercado local.
- Tela de resultado com as abas Performance, Visual e Setup Completo, e aviso de que peças, preços e ganhos são estimativas.
- Salvar o setup na garagem, com edição e exclusão dos carros salvos.
- Créditos de análise: selo com o saldo na Home e botão para atualizar a garagem e os créditos.
- Aviso quando as fotos parecem ser de outro carro, com as opções "Corrigir" e "Analisar mesmo assim".
- Tela de carregamento durante a análise.

### Alterado
- A IA passou a usar busca na web para fundamentar peças, preços e o motor da versão vendida no país do dono.
- Títulos e textos de ganho do setup ficaram padronizados (ex: "+5 hp · Resposta mais rápida do acelerador").
- Ao salvar um setup na garagem, o formulário de análise é limpo e o app volta para a Home.

### Corrigido
- Uma análise podia reaproveitar as fotos e o nome do carro da análise anterior.
- Somas de potência e custo que não batiam com os itens do setup.
- Ganhos de potência exagerados ou atribuídos a itens de manutenção (velas, filtros, fluidos).
- Motor e potência original errados quando o modelo usa outro motor no Brasil (ex: BMW 320i 2010).

### Segurança
- O crédito é reservado antes da análise e devolvido se ela falhar, o que impede usar o mesmo crédito em análises simultâneas.
- As fotos no Storage não podem mais ser listadas nem enviadas diretamente pelo app; só a API grava.
- O texto digitado pelo usuário é limpo antes de chegar à IA.

## [0.2.0] - 2026-08-28
### Adicionado
- Fontes Montserrat, para melhor legibilidade.
- Telas de cadastro, login, Home e perfil com interface provisória.
- Autenticação por e-mail e senha com o Firebase Auth.
- Firebase Storage, para guardar imagens no futuro.
- Biblioteca de ícones Lucide React Native.
- Foto do carro: o usuário tira uma foto, adiciona uma descrição e a mantém salva na conta para análises futuras.

### Alterado
- Interface das telas de login, cadastro, Home e perfil melhorada, fiel ao design proposto.
- Cores e fontes organizadas em uma pasta, com arquivos separados.

### Corrigido
- Fontes Montserrat que não eram exibidas corretamente.
- Erros de cadastro e login que ficavam escondidos agora aparecem para o usuário.

### Segurança
- Autenticação segura com JSON Web Tokens (JWT).

## [0.1.0] - 2026-08-18
### Adicionado
- Estrutura inicial do projeto.
- Telas de cadastro, login, Home e perfil com interface provisória.
- Navegação entre telas.
