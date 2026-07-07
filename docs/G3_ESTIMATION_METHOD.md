# Método de Estimativa — G3

## 1. Princípio

Nenhum dado estimado substitui dado real.

A ordem de prioridade é:

```text
1. real_official
2. real_structured
3. real_complementary
4. derived_from_real_structured
5. estimated_proxy
6. synthetic_comparable
7. manual_review
8. missing
```

---

## 2. Estimativas de jogadores

A G3 usa:

- posição/função;
- minutos;
- gols;
- gols por 90;
- participação nos gols da seleção;
- força ofensiva/defensiva da seleção;
- perfil médio da função.

Campos estimados:

```text
shots
shots_on_target
xg_estimated
passes_attempted
passes_completed
key_passes
progressive_passes
dribbles_attempted
dribbles_completed
crosses
tackles
interceptions
aerial_duels_won
pressures
saves
```

---

## 3. Estimativas de seleções

A G3 usa:

- gols por jogo;
- gols sofridos por jogo;
- aproveitamento;
- saldo de gols;
- perfil de campanha.

Campos estimados:

```text
possession_avg
shots_for
shots_against
passes_completed
crosses
set_piece_goals
pressing_intensity
direct_attacks
tactical_style_profile
```

---

## 4. Estimativas de sinergia

A G3 usa:

- minutos compartilhados;
- titularidades conjuntas;
- jogos juntos;
- gols do time com ambos em campo;
- complementaridade funcional.

Campos estimados:

```text
synergy_type_estimated
direct_goal_combinations_estimated
synergy_score_estimated
```

---

## 5. Limites

Estimativas têm limite de impacto no motor.

```text
confidence C: peso moderado
confidence D: peso baixo
synthetic_comparable: não pode gerar atributo extremo sozinho
```
