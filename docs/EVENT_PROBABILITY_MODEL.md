# Modelo de Probabilidades — LEGION Etapa D

## 1. Fórmula geral

Cada consequência de evento recebe um score.

```text
outcome_score =
base_probability
+ attacking_player_modifier
+ supporting_player_modifier
+ team_modifier
+ synergy_modifier
+ context_modifier
- defensive_player_modifier
- goalkeeper_modifier
- opponent_team_modifier
+ controlled_randomness
```

Depois, os scores são normalizados em distribuição de probabilidade.

---

## 2. Clamp

Nenhuma consequência pode ir a 0% ou 100% em jogo corrido.

Regras iniciais:

```text
probabilidade mínima: 1%
probabilidade máxima evento comum: 65%
probabilidade máxima gol em chance comum: 35%
probabilidade máxima gol em pênalti: 82%
```

---

## 3. Aleatoriedade controlada

A aleatoriedade deve gerar variação, não caos.

```text
controlled_randomness = random(-0.04, +0.04)
```

Eventos de alto impacto podem ter aleatoriedade menor:

```text
penalty: random(-0.025, +0.025)
```

---

## 4. Exemplo: passe vertical

Consequências possíveis:

```text
through_ball_completed
intercepted
offside
bad_pass
foul_won
possession_retained
```

Fórmula para passe completado:

```text
completed =
base
+ passer.chance_through_ball_success_bonus
+ receiver.off_ball_movement_modifier
+ team_transition_speed_modifier
+ synergy_pair_modifier
- defender.chance_interception_bonus
- opponent_defensive_resistance_modifier
+ context
+ randomness
```

---

## 5. Exemplo: cruzamento

Consequências possíveis:

```text
cross_to_header
cross_cleared
goalkeeper_claim
cross_blocked
cross_overhit
corner_won
foul_in_box
```

Fórmula para cabeceio:

```text
cross_to_header =
base
+ crosser.chance_cross_accuracy_bonus
+ target.chance_header_goal_bonus
+ team_aerial_threat_modifier
+ synergy_pair_modifier
- defender.aerial_defense_modifier
- goalkeeper.chance_claim_cross_bonus
+ context
+ randomness
```

---

## 6. Exemplo: finalização dentro da área

Consequências possíveis:

```text
goal
save
miss
blocked
rebound
corner
```

Fórmula para gol:

```text
goal =
base_xg
+ shooter.chance_shot_conversion_bonus
+ shooter.chance_big_chance_conversion_bonus
+ team_attack_volume_modifier
- defender.chance_block_bonus
- goalkeeper.chance_save_bonus
- opponent_defensive_resistance_modifier
+ pressure_context
+ randomness
```

---

## 7. Contexto de placar

```text
empatado: neutro
perdendo por 1: +urgência ofensiva, +risco de perda
perdendo por 2+: +volume, -controle defensivo
vencendo por 1: -risco ofensivo, +proteção
vencendo por 2+: menor ritmo, menos exposição
```

---

## 8. Contexto de minuto

```text
0–15: menor risco, leitura inicial
16–60: ritmo normal
61–75: fadiga moderada
76–90: pressão, erro, clutch e substituições pesam mais
90+: contexto extremo
```

---

## 9. Mata-mata

Em mata-mata:

```text
clutch
composure
knockout_resilience_profile
discipline
```

ganham peso levemente maior.

Limite recomendado:

```text
+/- 0.04 em eventos comuns
+/- 0.08 em eventos decisivos
```

---

## 10. Regra de plausibilidade

Se uma alteração de probabilidade tornar o resultado estatisticamente absurdo, o limite deve prevalecer.

Exemplo:

- atacante histórico não pode converter 70% das finalizações comuns;
- defesa histórica não pode bloquear tudo;
- goleiro lendário não pode defender todos os chutes.
