# PRD - Depois que eu acordei

## 1. Visão geral

**Depois que eu acordei** é um blog pessoal para registrar e compartilhar experiências internas. Os relatos podem partir de sonhos, desejos, impulsos, conflitos, escolhas ou superações. Cada publicação combina uma imagem, um título e uma descrição para transformar essas vivências em uma experiência visual e narrativa.

O nome representa o momento de clareza que vem depois de uma experiência, e não apenas o despertar do sono. O produto deve transmitir uma atmosfera íntima, honesta e contemplativa, como se o visitante estivesse entrando em fragmentos da vida interior do autor.

## 2. Objetivo

Criar um diário público no qual o autor possa publicar relatos pessoais com facilidade e qualquer visitante possa lê-los sem precisar criar uma conta.

### Objetivos do MVP

- Permitir que o autor publique, edite e exclua relatos por um painel privado.
- Exibir publicamente os relatos em ordem do mais recente para o mais antigo.
- Acolher temas diversos sem limitar o conteúdo a sonhos.
- Valorizar a imagem e a narrativa de cada relato.
- Oferecer uma experiência responsiva, acessível e imersiva.

### Fora do escopo do MVP

- Cadastro de leitores.
- Publicação por outras pessoas.
- Comentários, curtidas ou compartilhamento interno.
- Categorias, tags e busca.
- Newsletter.
- Aplicativo para celular.

## 3. Público-alvo

- Pessoas interessadas em experiências humanas, autoconhecimento, memória e escrita pessoal.
- Visitantes que procuram uma experiência de leitura curta e contemplativa.
- Amigos, conhecidos e seguidores do autor.

## 4. Proposta de valor

Um espaço autoral para narrar o que acontece por dentro: uma imagem para ambientar, um título para provocar e um texto para elaborar sonhos, desejos, tentações, escolhas e mudanças. O foco não é oferecer respostas prontas, mas transformar experiências íntimas em relatos honestos.

## 5. Estrutura do conteúdo

Cada relato deve possuir:

| Campo | Obrigatório | Regras |
| --- | --- | --- |
| Foto | Sim | Uma imagem em JPG, PNG ou WebP, com texto alternativo para acessibilidade. |
| Título | Sim | Entre 3 e 100 caracteres. |
| Descrição | Sim | Texto do relato, com suporte a parágrafos e negrito usando `*texto*`, entre 10 e 10.000 caracteres. |
| Data de publicação | Automática | Definida quando o relato for publicado. |
| Status | Sim | Rascunho ou publicado. |

## 6. Experiência do usuário

### 6.1 Página inicial

A página inicial apresenta:

- Nome do blog e uma breve frase de apresentação.
- Lista de relatos publicados, do mais recente para o mais antigo.
- Cards com foto, título, trecho da descrição e data de publicação.
- Acesso para a página completa de cada relato.
- Estado vazio apropriado caso ainda não existam relatos publicados.

### 6.2 Página do relato

A página individual apresenta:

- Foto em destaque.
- Título do relato.
- Data de publicação.
- Descrição completa, preservando parágrafos.
- Link para retornar à página inicial.
- Metadados adequados para compartilhamento em redes sociais.

### 6.3 Painel administrativo

O painel é privado e acessível apenas pelo autor. Ele deve permitir:

- Entrar e sair com segurança.
- Visualizar todos os relatos, incluindo rascunhos.
- Criar um relato preenchendo foto, título, descrição e status.
- Pré-visualizar a foto antes da publicação.
- Editar um relato existente.
- Publicar um rascunho.
- Excluir um relato mediante confirmação.
- Visualizar mensagens claras de sucesso e erro.

## 7. Fluxos principais

### Visitante lê um relato

1. O visitante acessa a página inicial.
2. Visualiza os relatos publicados em ordem cronológica.
3. Seleciona um relato pelo card.
4. Lê a publicação completa.
5. Retorna à página inicial para explorar outros relatos.

### Autor publica um relato

1. O autor acessa a página de login.
2. Informa suas credenciais.
3. Entra no painel e inicia uma nova publicação.
4. Adiciona foto, texto alternativo, título e descrição.
5. Salva como rascunho ou publica imediatamente.
6. Ao publicar, o relato passa a aparecer na página inicial.

## 8. Requisitos funcionais

### RF01 - Listagem pública

O sistema deve listar apenas relatos publicados, ordenados pela data de publicação em ordem decrescente.

