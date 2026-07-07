# Método de Cobertura — G2

## 1. Duas leituras de cobertura

A G2 usa duas leituras.

### 1.1 Cobertura core

Mede apenas os campos que a G1 já se propôs a carregar:

- identificação;
- seleção;
- Copa;
- posição;
- partidas;
- minutos;
- gols;
- cartões;
- pênaltis;
- métricas básicas.

### 1.2 Cobertura de insumo LEGION

Inclui também os campos que o motor gostaria de usar:

- passes;
- chutes;
- dribles;
- ações defensivas;
- pressão;
- defesas;
- estilo coletivo;
- sinergia direta.

Essa segunda leitura expõe as lacunas reais do motor.

---

## 2. Classes de origem

| Classe | Descrição |
|---|---|
| real_official | Fonte oficial direta |
| real_structured | Fonte estruturada confiável |
| real_complementary | Fonte complementar real |
| derived_from_real_structured | Métrica calculada de fato real |
| estimated_proxy | Estimativa a partir de dados reais indiretos |
| synthetic_comparable | Estimativa por comparação |
| manual_review | Interpretação/revisão manual |
| missing | Ausente |

---

## 3. Percentual ponderado do motor

O percentual ponderado do LEGION não é contagem bruta de registros.

Ele usa pesos metodológicos para refletir o impacto de cada classe no motor.

Exemplo:

```text
gols, minutos e partidas pesam mais que campos informativos.
passes e ações técnicas pesam bastante porque afetam a simulação.
sinergia tem peso relevante, mas menor que estrutura básica.
```

---

## 4. Regra de transparência

Nenhum dado estimado na G3 poderá entrar na base sem:

```text
data_origin
estimation_method
confidence_level
source_basis
engine_weight_limit
```
