# Catálogo Inicial de Árvores de Evento

## 1. Build-up

```text
build_up
├── central_progression
├── wide_progression
├── long_ball
├── turnover
├── foul_won
└── recycle_possession
```

Principais variáveis:

```text
team_possession_control_modifier
passing
decision
opponent_pressure
```

---

## 2. Wide progression

```text
wide_progression
├── cross
├── cutback
├── dribble_take_on
├── back_pass
├── blocked_lane
└── turnover
```

Principais variáveis:

```text
crossing
dribbling
pace
fullback_overlap
opponent_wide_defense
```

---

## 3. Central progression

```text
central_progression
├── through_ball
├── box_combination
├── long_shot
├── foul_won
├── intercepted
└── recycle_possession
```

Principais variáveis:

```text
vision
passing
decision
team_possession_profile
opponent_defensive_positioning
```

---

## 4. Transition attack

```text
transition_attack
├── through_ball
├── dribble_carry
├── early_cross
├── box_shot
├── tactical_foul
└── turnover
```

Principais variáveis:

```text
pace
off_ball_movement
vision
team_transition_speed_modifier
defensive_recovery
```

---

## 5. Cross

```text
cross
├── header_attempt
├── volley_attempt
├── clearance
├── goalkeeper_claim
├── cross_blocked
├── overhit
├── corner_won
└── penalty_incident
```

---

## 6. Header attempt

```text
header_attempt
├── goal
├── save
├── miss
├── blocked
├── rebound
└── clearance
```

---

## 7. Through ball

```text
through_ball
├── box_shot
├── goalkeeper_sweep
├── interception
├── offside
├── heavy_touch
└── foul_won
```

---

## 8. Box shot

```text
box_shot
├── goal
├── save
├── miss
├── blocked
├── rebound
└── corner_won
```

---

## 9. Long shot

```text
long_shot
├── goal
├── save
├── miss
├── blocked
├── rebound
└── corner_won
```

Long shots devem ter xG baixo, salvo exceções muito claras.

---

## 10. Set piece cross

```text
set_piece_cross
├── header_attempt
├── second_ball
├── clearance
├── goalkeeper_claim
├── foul_attacking
├── foul_defensive_penalty
└── corner_won
```

---

## 11. Penalty

```text
penalty
├── goal
├── saved
├── missed
└── post
```

---

## 12. Defensive pressure

```text
defensive_pressure
├── tackle_success
├── interception
├── foul_committed
├── yellow_card
├── beaten_by_dribble
└── force_back_pass
```
