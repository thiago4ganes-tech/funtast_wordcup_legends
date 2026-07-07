# Regras de Qualidade — WCHD Etapa B

## 1. Princípio

A Etapa B não pode fabricar certeza a partir de ausência de dados.

Quando um dado for desconhecido, usar `null`, não zero.

---

## 2. Regras obrigatórias

### RQB-001 — Zero diferente de desconhecido

Se um jogador não teve assistência registrada porque a fonte não fornece assistências, usar:

```json
{
  "assists": null,
  "assist_data_available": false
}
```

Não usar:

```json
{
  "assists": 0
}
```

a menos que a fonte confirme zero assistências.

---

### RQB-002 — Métrica derivada exige base

Toda métrica calculada deve ter campos de base suficientes.

Exemplo:

```text
goals_per_90 só pode existir se goals e minutes forem conhecidos.
```

---

### RQB-003 — Confiança herdada

A confiança da métrica não pode ser maior que a confiança dos dados que a alimentam.

Exemplo:

```text
gols confiança A + minutos confiança C = goals_per_90 confiança C
```

---

### RQB-004 — Head-to-head com peso limitado

Confrontos diretos entre países devem ter `weight_cap`.

---

### RQB-005 — Sinergia factual sem interpretação excessiva

Minutos juntos e titularidades juntos não bastam para afirmar "sinergia criativa" ou "dupla letal".

A Etapa B pode medir convivência.  
A interpretação tática será feita na Etapa C/D.

---

### RQB-006 — Métricas de mata-mata separadas

Jogos de mata-mata devem ser marcados separadamente.

Campos obrigatórios:

```text
is_knockout
is_semifinal
is_final
```

---

### RQB-007 — Campanha sem adversário fraco/forte sem critério

Força do adversário deve ser calculada por fórmula documentada, não por reputação manual.

---

## 3. Alertas obrigatórios

O validador deve alertar quando:

- jogador tem gols, mas minutos desconhecidos;
- time tem partidas sem placar;
- seleção tem gols pró incompatíveis com soma de gols;
- `assists` está como zero sem confirmação de fonte;
- sinergia calculada com minutos estimados de baixa confiança;
- head-to-head tem peso acima do permitido.
