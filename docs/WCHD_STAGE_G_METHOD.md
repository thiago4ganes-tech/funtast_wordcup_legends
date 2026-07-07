# WCHD Stage G — Método de Produção da Base

## Decisão

A Fase G será dividida em subetapas.

Motivo: uma entrega única reduziria controle de qualidade. A base precisa separar com precisão o que é real, derivado, estimado por proxy, sintético por comparáveis e ausente.

## Subetapas

### G1 — Backbone real estrutural

Carga dos dados reais estruturais disponíveis.

### G2 — Métricas reais e lacunas

Cálculo mais amplo das métricas e quantificação das lacunas por campo, seleção, jogador e Copa.

### G3 — Estimativas/proxies/sintéticos comparáveis

Preenchimento controlado dos campos indisponíveis com metodologia, origem e confiança.

### G4 — Production Data Pack final

Consolidação da base para o LEGION, com percentuais finais de real x estimado x sintético x ausente.

## Classes de origem

```text
real_official
real_structured
real_complementary
derived_from_real_structured
estimated_proxy
synthetic_comparable
manual_review
missing
```

## Regra

Nenhum dado entra sem:

```text
data_origin
source_primary
confidence_level
```
