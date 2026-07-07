# Regras de Calibração — LEGION Etapa D

## 1. Objetivo

Manter a simulação variada, mas plausível.

---

## 2. Metas estatísticas iniciais

Para jogos entre seleções históricas fortes:

| Métrica | Faixa plausível inicial |
|---|---:|
| Gols por jogo | 1.6 a 3.4 |
| Finalizações totais | 16 a 32 |
| Finalizações no alvo | 5 a 13 |
| xG total | 1.6 a 3.8 |
| Escanteios | 4 a 12 |
| Cartões | 1 a 6 |
| Gols de pênalti | raros |
| Gols contra | muito raros |

Essas faixas são alvos de calibragem do jogo, não afirmações estatísticas finais.

---

## 3. Regras para gols

### 3.1 Finalização comum

```text
chance de gol normalmente entre 2% e 15%
```

### 3.2 Chance clara

```text
chance de gol normalmente entre 15% e 35%
```

### 3.3 Cabeceio

```text
chance de gol normalmente entre 3% e 20%
```

### 3.4 Chute de fora

```text
chance de gol normalmente entre 1% e 8%
```

### 3.5 Pênalti

```text
chance de gol normalmente entre 68% e 82%
```

---

## 4. Regras para volume

O motor deve controlar volume de eventos.

```text
posses relevantes por jogo: 28 a 48
chances reais por jogo: 8 a 22
chances claras por jogo: 2 a 8
```

---

## 5. Regras para jogadores históricos

Jogadores lendários devem:

- aparecer mais em lances compatíveis com sua função;
- ter melhor conversão quando a chance for adequada;
- errar também;
- não transformar toda jogada em lance decisivo.

---

## 6. Regras para estilos

### Time de posse

- mais build-up;
- mais central_progression;
- menos transição caótica;
- menor perda em saída;
- volume mais controlado.

### Time de transição

- mais transition_attack;
- mais through_ball;
- mais finalizações rápidas;
- mais perdas.

### Time aéreo

- mais cross;
- mais set_piece_cross;
- mais header_attempt.

### Time defensivo

- menos volume ofensivo;
- mais clearances;
- mais bloqueios;
- mais proteção de vantagem.

---

## 7. Regra de memória

O motor deve reduzir repetição.

```text
se evento X ocorreu 3 vezes recentemente:
  reduzir peso de X temporariamente
```

---

## 8. Teste de sanidade

Uma simulação isolada pode ser incomum.  
Um conjunto de 100 simulações não pode ser incoerente.

Critérios:

```text
placares médios plausíveis
jogadores relevantes aparecem nos lances certos
resultados variam sem aleatoriedade absurda
xG acompanha, mas não replica placar automaticamente
```
