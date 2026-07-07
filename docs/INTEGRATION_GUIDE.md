# Guia de Integração — Etapa E

## 1. Estratégia recomendada

Não substituir `js/eventGraph.js` diretamente no primeiro commit.

Criar um modo novo:

```text
LEGION_CALIBRATED_MODE
```

Assim o jogo consegue alternar entre:

```text
legacy
calibrated
comparison
```

---

## 2. Ordem de integração

### Passo 1 — Copiar arquivos

Copiar:

```text
js/legion/
data/legion/
docs/
tools/
tests/
```

### Passo 2 — Carregar bridge

Adicionar no HTML ou no módulo principal, conforme a estrutura do projeto:

```text
js/legion/legionIntegrationBridge.js
```

### Passo 3 — Adaptar times do jogo

O jogo atual deve transformar seus jogadores para o padrão:

```json
{
  "player_wc_id": "player_ronaldo_nazario_2002",
  "player_base_id": "player_ronaldo_nazario",
  "name": "Ronaldo",
  "slot": "CA",
  "team_wc_id": "team_brazil_2002"
}
```

### Passo 4 — Rodar simulação calibrada

Chamada conceitual:

```js
simulateCalibratedMatch({
  userTeam,
  opponentTeam,
  evidenceData,
  config
})
```

### Passo 5 — Converter eventos para UI

O motor retorna eventos técnicos. A UI recebe eventos narráveis:

```text
minute
text
type
importance
team
actor
score_after_event
```

### Passo 6 — Conferir qualidade

Rodar quality gate:

```js
evaluateMatchQuality(matchResult, thresholds)
```

---

## 3. Fallback

Se o motor calibrado falhar:

```text
usar legacy engine
registrar erro em console
não quebrar a experiência do usuário
```

---

## 4. Ponto de atenção

Nem todo jogador atual tem `player_wc_id` compatível com a nova estrutura. Enquanto a base completa não estiver populada, o bridge deve aceitar fallback por nome, seleção e ano, com confiança reduzida.