### RF02 - Leitura individual

O sistema deve disponibilizar uma URL única para cada relato publicado.

### RF03 - Autenticação

O sistema deve restringir o painel administrativo a um usuário autenticado.

### RF04 - Criação

O autor deve conseguir criar um relato com foto, texto alternativo, título, descrição e status.

### RF05 - Edição

O autor deve conseguir alterar qualquer informação de um relato existente.

### RF06 - Exclusão

O autor deve conseguir excluir um relato somente após confirmar a ação.

### RF07 - Rascunhos

Relatos em rascunho devem aparecer no painel, mas nunca nas páginas públicas.

### RF08 - Imagens

O sistema deve validar formato e tamanho dos arquivos e apresentar uma mensagem compreensível quando o envio falhar.

### RF09 - SEO e compartilhamento

Cada relato publicado deve possuir título da página, descrição, URL canônica e metadados de compartilhamento usando a foto do relato.

## 9. Direção visual

### Conceito

Íntimo, imersivo e contemplativo. A interface pode preservar elementos oníricos, mas deve comportar também relatos concretos, vulneráveis e reflexivos sem parecer limitada ao universo dos sonhos.

### Princípios

- Fotografias com grande presença visual.
- Paleta predominantemente escura, com contrastes suaves e um tom de destaque.
- Tipografia expressiva nos títulos e confortável nos textos longos.
- Espaçamento generoso e poucos elementos simultâneos.
- Animações sutis, respeitando a preferência por movimento reduzido do dispositivo.
- Nada deve competir com o conteúdo do relato.

### Responsividade

- No celular, os cards devem usar uma única coluna e manter texto legível sem zoom.
- No desktop, o layout pode explorar imagens maiores e composições assimétricas.
- Imagens devem ser responsivas e preservar seu enquadramento principal.

## 10. Requisitos não funcionais

- **Desempenho:** imagens otimizadas e carregamento sob demanda fora da área visível.
- **Acessibilidade:** navegação por teclado, contraste adequado, foco visível, estrutura semântica e texto alternativo nas imagens.
- **Segurança:** senhas nunca armazenadas em texto puro, sessão protegida e validação de dados no servidor.
- **Privacidade:** nenhuma coleta de dados pessoais de visitantes no MVP.
- **Confiabilidade:** publicações não devem ser perdidas quando ocorrer uma falha de validação.
- **Compatibilidade:** suporte às versões atuais dos principais navegadores em celular e desktop.

## 11. Critérios de aceite do MVP

- Um visitante consegue acessar e ler todos os relatos publicados sem login.
- Um rascunho não pode ser acessado por uma URL pública.
- O autor consegue entrar no painel e encerrar sua sessão.
- O autor consegue criar, editar, publicar e excluir um relato.
- Uma publicação sem foto, título ou descrição não pode ser publicada.
- Um relato publicado aparece na página inicial sem intervenção técnica.
- A página inicial e a página do relato funcionam em telas de celular e desktop.
- Todas as fotos publicadas possuem texto alternativo.
- Links, formulários e controles podem ser utilizados por teclado.
- O conteúdo permanece legível quando animações estiverem desativadas.

## 12. Métricas de sucesso

Como o MVP é um projeto autoral, as métricas devem avaliar uso e consistência, não crescimento a qualquer custo:

- Quantidade de relatos publicados por mês.
- Percentual de publicações iniciadas que chegam ao status publicado.
- Visualizações por relato.
- Percentual de visitantes que abrem um relato a partir da página inicial.
- Ausência de erros no fluxo de publicação.

## 13. Fases futuras

Recursos que podem ser avaliados depois da validação do MVP:

- Busca por palavras presentes nos relatos.
- Tags para temas recorrentes, pessoas, lugares ou sensações.
- Navegação por calendário ou linha do tempo.
- Galeria visual de relatos.
- Agendamento de publicações.
- Newsletter para novos relatos.
- Comentários moderados.
- Modo privado para relatos que o autor não queira publicar.

## 14. Questões em aberto

- Qual será a frase de apresentação do blog?
- As datas devem exibir apenas o dia da publicação ou também o horário?
- A foto será sempre enviada pelo autor ou poderá vir de uma URL externa?
- O autor precisa alterar a ordem dos relatos manualmente?
- Será necessário manter uma data diferente para quando a experiência relatada aconteceu?
