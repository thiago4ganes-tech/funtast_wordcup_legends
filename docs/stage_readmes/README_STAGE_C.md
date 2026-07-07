# FWCL / LEGION — Etapa C: Atributos Derivados e Modificadores do Motor

Data de geração: 2026-07-06

Este pacote contém os entregáveis da **Etapa C — Atributos Derivados e Modificadores LEGION**.

A Etapa C parte das métricas históricas observadas da Etapa B e cria uma camada intermediária para o motor de simulação:

```text
Etapa A — fatos estruturais
↓
Etapa B — métricas históricas observadas
↓
Etapa C — atributos derivados e modificadores
↓
Etapa D — Event Graph calibrado
```

## Objetivo

Converter evidências históricas em variáveis úteis ao LEGION, sem perder rastreabilidade.

Esta etapa cria:

- atributos derivados de jogadores;
- perfis derivados de seleções;
- modificadores de eventos;
- regras de confiança;
- fórmulas documentadas;
- dicionário de atributos;
- esqueleto de script para geração automática.

## Arquivos principais

```text
docs/WCHD_STAGE_C.md
docs/ATTRIBUTE_DICTIONARY.md
docs/ATTRIBUTE_FORMULAS_STAGE_C.md
docs/TEAM_PROFILE_FORMULAS_STAGE_C.md
docs/LEGION_MODIFIERS.md
docs/CONFIDENCE_AND_EVIDENCE_STAGE_C.md
docs/STAGE_C_ACCEPTANCE.md

data/derived/player_derived_attributes.json
data/derived/team_derived_profiles.json
data/derived/player_legion_modifiers.json
data/derived/team_legion_modifiers.json
data/derived/player_competency_candidates.json

data/schema/*.schema.json
data/methodology/stage_c_formula_registry.json
tests/stage_c_quality_checklist.json
tools/derive_stage_c_attributes.js
```

## Regra central

Atributo não é opinião solta.  
Todo atributo deve nascer de:

```text
métrica observada + fórmula + fallback documentado + nível de confiança
```
