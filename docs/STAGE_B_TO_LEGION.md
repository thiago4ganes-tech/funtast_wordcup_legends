# Como a Etapa B alimentará o LEGION

## 1. Papel da Etapa B

A Etapa B cria métricas históricas.  
Essas métricas ainda não são atributos finais do jogo.

Exemplo:

```text
Ronaldo 2002:
- goals = 8
- goals_per_90 = X
- team_goal_share = Y
- knockout_goals = Z
```

Na Etapa C, isso poderá virar:

```text
finishing
clutch
composure
box_presence
```

---

## 2. Exemplos de uso futuro

### 2.1 Ataque coletivo

```text
team.attack_observed_index
```

Poderá influenciar:

- volume de ações ofensivas;
- qualidade média da progressão;
- frequência de chances claras.

### 2.2 Defesa coletiva

```text
team.defense_observed_index
```

Poderá influenciar:

- bloqueios;
- interceptações;
- dificuldade de o adversário gerar xG;
- capacidade de proteger vantagem.

### 2.3 Protagonismo do jogador

```text
player.team_goal_share
player.knockout_goals
player.minutes_share
```

Poderá influenciar:

- frequência de aparecer em lances-chave;
- chance de receber bola em zona decisiva;
- bônus contextual em mata-mata.

### 2.4 Sinergia factual

```text
pair.shared_minutes_estimated
pair.starts_together
pair.direct_goal_combinations
```

Poderá influenciar:

- passes entre jogadores;
- combinações ofensivas;
- melhor decisão em jogadas conhecidas.

### 2.5 Head-to-head

```text
head_to_head.weight_cap
```

Poderá influenciar levemente:

- confiança;
- pressão histórica;
- narrativa;
- contexto psicológico.

Nunca deve dominar o resultado.

---

## 3. Regra de governança

O LEGION não deve consultar dados brutos diretamente durante a partida.

Fluxo correto:

```text
dados brutos → métricas → atributos/modificadores → eventos
```

Isso melhora desempenho, rastreabilidade e controle metodológico.
