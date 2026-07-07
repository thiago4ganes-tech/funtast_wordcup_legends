# Suíte de Regressão — LEGION Etapa F

## 1. Objetivo

Garantir que mudanças no motor não quebrem comportamentos já aprovados.

---

## 2. Testes fixos

Cada teste deve rodar com seed fixa e também em lote.

### Teste 1 — Brasil 2002 x Alemanha 2014

Verificar:

```text
Brasil tem transição e ataque forte
Alemanha tem pressão e eficiência coletiva
placares variam, mas sem goleadas constantes
Ronaldo/Rivaldo/Ronaldinho aparecem em lances ofensivos
```

### Teste 2 — Espanha 2010 x Itália 2006

Verificar:

```text
Espanha controla posse
Itália reduz xG adversário
jogo tende a menor placar
meio-campo participa mais
```

### Teste 3 — Argentina 1986 x França 1998

Verificar:

```text
jogador-chave da Argentina participa da criação
França tem defesa forte
jogo permite momentos de desequilíbrio individual
```

### Teste 4 — Brasil 1994 x Argentina 2022

Verificar:

```text
Brasil 1994 mais pragmático
Argentina 2022 com protagonismo ofensivo específico
partida equilibrada
```

---

## 3. Testes de integridade

```text
gol sempre incrementa placar
gol sempre nasce de finalização ou pênalti
defesa do goleiro gera shot_on_target
xG aumenta apenas em finalização
cartão não nasce sem falta/evento disciplinar
relatório final usa estatísticas existentes
```

---

## 4. Testes de não regressão visual

```text
campo tático continua carregando
seleção de jogador continua funcionando
orçamento continua funcionando
modal de opções continua funcionando
narração continua aparecendo
alerta de gol continua funcionando
```

---

## 5. Saída esperada

Cada lote deve gerar:

```text
fixture_id
runs
pass_rate
critical_failures
warning_count
metric_summary
recommended_adjustments
```
