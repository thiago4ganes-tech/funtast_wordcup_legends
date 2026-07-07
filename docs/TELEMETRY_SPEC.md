# Especificação de Telemetria — Etapa E

## 1. Objetivo

Guardar os dados necessários para entender a partida.

A telemetria não é para o jogador final ver tudo. É para calibrar o motor.

---

## 2. Telemetria por evento

Cada evento deve registrar:

```text
event_id
chain_id
minute
team_wc_id
opponent_team_wc_id
event_type
outcome
actor_wc_id
support_actor_wc_id
defender_wc_id
goalkeeper_wc_id
zone
xg_delta
probability_snapshot
modifiers_applied
quality_flags
```

---

## 3. Telemetria por jogador

```text
player_wc_id
touches_in_events
shots
goals
assists
key_passes
crosses
defensive_actions
errors
rating_delta
```

---

## 4. Telemetria por time

```text
team_wc_id
goals
xg
shots
shots_on_target
crosses
dribbles
corners
fouls
cards
turnovers
final_third_entries
territorial_control
```

---

## 5. Uso no relatório

O relatório final deve ler:

```text
padrões recorrentes
tipos de chance
corredor mais usado
jogadores mais acionados
duelos críticos
eficiência vs xG
```

---

## 6. Uso na calibração

A telemetria permite responder:

- o motor está gerando chute demais?
- o xG está exagerado?
- os gols estão saindo de eventos válidos?
- laterais cruzam demais?
- jogadores sem perfil ofensivo estão finalizando demais?
- os goleiros têm impacto plausível?
