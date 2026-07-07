# WCHD Stage G2 — Métricas Reais, Cobertura e Lacunas

Data de geração: 2026-07-06

Esta entrega é a **subfase G2 de 4** da Fase G.

## Subfases da Fase G

```text
G1 — Backbone real estrutural
G2 — Métricas reais, cobertura e lacunas
G3 — Estimativas, proxies e sintéticos comparáveis
G4 — Production Data Pack final para o LEGION
```

## Objetivo da G2

Medir exatamente o que já está coberto pela base real/derivada e o que ainda precisa ser estimado na G3.

A G2 não inventa dados. Ela diagnostica a base.

## Principais saídas

```text
data/quality/g2_record_origin_summary.json
data/quality/g2_field_coverage_matrix.json
data/quality/g2_player_coverage_report.json
data/quality/g2_team_coverage_report.json
data/quality/g2_gap_register.json
data/quality/g2_legion_weighted_coverage.json
data/quality/g2_dashboard_summary.json
```

Também há versões CSV em:

```text
data/quality/csv/
```

## Resultado executivo

- Registros analisados: 102,406
- Jogadores-Copa analisados: 6,800
- Seleções-Copa analisadas: 296
- Lacunas críticas para o motor: 4

## Cobertura ponderada para o LEGION

```text
Real + derivado de real: 79.02%
Estimado/proxy: 8.0%
Sintético comparável: 0%
Ausente: 12.98%
```

## Próxima subfase

A próxima etapa é a G3:

```text
G3 — Estimativas, proxies e sintéticos comparáveis
```

Ela deve preencher, com marcação explícita, lacunas como passes, chutes, dribles, ações defensivas, estilos coletivos e sinergias diretas.
