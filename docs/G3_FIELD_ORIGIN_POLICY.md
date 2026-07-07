# Política de Origem dos Campos — G3

## 1. Campos estimated_proxy

Campos estimados por dado real indireto:

```text
shots
shots_on_target
xg_estimated
saves
shots_for
shots_against
set_piece_goals
synergy_score_estimated
```

## 2. Campos synthetic_comparable

Campos estimados por comparação de função e contexto:

```text
passes_attempted
passes_completed
key_passes
progressive_passes
dribbles_attempted
dribbles_completed
crosses
tackles
interceptions
aerial_duels_won
pressures
possession_avg
pressing_intensity
direct_attacks
tactical_style_profile
```

## 3. Campos que continuam não sendo reais

Mesmo preenchidos, estes campos não devem ser chamados de dados observados:

```text
passes
dribbles
pressures
tackles
interceptions
possession
pressing
style profile
```

## 4. Regra para interface

Quando exibidos ao usuário técnico, devem mostrar selo:

```text
REAL
DERIVADO
PROXY
SINTÉTICO
```
