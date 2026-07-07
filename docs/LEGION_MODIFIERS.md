# Modificadores LEGION — Etapa C

## 1. Objetivo

Traduzir atributos derivados em variáveis de evento.

O Event Graph não deve consultar diretamente `finishing`, `vision` ou `team_goal_share`.  
Ele deve consultar modificadores preparados.

---

## 2. Modificadores de jogador

### Finalização

```text
chance_shot_conversion_bonus
chance_shot_on_target_bonus
chance_big_chance_conversion_bonus
```

Base:

```text
finishing
composure
clutch
off_ball_movement
```

---

### Passe vertical

```text
chance_through_ball_success_bonus
chance_key_pass_bonus
risk_bad_pass_modifier
```

Base:

```text
vision
passing
decision
composure
```

---

### Drible

```text
chance_dribble_success_bonus
risk_dispossession_modifier
chance_foul_won_bonus
```

Base:

```text
dribbling
pace
power
decision
```

---

### Cruzamento

```text
chance_cross_accuracy_bonus
chance_cross_to_danger_zone_bonus
risk_cross_blocked_modifier
```

Base:

```text
crossing
decision
stamina
```

---

### Cabeceio ofensivo

```text
chance_header_on_target_bonus
chance_header_goal_bonus
chance_aerial_duel_win_bonus
```

Base:

```text
heading
power
off_ball_movement
composure
```

---

### Defesa

```text
chance_tackle_success_bonus
chance_interception_bonus
chance_block_bonus
risk_foul_committed_modifier
risk_card_modifier
```

Base:

```text
marking
tackling
interception
defensive_positioning
discipline
```

---

### Goleiro

```text
chance_save_bonus
chance_claim_cross_bonus
chance_one_v_one_save_bonus
chance_penalty_save_bonus
risk_rebound_modifier
```

Base:

```text
reflexes
handling
one_v_one
penalty_save
aerial_claim
composure
```

---

## 3. Modificadores de seleção

```text
team_attack_volume_modifier
team_defensive_resistance_modifier
team_transition_speed_modifier
team_possession_control_modifier
team_aerial_threat_modifier
team_set_piece_threat_modifier
team_knockout_resilience_modifier
```

---

## 4. Escala dos modificadores

Os modificadores não devem ser valores gigantes.

Recomendação inicial:

```text
-0.12 até +0.12 para eventos comuns
-0.18 até +0.18 para especialidades claras
-0.25 apenas para exceções históricas com confiança A
```

Exemplo:

```json
{
  "player_wc_id": "player_miroslav_klose_2006",
  "chance_header_goal_bonus": 0.18,
  "confidence_level": "A"
}
```

---

## 5. Uso na árvore de eventos

Exemplo: cruzamento.

```text
probabilidade de cabeceio perigoso =
base_event_probability
+ crossing_modifier
+ header_modifier
+ team_aerial_threat_modifier
+ pair_synergy_modifier
- defender_aerial_modifier
- goalkeeper_claim_cross_modifier
```

---

## 6. Regra anti-distorção

Nenhum modificador isolado deve determinar o resultado.

O LEGION deve usar:

```text
probabilidade base
+ atributos
+ contexto
+ adversário
+ fadiga
+ placar
+ minuto
+ aleatoriedade controlada
```

Isso evita simulações repetitivas.
