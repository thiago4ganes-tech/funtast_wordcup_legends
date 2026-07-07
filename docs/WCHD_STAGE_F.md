# WCHD — Etapa F: Calibração Fina e Release Candidate

## 1. Objetivo

A Etapa F fecha o ciclo metodológico iniciado na Etapa A.

Ela responde:

> O motor calibrado está pronto para virar uma release jogável?

A resposta só pode ser "sim" se o motor demonstrar:

- placares plausíveis;
- volume de chances plausível;
- xG coerente;
- participação correta de jogadores-chave;
- estilos diferentes entre seleções;
- narração coerente com eventos;
- relatório final sustentado por estatísticas reais;
- ausência de regressões críticas.

---

## 2. O que a Etapa F não faz

A Etapa F ainda não é a Release 0.4 integrada no site.  
Ela é o pacote de governança técnica para aprovar essa integração.

A Release 0.4 deve vir depois com os arquivos do jogo atual alterados.

---

## 3. Entradas

A Etapa F depende de:

```text
Etapa C:
data/derived/player_derived_attributes.json
data/derived/team_derived_profiles.json
data/derived/player_legion_modifiers.json
data/derived/team_legion_modifiers.json

Etapa D:
data/legion/event_base_probabilities.json
data/legion/event_outcome_matrix.json
data/legion/context_modifiers.json
data/legion/event_chain_templates.json

Etapa E:
telemetria de simulação
batch runner
quality gate
```

---

## 4. Saídas

```text
calibration_targets
calibration_weights
quality_gate_results
regression_results
release_candidate_manifest
release_candidate_checklist
```

---

## 5. Critério central

O motor deve ser aprovado em lote, não por uma partida isolada.

Uma simulação pode gerar um jogo atípico.  
Cem simulações não podem gerar um padrão ruim.

---

## 6. Grupos de validação

### 6.1 Sanidade estatística

- gols por jogo;
- finalizações;
- finalizações no alvo;
- xG;
- escanteios;
- cartões;
- faltas;
- posse/fases de posse;
- tipos de lance.

### 6.2 Sanidade tática

- times de transição atacam em transição;
- times de posse circulam mais;
- times fortes pelo alto cruzam mais;
- defesas fortes reduzem xG adversário.

### 6.3 Sanidade de protagonismo

- atacantes finalizam mais que zagueiros;
- criadores participam de passes-chave;
- goleiros aparecem em defesas;
- jogadores históricos aparecem em lances compatíveis.

### 6.4 Sanidade de narrativa

- gol nasce de finalização;
- xG acompanha qualidade das chances;
- relatório explica padrões reais;
- narração não contradiz estatística.

---

## 7. Resultado esperado

Ao final da Etapa F, devemos ter uma decisão objetiva:

```text
APROVADO PARA RELEASE 0.4
ou
REPROVADO — REQUER RECALIBRAÇÃO
```
