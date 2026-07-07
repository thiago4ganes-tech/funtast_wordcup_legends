# Playbook de Calibração — LEGION Etapa F

## 1. Sequência recomendada

A calibração deve seguir esta ordem:

```text
1. Volume de posses relevantes
2. Volume de finalizações
3. Qualidade das chances / xG
4. Conversão de gols
5. Distribuição de eventos
6. Participação dos jogadores certos
7. Estilos das seleções
8. Relatório e narração
```

Não calibrar tudo ao mesmo tempo.

---

## 2. Sintoma: placar alto demais

Sinais:

```text
muitos jogos 4x3, 5x2, 6x4
gols por jogo > limite superior
xG total muito alto
chance clara demais
```

Ajustes:

```text
reduzir possessions_per_match
reduzir box_shot base goal probability
aumentar blocked/save/miss
reduzir through_ball → box_shot
aumentar recycle_possession
reduzir modificadores máximos de finalização
```

---

## 3. Sintoma: jogo travado demais

Sinais:

```text
muitos 0x0
poucas finalizações
xG baixo
muitos turnovers/interceptions
```

Ajustes:

```text
aumentar progressão central/lateral
aumentar cutback/cross/through_ball
reduzir interceptions automáticas
aumentar final_third_entries
aumentar variação de cadeias
```

---

## 4. Sintoma: jogadores errados protagonizando

Sinais:

```text
zagueiro finaliza mais que atacante
volante defensivo aparece como principal criador
goleiro sem defesas em jogos com chutes no alvo
```

Ajustes:

```text
revisar role_weight
revisar player selection by event
aumentar peso de primary_position_wc
reduzir aleatoriedade na seleção de ator
```

---

## 5. Sintoma: estilos iguais

Sinais:

```text
Brasil 2002, Espanha 2010 e Itália 2006 jogam igual
mesmo volume de cruzamentos
mesmo padrão de transição
```

Ajustes:

```text
aumentar team profile modifiers
aplicar tactical_styles
calibrar event_chain_templates por perfil
adicionar style affinity por seleção
```

---

## 6. Sintoma: xG não conversa com placar

Sinais:

```text
time vence 4x0 com xG 0.8 frequentemente
time perde sempre com xG muito superior
```

Ajustes:

```text
revisar base_xg por tipo de finalização
revisar conversion clamp
revisar rebotes
separar chance comum de chance clara
```

---

## 7. Ordem de aprovação

A calibração só deve ser considerada estável quando:

```text
estatística básica OK
xG OK
protagonismo OK
estilo OK
narração/relatório OK
```
