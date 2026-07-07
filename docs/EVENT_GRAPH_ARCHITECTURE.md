# Arquitetura do Event Graph Calibrado

## 1. Conceito

O Event Graph é uma árvore probabilística com memória de contexto.

Cada cadeia de lance tem:

```text
event_id
event_type
phase
actor
support_actor
primary_defender
goalkeeper
zone
pressure
tempo
minute
score_state
outcome_distribution
terminal_outcome
```

---

## 2. Fases do lance

### 2.1 Construção

```text
build_up
goalkeeper_distribution
central_circulation
```

Objetivo:

- manter posse;
- avançar com segurança;
- atrair pressão.

---

### 2.2 Progressão

```text
wide_progression
central_progression
transition_attack
dribble_take_on
through_ball
```

Objetivo:

- entrar no último terço;
- quebrar linha;
- gerar vantagem.

---

### 2.3 Ação decisiva

```text
cross
cutback
box_shot
header_attempt
long_shot
set_piece_cross
free_kick_direct
penalty
```

Objetivo:

- gerar finalização;
- gerar xG;
- forçar defesa adversária.

---

### 2.4 Resolução

```text
goal
save
miss
block
clearance
corner
foul
turnover
```

---

## 3. Estrutura de uma cadeia

Exemplo: ataque pelos lados.

```text
build_up
↓
wide_progression
↓
cross
↓
header_attempt
↓
save / goal / miss / clearance / corner
```

Exemplo: transição.

```text
turnover_won
↓
transition_attack
↓
through_ball
↓
box_shot
↓
goal / save / miss / block
```

Exemplo: posse paciente.

```text
build_up
↓
central_progression
↓
cutback
↓
box_shot
↓
goal / save / block / turnover
```

---

## 4. Seleção de eventos-mãe

A escolha do evento-mãe depende de:

```text
team_attack_profile
team_transition_speed_modifier
team_possession_control_modifier
team_aerial_threat_modifier
score_state
minute
fatigue
opponent_defensive_resistance
random_seed
```

---

## 5. Seleção de jogadores

O motor deve selecionar atores por função.

Exemplo:

### Cruzamento

```text
actor = lateral/ponta/meia aberto com crossing alto
target = atacante/zagueiro em bola parada com heading alto
defender = zagueiro/lateral com aerial_defense ou marking
goalkeeper = goleiro adversário
```

### Passe vertical

```text
actor = meia/atacante com vision/passing
target = atacante/ponta com off_ball_movement/pace
defender = zagueiro/volante com interception/defensive_positioning
```

### Finalização

```text
actor = jogador em zona de finalização com finishing/off_ball_movement
defender = defensor próximo com block/marking
goalkeeper = goleiro
```

---

## 6. Memória da partida

O Match State deve guardar:

```text
minute
score
fatigue
cards
momentum
territorial_control
recent_events
team_stats
player_ratings
player_event_load
```

Isso permite:

- pressão final;
- queda física;
- risco disciplinar;
- alteração de ritmo;
- relatório tático coerente.

---

## 7. Princípio anti-repetição

O motor deve evitar cadeias idênticas repetidas.

Regras:

```text
não repetir mesmo evento-mãe mais de 3 vezes seguidas
reduzir peso de cadeia recém-usada
variar zona do campo
alternar atores quando possível
aumentar risco em times que insistem no mesmo padrão
```
