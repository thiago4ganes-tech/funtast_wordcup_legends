# Fórmulas de Perfis de Seleção — WCHD Etapa C

## 1. Objetivo

Criar perfis coletivos derivados para alimentar o LEGION.

---

## 2. Attack profile

```text
attack_profile =
attack_observed_index * 0.45
+ goals_for_per_game_component * 0.25
+ knockout_goals_for_component * 0.15
+ opponent_strength_adjusted_attack * 0.15
```

Uso futuro:

- frequência de ações ofensivas;
- probabilidade de chegar ao último terço;
- volume de finalizações.

---

## 3. Defense profile

```text
defense_profile =
defense_observed_index * 0.45
+ inverse_goals_against_per_game * 0.25
+ clean_sheet_component * 0.15
+ opponent_strength_adjusted_defense * 0.15
```

Uso futuro:

- cortes;
- bloqueios;
- dificuldade de gerar chance clara contra a equipe.

---

## 4. Transition profile

```text
transition_profile =
goal_difference_per_game * 0.20
+ attack_profile * 0.25
+ pace_players_component * 0.20
+ direct_goal_pattern_component * 0.20
+ tactical_prior * 0.15
```

Na Etapa C, `tactical_prior` deve ser conservador e documentado.

---

## 5. Possession profile

```text
possession_profile =
passing_core_component * 0.30
+ midfield_minutes_share_component * 0.20
+ low_failed_to_score_component * 0.15
+ control_style_prior * 0.20
+ defensive_suppression_component * 0.15
```

---

## 6. Aerial profile

```text
aerial_profile =
heading_players_component * 0.35
+ set_piece_goals_component * 0.25
+ center_back_height_component * 0.15
+ crossing_profile_component * 0.15
+ defensive_aerial_component * 0.10
```

---

## 7. Set piece profile

```text
set_piece_profile =
set_piece_goals_component * 0.35
+ aerial_profile * 0.25
+ crossing_profile * 0.15
+ penalty_takers_component * 0.10
+ goalkeeper_aerial_component * 0.15
```

---

## 8. Knockout resilience profile

```text
knockout_resilience_profile =
knockout_wins_component * 0.30
+ knockout_goal_difference_component * 0.25
+ clutch_players_component * 0.20
+ goals_against_knockout_inverse * 0.15
+ penalty_shootout_component * 0.10
```

---

## 9. Confiança

O perfil coletivo herda a menor confiança entre seus componentes principais.

Quando houver uso de `tactical_prior`, o perfil deve ser marcado no máximo como confiança B, salvo evidência quantitativa suficiente.
