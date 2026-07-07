# FWCL / LEGION — Etapa B: Métricas Históricas Observadas

Data de geração: 2026-07-06

Este pacote contém os entregáveis da **Etapa B — Métricas Históricas Observadas** do WCHD (*World Cup Historical Database*).

A Etapa B parte da base factual da Etapa A e cria indicadores estruturados para alimentar o futuro **Historical Evidence Engine**.

Ela ainda **não** cria atributos finais de jogo como finalização, passe, drible, liderança ou preço.  
Ela cria uma camada intermediária, auditável, baseada em desempenho histórico real.

## Objetivo

Transformar dados estruturais em métricas como:

- desempenho seleção-Copa;
- desempenho jogador-Copa;
- desempenho em mata-mata;
- participação em gols;
- minutos jogados;
- minutos compartilhados;
- confrontos entre países;
- força de adversários;
- matriz inicial de sinergia factual;
- métricas de confiabilidade por registro.

## Arquivos principais

```text
docs/WCHD_STAGE_B.md
docs/METRIC_DICTIONARY.md
docs/FORMULAS_STAGE_B.md
docs/QUALITY_RULES_STAGE_B.md
docs/STAGE_B_ACCEPTANCE.md
docs/STAGE_B_TO_LEGION.md

data/derived/team_wc_metrics.json
data/derived/player_wc_metrics.json
data/derived/player_match_metrics.json
data/derived/player_pair_minutes.json
data/derived/head_to_head_metrics.json
data/derived/opponent_strength_metrics.json
data/derived/knockout_metrics.json

data/schema/*.schema.json
data/methodology/stage_b_formula_registry.json
tests/stage_b_quality_checklist.json
tools/derive_stage_b_metrics.js
```

## Decisão metodológica

A Etapa B cria evidência mensurável.  
A Etapa C transformará essa evidência em atributos de jogo.
