# Dicionário do Production Data Pack — G4

## 1. `wchd_players_production.json`

Registro final por jogador-Copa.

Contém:

```text
identidade real estruturada
métricas reais/derivadas
estimativas técnicas
origem por bloco
limite de peso no motor
```

## 2. `wchd_teams_production.json`

Registro final por seleção-Copa.

Contém:

```text
identidade real estruturada
métricas reais/derivadas
estimativas de estilo coletivo
origem por bloco
```

## 3. `wchd_matches_production.json`

Registro final por partida.

Contém:

```text
partida
placar
gols
cartões
substituições
pênaltis
```

## 4. `wchd_synergies_production.json`

Registro final por par de jogadores.

Contém:

```text
minutos compartilhados estimados
titularidades conjuntas
gols do time com ambos em campo
tipo de sinergia estimada
score de sinergia estimado
```

## 5. `wchd_legion_inputs.json`

Arquivo otimizado para o motor.

Contém:

```text
players
teams
synergies
head_to_head
coverage_weighted
```

Este deve ser o principal arquivo consultado na integração da Release 0.4.
