# WCHD — Etapa E: Integração, Telemetria e Testes Massivos

## 1. Objetivo

A Etapa E integra o motor calibrado ao jogo de forma controlada.

Ela responde:

> O novo LEGION consegue ser conectado ao jogo atual sem quebrar montagem de elenco, narração, placar, notas e relatório final?

Também responde:

> O motor produz resultados plausíveis quando rodamos dezenas ou centenas de simulações?

---

## 2. Princípios

### 2.1 Não trocar o motor no escuro

O motor calibrado deve entrar primeiro como modo técnico:

```text
simulation_mode: legacy | calibrated | comparison
```

- `legacy`: motor atual;
- `calibrated`: novo LEGION;
- `comparison`: roda os dois para comparação interna.

### 2.2 Estatística antes de sensação

Uma simulação isolada pode enganar. A Etapa E exige teste em lote.

### 2.3 Integração reversível

A integração deve permitir rollback simples.

---

## 3. Entradas

A Etapa E recebe:

```text
userTeam
opponentTeam
selectedFormation
difficulty
matchContext
player_derived_attributes
team_derived_profiles
player_legion_modifiers
team_legion_modifiers
event_base_probabilities
context_modifiers
```

---

## 4. Saídas

A Etapa E deve devolver uma partida completa:

```text
score
events
narrationEvents
teamStats
playerStats
playerRatings
telemetry
matchReport
qualityFlags
```

---

## 5. Qualidade técnica esperada

A integração precisa garantir:

- placar não aparece antes da sequência de eventos;
- gols nascem de eventos de finalização;
- xG nasce das chances;
- narração corresponde ao evento;
- relatório final corresponde às estatísticas;
- jogadores envolvidos existem nas escalações;
- notas dos jogadores variam conforme participação;
- nenhum erro silencioso em dados ausentes.

---

## 6. Resultado esperado

Ao final da Etapa E, teremos uma base para a próxima release jogável:

```text
Release 0.4 — LEGION Historical Evidence Integration
```

A Etapa E ainda é principalmente técnica, mas já prepara a integração real.
