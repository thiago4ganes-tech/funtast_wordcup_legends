# Quality Gate Estatístico — LEGION Etapa F

## 1. Objetivo

Definir limites objetivos para aprovar ou reprovar o motor.

---

## 2. Métricas obrigatórias

| Métrica | Mínimo | Máximo | Observação |
|---|---:|---:|---|
| avg_total_goals | 1.6 | 3.4 | média por jogo |
| avg_total_xg | 1.6 | 3.8 | soma dos dois times |
| avg_total_shots | 16 | 32 | finalizações totais |
| avg_shots_on_target | 5 | 13 | finalizações no alvo |
| avg_corners | 4 | 12 | escanteios |
| avg_cards | 1 | 6 | cartões |
| penalty_goal_rate | 0.68 | 0.82 | conversão de pênaltis |
| own_goal_frequency | 0.00 | 0.04 | raro |
| blowout_rate | 0.00 | 0.12 | goleadas muito frequentes são problema |

---

## 3. Métricas de distribuição de eventos

| Evento | Regra |
|---|---|
| build_up | deve existir em jogos de posse |
| transition_attack | deve crescer em times de transição |
| cross | deve crescer em times de jogo lateral/aéreo |
| long_shot | não pode dominar volume ofensivo |
| penalty | deve ser raro |
| red_card | deve ser raro |

---

## 4. Critérios de reprovação automática

```text
avg_total_goals > 4.0
avg_total_goals < 1.0
avg_total_xg > 4.5
avg_total_xg < 1.0
avg_total_shots > 38
avg_total_shots < 10
penalty_frequency > 0.25 por jogo
red_card_frequency > 0.35 por jogo
```

---

## 5. Aprovação

O motor é aprovado quando:

```text
80% ou mais dos confrontos passam nos limites principais
100% passam nos limites críticos
nenhum bug estrutural é detectado
nenhum relatório contradiz os eventos simulados
```
