# Changelog

Todas as mudanças relevantes deste projeto são registradas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).
Enquanto estiver em 0.x, o app ainda está em desenvolvimento e a API interna pode mudar sem aviso.

## [Não lançado]

## [0.7.0] - 2026-10-17
Fotos menores no envio, limite de tentativas e foto tunada como simulação.

### Adicionado
- As fotos são reduzidas para 1600 px no próprio celular antes do envio. A análise começa mais rápido e gasta bem menos dados móveis; se a redução falhar, a foto original segue normalmente.
- Quando a conferência "fotos x carro" recusa muitas vezes no dia, o app mostra o aviso e mantém a opção "Analisar mesmo assim" (usa 1 crédito).
- Selo "Simulação por IA · ilustrativa" sobre a foto tunada, quando a imagem gerada por IA estiver na tela.

### Alterado
- Mensagens claras quando a análise é limitada (muitas tentativas na última hora) ou quando uma foto é grande demais. Nenhum crédito é usado nesses casos.

### Removido
- Seção "Sugestões para você" da Home, que mostrava dados de exemplo fixos.
- Tela de exemplo `explore` que veio do template do Expo.

### Corrigido
- O cronograma do resultado não quebra mais quando a IA não manda as fases.
- Tipos dos cards do resultado (`tsc` sem erros).

### Segurança
- Logs com o texto do usuário e a resposta da IA só aparecem em desenvolvimento, não no app instalado.

## [0.6.0] - 2026-10-12
Exclusão de conta e fotos privadas.

### Adicionado
- Excluir conta, no fim da tela de Perfil. A tela mostra o que será apagado e o que fica guardado, avisa sobre análises não usadas, pede para digitar EXCLUIR e para entrar com o Google mais uma vez antes de apagar.

### Removido
- Permissões de microfone e de leitor de código de barras, que o app não usa.
- Biblioteca do Firestore, que não era usada.

### Segurança
- A exclusão apaga fotos, carros, saldo e o login (com o celular vinculado). Ficam só o histórico de compras e o código cifrado do celular, como diz a Política de Privacidade.
- A API só exclui a conta com um login de poucos minutos atrás.
- Fotos novas ficam numa pasta do próprio usuário e só abrem pelo link com token que a API devolve.

## [0.5.0] - 2026-10-11
Compra de análises pela Google Play (RevenueCat).

### Adicionado
- Compra de análises pela Google Play, com pacotes de 1, 5 e 15 créditos. A tela mostra o preço da loja e quanto sai cada análise, com destaque para o pacote de 5.
- A tela de compra abre pelo selo de créditos da Home e pelo alerta de "Sem créditos" na análise.
- Depois do pagamento, o app espera o servidor confirmar e mostra o saldo novo. Se demorar, avisa que os créditos estão a caminho; pagamento pendente na Google Play também tem aviso próprio.
- Testes automáticos (Jest) para as regras da compra.

### Segurança
- Os créditos comprados são liberados só pelo servidor, depois que o RevenueCat confirma o pagamento. O app nunca soma créditos por conta própria.
- A compra fica sempre ligada à conta logada (UID do Firebase), conferida antes de abrir a loja, e um toque duplo não gera duas cobranças.

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
