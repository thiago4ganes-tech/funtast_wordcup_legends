# Mapeamento de Eventos para Narração — Etapa E

## 1. Objetivo

Transformar evento técnico em texto de transmissão esportiva.

---

## 2. Entrada do narrador

```json
{
  "minute": 34,
  "event_type": "through_ball",
  "outcome": "box_shot",
  "actor": "Rivaldo",
  "support_actor": "Ronaldo",
  "team": "Brazil 2002",
  "importance": "high"
}
```

---

## 3. Saída

```text
34' Rivaldo recebe entre linhas, levanta a cabeça e encontra Ronaldo atacando o espaço. A defesa tenta fechar, mas o passe entra limpo.
```

---

## 4. Classes de intensidade

```text
low — circulação, disputa, recuperação
medium — progressão, cruzamento, falta perigosa
high — chance clara, defesa difícil, bola na trave
goal — gol
critical — pênalti, expulsão, lance final
```

---

## 5. Regra de variação

O narrador deve variar por:

```text
event_type
outcome
zone
minute
score_state
importance
```

---

## 6. Regra de originalidade

A narração deve soar como transmissão de futebol, mas não copiar bordões reais de narradores.
