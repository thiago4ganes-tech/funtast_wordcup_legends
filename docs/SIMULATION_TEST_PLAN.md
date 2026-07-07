# Plano de Testes de Simulação — Etapa D

## 1. Objetivo

Validar se o Event Graph calibrado produz futebol plausível.

---

## 2. Confrontos fixos

Rodar no mínimo 100 simulações por confronto.

```text
Brazil 2002 x Germany 2014
Argentina 1986 x France 1998
Spain 2010 x Italy 2006
Brazil 1994 x Argentina 2022
France 2018 x Brazil 2002
Netherlands 1974 x Spain 2010
```

---

## 3. Métricas por lote

Para cada confronto:

```text
win_rate_team_a
draw_rate
win_rate_team_b
avg_goals_team_a
avg_goals_team_b
avg_xg_team_a
avg_xg_team_b
avg_shots
avg_shots_on_target
avg_cards
avg_corners
top_scorers
top_assisters
most_involved_players
event_distribution
```

---

## 4. Sinais de problema

### 4.1 Placar inflado

```text
muitos jogos 5x4, 6x3, 7x2
```

Correção:

- reduzir volume de chances claras;
- reduzir conversão;
- aumentar eventos de bloqueio, erro e posse reciclada.

### 4.2 Placar travado

```text
muitos 0x0 e 1x0 sem xG
```

Correção:

- aumentar progressão;
- aumentar cutbacks/through balls;
- reduzir interceptações automáticas.

### 4.3 Jogadores errados protagonizando

```text
volante defensivo finaliza mais que centroavante histórico
```

Correção:

- revisar seleção de atores por função;
- aumentar peso de role suitability;
- reduzir aleatoriedade na escolha de finalizador.

### 4.4 Estilos iguais

```text
Espanha 2010 e Brasil 2002 se comportam igual
```

Correção:

- aumentar peso de team profiles;
- revisar tactical_styles.json.

---

## 5. Critério de aceite

A Etapa D é aceita quando:

```text
[ ] Placar médio plausível
[ ] Volume de finalizações plausível
[ ] xG plausível
[ ] Jogadores decisivos aparecem em ações compatíveis
[ ] Estilos das seleções são reconhecíveis
[ ] Repetição de lances reduzida
[ ] Relatório consegue explicar padrões do jogo
```
