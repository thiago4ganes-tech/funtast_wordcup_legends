# Regras de Qualidade — WCHD Etapa A

## 1. Objetivo

Garantir que a base estrutural seja confiável antes de alimentar o LEGION.

---

## 2. Níveis de confiança

| Nível | Significado | Exemplo |
|---|---|---|
| A | Oficial ou estruturalmente validado | placar, data, fase, gols oficiais |
| B | Fonte confiável, mas com possível necessidade de conferência | assistências, minutos antigos |
| C | Estimativa baseada em evidências parciais | posição exata em jogo antigo |
| D | Provisório/manual | função tática interpretativa |

---

## 3. Regras obrigatórias

### RQ-001 — IDs únicos
Todo registro deve ter `id` único.

### RQ-002 — Fonte obrigatória
Todo registro deve ter `source_primary` e `source_confidence`.

### RQ-003 — Jogador-copa com atleta-base
Todo `player_world_cup` precisa apontar para `player_base_id`.

### RQ-004 — Partida com dois times
Todo `match` precisa ter `team_home_id` e `team_away_id`.

### RQ-005 — Evento com partida
Todo gol, cartão, substituição e pênalti precisa ter `match_id`.

### RQ-006 — Seleção-Copa com país e ano
Todo `team_world_cup` deve ter `country_id` e `year`.

### RQ-007 — Elenco mínimo
Uma seleção-Copa deve ser marcada como completa apenas quando tiver preferencialmente 23 jogadores.

### RQ-008 — Duplicidade de atleta
O mesmo atleta-base pode aparecer em várias Copas, mas não pode ser duplicado indevidamente dentro da mesma seleção-Copa.

### RQ-009 — Versões bloqueáveis
O campo `player_base_id` deve permitir que o jogo bloqueie outras versões do mesmo atleta durante a montagem do elenco.

### RQ-010 — Partidas consistentes
A soma de gols registrados em `goals` deve ser compatível com o placar da partida, quando os dados de gols estiverem completos.

---

## 4. Indicadores de qualidade

| Indicador | Fórmula | Meta |
|---|---|---|
| Cobertura de squads | jogadores cadastrados / jogadores esperados | >= 95% |
| Cobertura de partidas | partidas cadastradas / partidas oficiais | 100% |
| Cobertura de gols | gols cadastrados / gols oficiais | >= 95% |
| Cobertura de cartões | cartões cadastrados / cartões oficiais | >= 90% |
| Integridade de IDs | registros válidos / registros totais | 100% |
| Registros com fonte | registros com fonte / registros totais | 100% |
