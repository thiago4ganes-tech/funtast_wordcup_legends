# WCHD — Etapa A: Base Estrutural

## 1. Objetivo

Construir uma base factual, normalizada e auditável para o **Fantasy World Cup Legends**.

A Etapa A responde:

> Quem jogou, por qual seleção, em qual Copa, contra quem, em qual fase, em qual minuto e quais eventos oficiais ocorreram?

Ela não cria ainda atributos técnicos finais, competências psicológicas, preços, classes, sinergias interpretativas ou árvore de probabilidades do LEGION. Esses itens virão depois, derivados da base factual.

---

## 2. Escopo

### Período principal

Copa do Mundo Masculina FIFA de **1986 até a edição mais recente consolidada**.

A estrutura, porém, deve aceitar Copas desde 1930 para expansão futura.

### Unidade central do projeto

A unidade principal do jogo será:

```text
Jogador + Seleção + Copa
```

Exemplos:

```text
player_lionel_messi_2014
player_lionel_messi_2022
player_ronaldo_nazario_2002
```

Isso permite que cada versão histórica tenha atributos próprios.

---

## 3. Camadas de dados

### 3.1 Raw

Dados brutos vindos das fontes, com mínima alteração.

### 3.2 Normalized

Dados limpos e convertidos para o padrão interno do WCHD.

### 3.3 Derived

Não faz parte da Etapa A. Será a fase seguinte, onde criaremos indicadores, atributos e competências.

---

## 4. Entidades obrigatórias

1. `world_cups` — uma linha por Copa.
2. `countries` — uma linha por país normalizado.
3. `team_world_cup` — uma linha por seleção em uma Copa.
4. `matches` — uma linha por partida.
5. `player_base` — uma linha por atleta único.
6. `player_world_cup` — uma linha por atleta em uma Copa específica.
7. `squad_membership` — relação entre jogador e convocação.
8. `player_match_appearance` — aparição do jogador em uma partida.
9. `goals` — gols da partida.
10. `bookings` — cartões.
11. `substitutions` — substituições.
12. `penalty_kicks` — pênaltis durante o jogo ou disputa.

---

## 5. Regras essenciais

1. Todo jogador-copa deve apontar para um atleta-base.
2. Toda seleção-Copa deve apontar para país e ano.
3. Toda partida deve ter dois times.
4. Todo gol/cartão/substituição/pênalti deve apontar para uma partida.
5. Todo registro deve ter fonte e nível de confiança.
6. O mesmo atleta-base pode ter várias versões históricas, mas apenas uma versão pode ser escolhida por elenco no jogo.
7. Uma seleção-Copa só deve entrar no modo completo quando tiver elenco suficiente.

---

## 6. Resultado esperado da Etapa A

Ao final, o projeto deve conseguir responder consultas como:

```text
Quais jogadores foram convocados pelo Brasil em 2002?
Quem jogou a final de 1998?
Quantos gols Ronaldo fez em mata-mata em 2002?
Quais jogadores atuaram juntos por mais minutos?
Quais confrontos aconteceram entre Brasil e França em Copas?
Quais seleções chegaram à semifinal desde 1986?
```
