# WCHD — Etapa C: Atributos Derivados e Modificadores LEGION

## 1. Objetivo

A Etapa C converte métricas históricas observadas em atributos e modificadores utilizáveis pelo LEGION.

Ela responde:

> Como transformar gols, minutos, participação em gols, desempenho coletivo, mata-mata e sinergia factual em variáveis que o motor de partidas consiga usar?

A Etapa C não simula a partida ainda.  
Ela prepara a camada que a Etapa D usará para calibrar a árvore de eventos.

---

## 2. Entradas

A Etapa C depende dos arquivos da Etapa B:

```text
data/derived/team_wc_metrics.json
data/derived/player_wc_metrics.json
data/derived/player_pair_minutes.json
data/derived/head_to_head_metrics.json
data/derived/opponent_strength_metrics.json
data/derived/knockout_metrics.json
```

Também pode consultar a Etapa A para dados estruturais:

```text
data/normalized/player_world_cup.json
data/normalized/team_world_cup.json
data/normalized/player_base.json
```

---

## 3. Saídas

```text
data/derived/player_derived_attributes.json
data/derived/team_derived_profiles.json
data/derived/player_legion_modifiers.json
data/derived/team_legion_modifiers.json
data/derived/player_competency_candidates.json
```

---

## 4. Princípio metodológico

Atributos não devem ser números arbitrários.

Cada atributo deve carregar:

```text
valor
fórmula
evidências usadas
fallback utilizado
nível de confiança
observação metodológica
```

Exemplo:

```json
{
  "player_wc_id": "player_ronaldo_nazario_2002",
  "finishing": 98,
  "evidence_fields": ["goals_per_90", "team_goal_share", "knockout_goals", "final_goals"],
  "confidence_level": "A",
  "method_note": "Alta produção ofensiva, alto share de gols e gols decisivos."
}
```

---

## 5. Separação entre atributo e modificador

### Atributo

Representa uma capacidade geral do jogador no jogo.

Exemplo:

```text
finishing
heading
vision
marking
composure
```

### Modificador LEGION

Representa como esse atributo afeta eventos específicos.

Exemplo:

```text
chance_shot_conversion_bonus
chance_header_target_bonus
risk_card_modifier
chance_through_ball_success_bonus
```

O motor deve consultar modificadores durante eventos, não recalcular atributos a cada lance.

---

## 6. Grupos de atributos

### 6.1 Ofensivos

```text
finishing
heading
dribbling
vision
passing
crossing
pace
power
off_ball_movement
```

### 6.2 Defensivos

```text
marking
tackling
interception
aerial_defense
defensive_positioning
```

### 6.3 Goleiros

```text
reflexes
handling
one_v_one
penalty_save
aerial_claim
```

### 6.4 Mentais/contextuais

```text
decision
composure
clutch
leadership
discipline
reliability
stamina
```

---

## 7. Perfis derivados de seleção

A Etapa C também cria perfis de time:

```text
attack_profile
defense_profile
transition_profile
possession_profile
aerial_profile
set_piece_profile
knockout_resilience_profile
```

Esses perfis serão usados para calibrar volume e natureza das jogadas.

---

## 8. Saída para a Etapa D

A Etapa D usará os atributos e modificadores para revisar o Event Graph.

Fluxo de exemplo:

```text
Evento: cruzamento
↓
crossing do cruzador
+ heading do atacante
+ aerial_defense do zagueiro
+ aerial_claim do goleiro
+ team_aerial_profile
+ sinergia factual cruzador/finalizador
↓
Distribuição de consequências
```

---

## 9. Regra de honestidade estatística

Quando a evidência for fraca:

- o atributo deve ter confiança menor;
- o modificador deve ser limitado;
- o jogo pode usar fallback conservador;
- o relatório não deve afirmar certeza.

Exemplo:

```text
"atributo estimado com base em função tática e métricas coletivas"
```

em vez de:

```text
"jogador comprovadamente excelente nesse fundamento"
```
