# Plano de Transição — G2 para G3

## 1. Objetivo da G3

A G3 deve povoar campos ausentes que são importantes para o motor, usando:

```text
real_complementary
estimated_proxy
synthetic_comparable
manual_review
```

## 2. Ordem de preenchimento

### 2.1 Assistências e combinações diretas

Prioridade alta porque melhoram:

- sinergia;
- criação;
- participação em gols;
- competências de decisão.

### 2.2 Chutes e chutes no alvo

Prioridade alta porque melhoram:

- finalização;
- xG;
- volume ofensivo;
- seleção de finalizador.

### 2.3 Passes e criação

Prioridade alta porque melhoram:

- vision;
- passing;
- through_ball;
- possession profile.

### 2.4 Dribles e ações defensivas

Prioridade alta porque melhoram:

- dribbling;
- tackling;
- interception;
- pressure.

### 2.5 Estilo coletivo

Prioridade alta porque diferencia seleções.

## 3. Regra de limite

Dados sintéticos não podem gerar atributos extremos sem evidência real.

Exemplo:

```text
synthetic_comparable com confiança C deve ter teto de impacto no motor.
```

## 4. Saída esperada da G3

```text
data/estimated/player_technical_estimates.json
data/estimated/team_style_estimates.json
data/estimated/synergy_estimates.json
data/quality/g3_estimation_coverage_report.json
```
