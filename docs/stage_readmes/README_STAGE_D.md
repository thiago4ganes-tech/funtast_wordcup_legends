# FWCL / LEGION — Etapa D: Event Graph Calibrado

Data de geração: 2026-07-06

Este pacote contém os entregáveis da **Etapa D — Event Graph Calibrado**.

A Etapa D pega os atributos e modificadores da Etapa C e define como eles devem afetar a simulação da partida.

Fluxo metodológico:

```text
Etapa A — fatos estruturais
↓
Etapa B — métricas históricas observadas
↓
Etapa C — atributos derivados e modificadores
↓
Etapa D — árvore de eventos calibrada
↓
Etapa E — integração no jogo e testes massivos
```

## Objetivo

Reestruturar o motor de partidas para que cada lance seja resolvido por:

```text
evento-mãe
+ contexto da partida
+ atributos/modificadores dos jogadores
+ perfis das seleções
+ oposição defensiva
+ sinergia factual
+ aleatoriedade controlada
= distribuição de consequências plausíveis
```

## Arquivos principais

```text
docs/WCHD_STAGE_D.md
docs/EVENT_GRAPH_ARCHITECTURE.md
docs/EVENT_PROBABILITY_MODEL.md
docs/EVENT_TREE_CATALOG.md
docs/CALIBRATION_RULES.md
docs/SIMULATION_TEST_PLAN.md
docs/NARRATION_INTEGRATION.md
docs/STAGE_D_ACCEPTANCE.md

data/legion/event_base_probabilities.json
data/legion/event_outcome_matrix.json
data/legion/context_modifiers.json
data/legion/tactical_styles.json
data/legion/event_chain_templates.json
data/legion/simulation_test_fixtures.json

js/legion/eventProbability.js
js/legion/eventGraphCalibrated.js
js/legion/historicalEvidenceAdapter.js
js/legion/matchSimulatorCalibrated.js

tools/run_stage_d_simulation_sample.js
tests/stage_d_quality_checklist.json
```

## Observação

Esta entrega ainda não substitui automaticamente o motor atual do jogo publicado.  
Ela cria a base técnica para a próxima release integrada.
