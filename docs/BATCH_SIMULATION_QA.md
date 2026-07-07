# Testes Massivos de Simulação — Etapa E

## 1. Objetivo

Rodar simulações em lote para testar plausibilidade.

Uma única partida pode ser exceção. Cem partidas mostram tendência.

---

## 2. Matriz inicial

Confrontos sugeridos:

```text
Brazil 2002 x Germany 2014
Argentina 1986 x France 1998
Spain 2010 x Italy 2006
Brazil 1994 x Argentina 2022
France 2018 x Brazil 2002
Netherlands 1974 x Spain 2010
```

---

## 3. Métricas agregadas

Para cada confronto:

```text
runs
avg_goals_total
avg_xg_total
avg_shots_total
avg_shots_on_target_total
avg_corners_total
avg_cards_total
avg_fouls_total
team_a_win_rate
draw_rate
team_b_win_rate
top_event_types
quality_flags
```

---

## 4. Critérios de alerta

```text
avg_goals_total > 4.0 → alerta de placar inflado
avg_goals_total < 1.2 → alerta de placar travado
avg_shots_total > 36 → excesso de volume
avg_shots_total < 12 → baixo volume
avg_xg_total > 4.5 → chances claras demais
avg_xg_total < 1.2 → criação insuficiente
goals_without_shot > 0 → erro crítico
invalid_player_reference > 0 → erro crítico
```

---

## 5. Resultado esperado

O batch runner deve gerar um relatório JSON:

```text
test_run_id
fixture_id
runs
aggregate_metrics
quality_result
recommendations
```

---

## 6. Uso prático

Antes de publicar uma release com o novo motor:

```text
[ ] rodar testes em lote
[ ] revisar alertas
[ ] ajustar probabilidades
[ ] rodar novamente
[ ] aprovar só quando as faixas estiverem plausíveis
```
