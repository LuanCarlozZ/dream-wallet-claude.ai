# Plano: FinControl para entregadores

## Resultado
Manter a identidade visual escura atual e transformar a tela principal em uma ferramenta simples, mobile-first, para controlar ganhos semanais, contas mensais e compras desejadas. O app deixará de depender de login ou internet para o uso financeiro diário: os dados ficarão automaticamente no aparelho.

## O que será construído
- **Início / Resumo**
  - Seletor do mês atual.
  - Destaque para o **Dinheiro Livre**, calculado como ganhos do mês menos todas as contas cadastradas, pagas ou pendentes.
  - Cartões com ganhos do mês, valor reservado para contas e total já pago.
  - Cadastro rápido do total de cada semana, sem lançamentos por corrida ou por dia.
  - Gráfico simples comparando ganhos semanais e visão da distribuição do dinheiro.
- **Contas**
  - Cadastro de conta com nome, valor e status paga/pendente.
  - Alternância rápida do status e exclusão.
  - Resumo do total obrigatório, pendente e pago.
  - Sugestões de categorias adequadas a entregadores, como combustível, manutenção, aluguel, internet e MEI.
- **Desejos**
  - Cadastro de item e valor.
  - Comparação somente com o Dinheiro Livre, sem consumir a reserva das contas.
  - Percentual disponível, valor que falta e status “Pode comprar agora” ou “Guardar mais”.
- **Navegação no celular**
  - Abas fixas no rodapé: Início, Contas e Desejos.
  - Controles grandes e áreas seguras para iPhone e Android.

## Dados e funcionamento offline
- Salvar ganhos, contas, desejos e mês selecionado no armazenamento local do aparelho.
- Remover a exigência de login e a dependência do banco externo na experiência principal.
- Adicionar modo offline por service worker controlado, sem ativá-lo dentro do editor de prévia.
- Manter manifesto, ícones e abertura em modo standalone para instalação pela tela inicial.

## GitHub Pages
- Preservar caminhos relativos compatíveis com repositórios publicados em subpastas.
- Ajustar o processo automático de publicação e os arquivos do PWA.
- Garantir que atualização direta e abertura pelo ícone instalado carreguem corretamente.

## Validação
- Testar cadastro, edição de status, exclusão e persistência após recarregar.
- Conferir os cálculos do Dinheiro Livre e da lista de desejos.
- Validar a tela em tamanho de celular e desktop.
- Gerar a versão final e confirmar os caminhos produzidos para GitHub Pages.

## Observação técnica
O modo offline será implementado com `vite-plugin-pwa`, com navegação em estratégia Network First e registro bloqueado no editor de prévia. A versão publicada no GitHub Pages poderá ser instalada e aberta sem a barra do navegador após “Adicionar à Tela Inicial”.
