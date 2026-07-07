# Fórmulas de Estimativa — G3

## 1. Jogador

### Chutes

```text
shots =
role_shots_per90
* minutes / 90
* team_attack_factor
* goal_boost
+ goals_adjustment
```

### Chutes no alvo

```text
shots_on_target =
goals + (shots - goals) * role_sot_rate
```

### xG estimado

```text
xg_estimated =
max(goals * 0.38, shots * role_xg_per_shot)
```

### Passes

```text
passes_attempted =
role_passes_per90
* minutes / 90
* team_possession_factor
```

### Dribles

```text
dribbles_attempted =
role_dribbles_per90
* minutes / 90
* attack_context
```

### Ações defensivas

```text
tackles/interceptions =
role_defensive_actions_per90
* minutes / 90
* defensive_context
```

---

## 2. Seleção

### Posse estimada

```text
possession =
50
+ win_rate_component
+ goals_for_component
- goals_against_component
```

### Chutes a favor

```text
shots_for =
goals_for_per_game / estimated_conversion_rate
```

### Chutes contra

```text
shots_against =
goals_against_per_game / estimated_conversion_rate
```

---

## 3. Sinergia

```text
synergy_score =
shared_minutes_component
+ starts_together_component
+ team_goals_context_component
+ role_complementarity_component
```

## 4. Confiança

```text
C = minutos + posição + métricas reais disponíveis
D = posição ou minutos frágeis
```
