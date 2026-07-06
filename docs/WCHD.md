# WCHD — World Cup Historical Database

O WCHD é o banco histórico do Fantasy World Cup Legends.

## Unidade principal
Jogador + Seleção + Copa.

Exemplo:
- Ronaldo 2002
- Ronaldo 1998
- Messi 2014
- Messi 2022

## Campos mínimos do jogador
- id
- athleteId
- name
- country
- flag
- year
- position
- positions
- classIcon
- className
- price
- skills
- traits
- tendencies

## Campos mínimos da seleção
- id
- name
- country
- flag
- year
- dna

## Regra de duplicidade
Se uma versão de um atleta for escolhida, as demais versões ficam indisponíveis no mesmo XI.
