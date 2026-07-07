# Integração com Narração — Etapa D

## 1. Princípio

A narração deve nascer do evento, não ser frase solta.

Cada evento deve enviar para o narrador:

```text
event_type
minute
team
actor
support_actor
defender
goalkeeper
zone
pressure
outcome
xg
importance
```

---

## 2. Tom de transmissão

As frases devem soar como transmissão esportiva, mas sem copiar bordões reais.

Exemplo:

Evento:

```json
{
  "event_type": "through_ball",
  "actor": "Rivaldo",
  "support_actor": "Ronaldo",
  "outcome": "box_shot"
}
```

Narração:

```text
Rivaldo recebe entre linhas, levanta a cabeça e acha Ronaldo atacando o espaço. A defesa tenta fechar, mas o passe quebra a última linha.
```

---

## 3. Intensidade por importância

### Lance comum

```text
A jogada se desenvolve pelo meio, mas a defesa recompõe e força o passe para trás.
```

### Lance perigoso

```text
A bola entra limpa nas costas da marcação. O atacante domina já dentro da área e prepara a batida.
```

### Gol

```text
GOL! A jogada encaixa no momento certo. Passe no espaço, finalização firme e bola no fundo da rede.
```

---

## 4. Variação

O narrador deve variar por:

```text
event_type
zone
outcome
importance
score_state
minute
player_class
```

---

## 5. Relatório final

O relatório deve resumir padrões:

```text
corredor mais usado
tipo de chance mais frequente
jogador mais acionado
duelo decisivo
diferença entre xG e placar
eficiência ofensiva
resistência defensiva
```

Nunca deve justificar só dizendo "ganhou porque fez mais gols".  
Deve explicar como os gols foram construídos.
