# FWCL / LEGION — Etapa E: Integração, Telemetria e Testes Massivos

Data de geração: 2026-07-06

Este pacote contém os entregáveis da **Etapa E — Integração, Telemetria e Testes Massivos**.

A Etapa E não é uma etapa cosmética. Ela cria a ponte entre o motor calibrado da Etapa D e o jogo atual, com controle de qualidade, coleta de estatísticas e plano de teste em lote.

Fluxo metodológico:

```text
Etapa A — fatos estruturais
↓
Etapa B — métricas históricas observadas
↓
Etapa C — atributos derivados e modificadores
↓
Etapa D — Event Graph calibrado
↓
Etapa E — integração, telemetria e testes massivos
↓
Etapa F — calibração fina e release jogável
```

## Objetivo

Integrar o LEGION calibrado de forma controlada, sem quebrar o jogo atual.

A Etapa E entrega:

- ponte de integração entre times do jogo e motor LEGION;
- simulação em lote para testes de plausibilidade;
- telemetria de partida;
- análise tático-estatística automática;
- mapeamento de eventos para narração;
- thresholds de qualidade;
- critérios de aprovação/reprovação;
- plano de rollback.

## Arquivos principais

```text
docs/WCHD_STAGE_E.md
docs/INTEGRATION_GUIDE.md
docs/MOTOR_BRIDGE_SPEC.md
docs/BATCH_SIMULATION_QA.md
docs/TELEMETRY_SPEC.md
docs/MATCH_REPORT_SPEC.md
docs/NARRATION_EVENT_MAPPING.md
docs/ROLLBACK_AND_SAFETY.md
docs/STAGE_E_ACCEPTANCE.md

data/legion/calibration_thresholds.json
data/legion/report_metric_catalog.json
data/legion/narration_templates_stage_e.json
data/legion/batch_test_matrix.json

js/legion/legionIntegrationBridge.js
js/legion/simulationTelemetry.js
js/legion/simulationBatchRunner.js
js/legion/matchReportAnalyzer.js
js/legion/narrationEventMapper.js
js/legion/calibrationQualityGate.js

tools/run_stage_e_batch_tests.js
tests/stage_e_quality_checklist.json
```

## Decisão de segurança

Esta etapa foi preparada para integração gradual. O jogo poderá manter o motor antigo como fallback enquanto o motor calibrado é testado.
