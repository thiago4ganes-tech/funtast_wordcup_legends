# WCHD — Etapa D: Event Graph Calibrado

## 1. Objetivo

A Etapa D redesenha a árvore de decisão das jogadas do LEGION.

Ela responde:

> Como uma partida deve evoluir, lance a lance, usando evidência histórica, atributos derivados, contexto e oposição?

A Etapa D não é apenas uma lista de frases de narração.  
Ela é a camada lógica que decide o que acontece em campo.

---

## 2. Problema que estamos corrigindo

O motor anterior tinha três limitações:

1. Eventos ainda muito genéricos.
2. Probabilidades pouco sensíveis aos perfis dos jogadores.
3. Resultados finais e estatísticas nem sempre pareciam nascer organicamente do jogo.

A nova abordagem resolve a partida por cadeias de eventos.

---

## 3. Novo fluxo da simulação

```text
Match State
↓
Possession Selector
↓
Event Mother
↓
Event Context
↓
Outcome Distribution
↓
Resolution
↓
Stats Update
↓
Narration
↓
Next Event
```

Exemplo:

```text
Brasil recupera a bola
↓
Transição rápida
↓
Passe vertical de Rivaldo
↓
Ronaldo recebe atacando espaço
↓
Finalização sob pressão
↓
Defesa / gol / rebote / bloqueio / escanteio
```

---

## 4. Eventos-mãe

A partida será construída com eventos-mãe, não com eventos soltos.

Lista inicial:

```text
build_up
wide_progression
central_progression
transition_attack
through_ball
dribble_take_on
cross
cutback
long_shot
box_shot
header_attempt
set_piece_cross
corner
free_kick_direct
penalty
defensive_pressure
turnover
counter_press
goalkeeper_distribution
```

---

## 5. Eventos terminais

Eventos que encerram uma cadeia:

```text
goal
save
miss
blocked_shot
clearance
interception
foul
yellow_card
red_card
corner_won
goal_kick
offside
turnover
possession_retained
```

---

## 6. Estatísticas que devem nascer da simulação

A simulação deve produzir:

```text
goals
xg
shots
shots_on_target
passes_progressive
final_third_entries
crosses
dribbles_attempted
dribbles_completed
turnovers
fouls
cards
corners
saves
possession_phases
territorial_control
```

O relatório final deve ler essas estatísticas, não inventar análise.

---

## 7. Papel da evidência histórica

A evidência histórica entra como calibrador, não como determinismo.

Exemplo:

```text
Ronaldo 2002 tem alto finishing e clutch.
Isso aumenta a probabilidade de converter uma chance.
Não garante gol.
```

---

## 8. Papel do adversário

Toda ação ofensiva precisa ter resistência defensiva.

Exemplo:

```text
through_ball_success =
passador.vision
+ receptor.off_ball_movement
+ team_transition_modifier
- defensor.interception
- linha_defensiva.defense_profile
- pressão do jogo
```

---

## 9. Resultado esperado

Após a Etapa D, a simulação deve:

- gerar placares plausíveis;
- gerar volume de chances plausível;
- fazer os jogadores certos aparecerem nos lances certos;
- diferenciar estilos de seleção;
- criar variação sem incoerência;
- explicar por que uma jogada terminou em gol, defesa ou erro.
