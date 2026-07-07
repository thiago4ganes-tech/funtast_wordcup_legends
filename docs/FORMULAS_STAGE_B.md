# Fórmulas — WCHD Etapa B

Este documento define fórmulas iniciais para métricas históricas observadas.

As fórmulas podem ser calibradas depois, mas devem permanecer auditáveis.

---

## 1. Métricas básicas de seleção

```text
goal_difference = goals_for - goals_against
```

```text
goals_for_per_game = goals_for / games
```

```text
goals_against_per_game = goals_against / games
```

```text
points_equivalent = wins * 3 + draws
```

```text
points_per_game = points_equivalent / games
```

```text
win_rate = wins / games
```

---

## 2. Índice ofensivo observado

Fórmula inicial:

```text
attack_observed_index =
normalize(goals_for_per_game) * 0.55
+ normalize(knockout_goals_for_per_game) * 0.25
+ normalize(goal_difference_positive_component) * 0.20
```

Observação:

- não é atributo de finalização;
- mede produção ofensiva histórica da seleção;
- será usado depois como modificador coletivo.

---

## 3. Índice defensivo observado

Fórmula inicial:

```text
defense_observed_index =
normalize(inverse_goals_against_per_game) * 0.50
+ normalize(clean_sheet_rate) * 0.30
+ normalize(knockout_defense_component) * 0.20
```

Observação:

- quanto menos gols sofridos, maior o índice;
- clean sheets ajudam;
- desempenho defensivo em mata-mata recebe peso adicional.

---

## 4. Índice de campanha

Fórmula inicial:

```text
campaign_index =
normalize(points_per_game) * 0.30
+ normalize(stage_score) * 0.30
+ normalize(goal_difference_per_game) * 0.20
+ normalize(opponent_strength_avg) * 0.20
```

Stage score sugerido:

| Fase | Score |
|---|---:|
| Campeão | 100 |
| Vice | 92 |
| Semifinalista | 84 |
| Quartas | 74 |
| Oitavas | 64 |
| Fase de grupos | 45 |

---

## 5. Gols por 90

```text
goals_per_90 = goals / minutes * 90
```

Regra:

- se `minutes` for nulo ou zero, retornar `null`;
- não estimar sem fonte.

---

## 6. Participação em gols

```text
goal_participations = goals + assists
```

Se assistências forem indisponíveis:

```text
goal_participations = goals
assist_data_available = false
```

Nunca fingir que assistência é zero quando o dado não existe.  
Zero e desconhecido são coisas diferentes.

---

## 7. Share de gols do time

```text
team_goal_share = player_goals / team_goals_for
```

Uso futuro:

- protagonismo ofensivo;
- dependência do time;
- peso de decisão.

---

## 8. Minutos compartilhados estimados

Quando houver minuto de entrada e saída:

```text
shared_minutes =
overlap(
  player_a_minute_in,
  player_a_minute_out,
  player_b_minute_in,
  player_b_minute_out
)
```

Quando não houver minuto detalhado:

```text
shared_minutes_estimated = null
confidence_level = C ou D
```

---

## 9. Índice factual de sinergia

Fórmula inicial:

```text
factual_synergy_index =
normalize(shared_minutes_estimated) * 0.45
+ normalize(starts_together) * 0.25
+ normalize(team_goals_with_both_on_pitch) * 0.20
+ normalize(direct_goal_combinations) * 0.10
```

Importante:

- isso mede convivência factual;
- não mede ainda tipo de sinergia tática;
- duplas famosas sem minutos/dados suficientes devem receber observação, não bônus automático.

---

## 10. Peso máximo do head-to-head

Histórico direto entre países pode ter amostra pequena.

Regra sugerida:

```text
weight_cap = min(0.08, sample_size * 0.015)
```

Exemplo:

- 1 jogo: peso máximo 1,5%;
- 3 jogos: peso máximo 4,5%;
- 6 ou mais jogos: peso máximo 8%.

No LEGION, head-to-head nunca deve dominar atributos, forma histórica ou matchup de estilos.
