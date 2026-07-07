# FWCL / LEGION — Etapa F: Calibração Fina e Release Candidate

Data de geração: 2026-07-06

Este pacote contém os entregáveis da **Etapa F — Calibração Fina, Quality Gate e Release Candidate**.

A Etapa F é a última etapa metodológica antes da integração jogável da Release 0.4.

Fluxo completo:

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
Etapa F — calibração fina e release candidate
↓
Release 0.4 — integração jogável no produto
```

## Objetivo

Transformar o novo motor LEGION em uma versão candidata a release, com:

- calibração de placares, xG, finalizações e eventos;
- quality gate estatístico;
- suíte de regressão;
- comparação entre motor legado e motor calibrado;
- critérios objetivos de aceite;
- plano de rollback;
- pacote de release candidate.

## Arquivos principais

```text
docs/WCHD_STAGE_F.md
docs/CALIBRATION_PLAYBOOK.md
docs/QUALITY_GATE_STATISTICAL.md
docs/REGRESSION_TEST_SUITE.md
docs/RELEASE_CANDIDATE_PLAN.md
docs/LEGION_04_RELEASE_NOTES_DRAFT.md
docs/STAGE_F_ACCEPTANCE.md

data/legion/calibration_targets.json
data/legion/calibration_weights.json
data/legion/regression_fixture_matrix.json
data/legion/release_candidate_manifest.json
data/legion/statistical_quality_gate.json

js/legion/calibrationTuner.js
js/legion/statisticalQualityGate.js
js/legion/regressionTestRunner.js
js/legion/releaseCandidateBuilder.js

tools/run_stage_f_calibration.js
tests/stage_f_quality_checklist.json
release/RELEASE_04_CANDIDATE_CHECKLIST.md
```

## Decisão técnica

A Release 0.4 não deve ser publicada apenas porque "funciona".  
Ela deve passar por quality gate estatístico e regressão contra cenários fixos.
