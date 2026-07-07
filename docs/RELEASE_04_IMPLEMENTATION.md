# Release 0.4 — Implementação

Data: 2026-07-07

## Alterações

- Redução global de 20% nos preços recalculados.
- Carregamento do Production Data Pack A–G.
- Expansão da base para até 296 seleções-Copa e 6.800 jogadores-Copa, com fallback para a base curada.
- Copa com 16 participantes:
  - grupos;
  - quartas;
  - semifinal;
  - final;
  - adversários automáticos.
- Eventos ampliados:
  - pênaltis;
  - escanteios;
  - impedimentos;
  - faltas e cobranças;
  - tiros de meta;
  - laterais;
  - divididas;
  - cabeceios;
  - tabelas;
  - ultrapassagens;
  - dribles especiais;
  - resultados variados de finalização.
- Narração com:
  - perigo;
  - quase gol;
  - faltas duras;
  - indisciplina;
  - desentendimentos;
  - viradas;
  - goleadas;
  - reações da torcida.
- Campo ao vivo com:
  - time em posse;
  - jogador com a bola;
  - apoio;
  - defensor na disputa.
- Vantagem maior para jogadores classificados como Lenda.

## Limites

A integração do Production Data Pack depende de `fetch`, funcionando corretamente no GitHub Pages. Em abertura direta por arquivo local, o navegador pode bloquear a leitura e o jogo usará a base de fallback.
