# WCHD — Etapa B: Métricas Históricas Observadas

## 1. Objetivo

A Etapa B transforma a base estrutural da Etapa A em indicadores históricos observáveis.

Ela responde:

> Como uma seleção performou em uma Copa?  
> Como um jogador performou naquela Copa?  
> Quais jogadores atuaram juntos?  
> Como uma seleção performou em mata-mata?  
> Qual foi a força dos adversários enfrentados?  
> Quais confrontos entre países têm histórico em Copas?

A Etapa B ainda não decide que um jogador tem `finalização 94` ou `visão 91`.  
Ela prepara evidências para que a Etapa C faça isso com método.

---

## 2. Entrada esperada

A Etapa B depende dos arquivos normalizados da Etapa A:

```text
data/normalized/world_cups.json
data/normalized/countries.json
data/normalized/team_world_cup.json
data/normalized/matches.json
data/normalized/player_base.json
data/normalized/player_world_cup.json
data/normalized/squad_membership.json
data/normalized/player_match_appearance.json
data/normalized/goals.json
data/normalized/bookings.json
data/normalized/substitutions.json
data/normalized/penalty_kicks.json
```

---

## 3. Saída da Etapa B

A Etapa B gera arquivos derivados:

```text
data/derived/team_wc_metrics.json
data/derived/player_wc_metrics.json
data/derived/player_match_metrics.json
data/derived/player_pair_minutes.json
data/derived/head_to_head_metrics.json
data/derived/opponent_strength_metrics.json
data/derived/knockout_metrics.json
```

---

## 4. Métricas de seleção-Copa

Uma linha por seleção em uma Copa.

Exemplo:

```text
team_brazil_2002
team_france_1998
team_argentina_1986
```

Métricas principais:

- jogos;
- vitórias;
- empates;
- derrotas;
- gols pró;
- gols contra;
- saldo;
- gols por jogo;
- gols sofridos por jogo;
- aproveitamento;
- desempenho em mata-mata;
- clean sheets;
- jogos sem marcar;
- dificuldade média dos adversários;
- índice ofensivo observado;
- índice defensivo observado;
- índice de campanha.

---

## 5. Métricas jogador-Copa

Uma linha por jogador em uma Copa.

Métricas principais:

- minutos;
- jogos;
- titularidades;
- gols;
- assistências, quando disponíveis;
- participação em gols;
- gols por 90;
- participação em gols por 90;
- share de gols do time;
- minutos em mata-mata;
- gols em mata-mata;
- gols em final/semifinal;
- cartões;
- pênaltis cobrados;
- pênaltis convertidos;
- importância estrutural no time.

---

## 6. Métricas de minutos compartilhados

Uma linha por dupla de jogadores na mesma seleção-Copa.

Exemplo:

```text
Ronaldo 2002 + Rivaldo 2002
Xavi 2010 + Iniesta 2010
Romário 1994 + Bebeto 1994
```

Métricas:

- partidas juntos;
- titularidades juntos;
- minutos compartilhados estimados;
- gols do time com ambos em campo;
- gols diretos envolvendo ambos, quando disponível;
- grau factual de sinergia.

Essa camada é factual.  
A interpretação tática da sinergia virá depois.

---

## 7. Head-to-head

Uma linha por par de países em Copas.

Exemplo:

```text
Brazil x France
Argentina x Germany
Italy x Germany
```

Métricas:

- partidas;
- vitórias de A;
- vitórias de B;
- empates;
- gols A;
- gols B;
- mata-mata;
- finais;
- tamanho da amostra;
- peso máximo permitido.

Regra importante: histórico direto terá peso baixo no LEGION quando a amostra for pequena.

---

## 8. Força de adversários

A Etapa B cria uma primeira métrica de dificuldade dos adversários.

A ideia não é criar um ranking absoluto perfeito, mas evitar que duas campanhas sejam avaliadas igual quando enfrentaram dificuldades muito diferentes.

Fatores iniciais:

- fase em que o adversário terminou;
- se o adversário era campeão, vice, semifinalista ou quartofinalista;
- saldo de gols do adversário;
- aproveitamento do adversário;
- desempenho defensivo/ofensivo do adversário.

---

## 9. Saída para o LEGION

A Etapa B não alimenta diretamente a árvore de eventos.  
Ela alimenta a Etapa C, que converterá métricas em atributos e modificadores.

Fluxo:

```text
Etapa A — fatos estruturais
↓
Etapa B — métricas históricas observadas
↓
Etapa C — atributos derivados e modificadores LEGION
↓
Etapa D — simulação calibrada
```
