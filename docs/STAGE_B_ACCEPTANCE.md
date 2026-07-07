# Checklist de Aceite — WCHD Etapa B

A Etapa B estará concluída quando:

## 1. Métricas de seleção

```text
[ ] team_wc_metrics gerado
[ ] Todas as seleções-Copa têm jogos, gols pró e gols contra
[ ] Gols por jogo calculados
[ ] Gols sofridos por jogo calculados
[ ] Métricas de mata-mata separadas
[ ] Índice ofensivo observado calculado
[ ] Índice defensivo observado calculado
[ ] Índice de campanha calculado
```

## 2. Métricas de jogador

```text
[ ] player_wc_metrics gerado
[ ] Jogadores com minutos válidos têm goals_per_90
[ ] Participação em gols calculada com tratamento de assistências desconhecidas
[ ] Gols em mata-mata separados
[ ] Gols em final/semifinal separados
[ ] Cartões consolidados
[ ] Pênaltis consolidados
```

## 3. Sinergia factual

```text
[ ] player_pair_minutes gerado
[ ] Duplas por seleção-Copa identificadas
[ ] Minutos compartilhados calculados quando possível
[ ] Titularidades conjuntas calculadas
[ ] Confiança da sinergia registrada
```

## 4. Head-to-head

```text
[ ] head_to_head_metrics gerado
[ ] Confrontos país x país consolidados
[ ] Amostra calculada
[ ] Weight cap calculado
```

## 5. Qualidade

```text
[ ] Zero e desconhecido tratados corretamente
[ ] Métricas sem base suficiente retornam null
[ ] Confiança das métricas documentada
[ ] Validador executado sem erro crítico
```
