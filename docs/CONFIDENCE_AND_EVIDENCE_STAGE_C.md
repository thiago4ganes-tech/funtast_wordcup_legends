# Confiança e Evidência — WCHD Etapa C

## 1. Princípio

Atributos e modificadores precisam ser rastreáveis.

Cada registro deve informar:

```text
evidence_fields
formula_id
confidence_level
method_note
```

---

## 2. Herança de confiança

A confiança do atributo deve seguir o pior componente relevante.

Exemplo:

```text
goals_per_90: A
team_goal_share: A
assist_component: D
```

Se a fórmula depende fortemente de assistências, o atributo não deve ser A.

---

## 3. Teto por confiança

| Confiança | Teto |
|---|---:|
| A | 99 |
| B | 94 |
| C | 88 |
| D | 82 |

Isso impede que dado fraco gere nota histórica extrema.

---

## 4. Fallbacks permitidos

### 4.1 Fallback por posição

Usado quando estatísticas diretas não existem.

Exemplo:

```text
zagueiro titular de defesa campeã recebe base defensiva acima da média.
```

Confiança máxima: C ou B, dependendo da completude.

### 4.2 Fallback por perfil coletivo

Usado quando o time tem métrica coletiva forte e o jogador teve minutos relevantes.

Exemplo:

```text
volante titular em defesa com poucos gols sofridos.
```

Confiança máxima: B.

### 4.3 Fallback por consenso documentado

Usado apenas com nota metodológica.

Exemplo:

```text
função tática amplamente reconhecida, mas sem dado granular.
```

Confiança máxima: C.

---

## 5. Fallbacks proibidos

Não é permitido:

- dar nota alta só por fama;
- inferir assistência como zero quando a fonte não tem assistência;
- atribuir competência psicológica sem gatilho;
- fazer jogador antigo parecer menos capaz apenas por falta de dados;
- fazer jogador recente parecer melhor apenas por ter mais estatísticas disponíveis.

---

## 6. Competências candidatas

A Etapa C pode gerar candidatos a competências, mas não ativá-las automaticamente.

Exemplo:

```json
{
  "player_wc_id": "player_x",
  "competency_candidate": "cresce_em_jogo_grande",
  "evidence": ["knockout_goals", "final_goals"],
  "confidence_level": "B",
  "status": "candidate_pending_review"
}
```

A ativação final deve ser feita depois, com regra e revisão.
