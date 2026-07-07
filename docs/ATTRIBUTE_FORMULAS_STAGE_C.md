# Fórmulas de Atributos — WCHD Etapa C

## 1. Normalização

A Etapa C usa normalização em escala 1–99.

Função conceitual:

```text
score_1_99 = clamp(50 + z_score * 12, 1, 99)
```

Para evitar distorções em amostras pequenas, aplicar limites por posição e confiança.

---

## 2. Finalização

Fórmula inicial:

```text
finishing =
normalize(goals_per_90) * 0.35
+ normalize(team_goal_share) * 0.25
+ normalize(knockout_goals) * 0.20
+ normalize(final_or_semifinal_goals) * 0.10
+ position_role_prior * 0.10
```

Fallback:

- se minutos forem desconhecidos, reduzir peso de goals_per_90;
- se só gols estiverem disponíveis, confiança máxima B;
- se o jogador for defensor/goleiro, aplicar teto contextual, salvo evidência excepcional.

---

## 3. Clutch

```text
clutch =
normalize(knockout_goals + knockout_assists) * 0.40
+ normalize(final_goals + semifinal_goals) * 0.25
+ normalize(knockout_minutes) * 0.15
+ normalize(team_goal_share) * 0.10
+ penalty_pressure_component * 0.10
```

Regra:

- clutch não é "famoso em decisão";
- precisa de evento decisivo ou presença consistente em mata-mata.

---

## 4. Composure

```text
composure =
clutch_component * 0.35
+ penalty_conversion_component * 0.20
+ discipline_component * 0.15
+ reliability_component * 0.15
+ role_pressure_prior * 0.15
```

---

## 5. Discipline

A disciplina é inversa ao risco de cartão.

```text
discipline =
99 - normalize(cards_per_90 + red_card_weight)
```

Pesos sugeridos:

```text
yellow_card = 1
second_yellow = 2.5
red_card = 4
```

---

## 6. Reliability

```text
reliability =
normalize(minutes_share) * 0.45
+ normalize(starts_share) * 0.30
+ discipline_component * 0.15
+ injury_absence_inverse_component * 0.10
```

Se dados de lesão não existirem, o último componente deve ser `null` e os pesos redistribuídos.

---

## 7. Stamina

```text
stamina =
normalize(minutes) * 0.35
+ normalize(full_match_count) * 0.30
+ normalize(minutes_share) * 0.20
+ position_stamina_prior * 0.15
```

---

## 8. Vision

```text
vision =
normalize(assists_per_90) * 0.35
+ normalize(goal_participations_per_90) * 0.20
+ creator_role_prior * 0.25
+ possession_profile_component * 0.10
+ knockout_creative_component * 0.10
```

Regra de qualidade:

- quando assistências forem desconhecidas, não usar zero;
- usar `creator_role_prior` com confiança menor.

---

## 9. Passing

```text
passing =
vision_component * 0.25
+ possession_team_component * 0.25
+ role_prior_midfield_fullback * 0.25
+ reliability_component * 0.15
+ turnover_inverse_component * 0.10
```

---

## 10. Crossing

```text
crossing =
assist_component_for_wide_players * 0.30
+ wide_role_prior * 0.30
+ team_wide_attack_component * 0.20
+ synergy_with_box_forwards * 0.10
+ reliability_component * 0.10
```

---

## 11. Heading

```text
heading =
aerial_goal_component * 0.30
+ position_role_prior * 0.25
+ height_component * 0.15
+ team_set_piece_component * 0.15
+ knockout_aerial_component * 0.15
```

---

## 12. Defensive attributes

Para zagueiros, laterais e volantes:

```text
defensive_positioning =
team_defense_observed_index * 0.35
+ minutes_share * 0.20
+ role_prior * 0.25
+ knockout_defensive_component * 0.20
```

```text
marking =
defensive_positioning * 0.40
+ role_prior * 0.25
+ opponent_strength_adjusted_defense * 0.20
+ discipline_component * 0.15
```

```text
interception =
defensive_positioning * 0.45
+ role_prior_midfield_defense * 0.30
+ team_defense_observed_index * 0.15
+ reliability_component * 0.10
```

---

## 13. Goleiros

```text
reflexes =
save_component_when_available * 0.40
+ clean_sheet_component * 0.20
+ inverse_goals_against_component * 0.20
+ opponent_strength_component * 0.10
+ knockout_goalkeeper_component * 0.10
```

```text
penalty_save =
penalties_saved_component * 0.50
+ shootout_exposure_component * 0.20
+ goalkeeper_role_prior * 0.15
+ composure_component * 0.15
```

---

## 14. Teto por confiança

| Confiança | Teto recomendado |
|---|---:|
| A | 99 |
| B | 94 |
| C | 88 |
| D | 82 |

Exceções só com justificativa manual registrada.
