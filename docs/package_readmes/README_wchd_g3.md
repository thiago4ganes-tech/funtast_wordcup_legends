# WCHD Stage G3 — Estimativas, Proxies e Sintéticos Comparáveis

Data de geração: 2026-07-06

Esta entrega é a **subfase G3 de 4** da Fase G.

## Subfases da Fase G

```text
G1 — Backbone real estrutural
G2 — Métricas reais, cobertura e lacunas
G3 — Estimativas, proxies e sintéticos comparáveis
G4 — Production Data Pack final para o LEGION
```

## Objetivo da G3

Preencher lacunas críticas para o motor LEGION sem fingir que os dados são reais.

A G3 cria dados estimados e sintéticos, todos marcados com:

```text
data_origin
estimation_method
source_basis
confidence_level
engine_weight_limit
```

## Principais arquivos

```text
data/estimated/player_technical_estimates.json
data/estimated/team_style_estimates.json
data/estimated/synergy_estimates.json
data/quality/g3_estimation_coverage_report.json
data/quality/g3_field_origin_breakdown.json
data/methodology/g3_estimation_method_registry.json
```

## Registros gerados

```text
Estimativas técnicas de jogadores: 6,800
Estimativas de estilo de seleções: 296
Estimativas de sinergia: 44,378
```

## Cobertura ponderada após G3

```text
Real + derivado de real: 79.02%
Estimado/proxy: 16.48%
Sintético comparável: 4.50%
Ausente: 0.00%
```

## Interpretação

A G3 reduz lacunas operacionais do LEGION para 0% na leitura ponderada, mas não aumenta o percentual de dado real.

O que muda é que os campos antes ausentes passam a ter estimativas controladas.

## Próxima subfase

```text
G4 — Production Data Pack final para o LEGION
```

A G4 vai consolidar G1, G2 e G3 em uma base final, com relatório por jogador, seleção, campo e peso no motor.
