# Guia de Uso pelo LEGION — G4

## 1. Arquivo principal

A Release 0.4 deve começar pelo arquivo:

```text
data/production/wchd_legion_inputs.json
```

## 2. Uso recomendado

### Seleção de jogador

Usar:

```text
player_wc_id
team_wc_id
primary_position_wc
real_metrics
technical_estimates
origin_summary
engine_weight_limit
```

### Seleção de time

Usar:

```text
team_wc_id
real_metrics
style_estimates
style_confidence
engine_weight_limit
```

### Sinergia

Usar:

```text
player_a_wc_id
player_b_wc_id
shared_minutes_estimated
synergy_type_estimated
synergy_score_estimated
confidence_level
engine_weight_limit
```

## 3. Regra de peso

```text
real_structured: peso normal
derived_from_real_structured: peso normal ou quase normal
estimated_proxy: peso moderado
synthetic_comparable: peso limitado
confidence D: peso baixo
```

## 4. Exibição futura

O jogo pode mostrar no painel técnico:

```text
% real
% derivado
% estimado
% sintético
```

por seleção e por jogador.
