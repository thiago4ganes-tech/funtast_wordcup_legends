# WCHD Stage G4 — Production Data Pack Final para o LEGION

Data de geração: 2026-07-07

Esta entrega conclui a **Fase G**.

## Subfases da Fase G

```text
G1 — Backbone real estrutural
G2 — Métricas reais, cobertura e lacunas
G3 — Estimativas, proxies e sintéticos comparáveis
G4 — Production Data Pack final para o LEGION
```

## O que a G4 entrega

A G4 consolida G1, G2 e G3 em uma base final de produção para o motor LEGION.

Arquivos principais:

```text
data/production/wchd_players_production.json
data/production/wchd_teams_production.json
data/production/wchd_matches_production.json
data/production/wchd_synergies_production.json
data/production/wchd_legion_inputs.json
data/quality/g4_final_data_composition_report.json
data/manifest/production_manifest.json
```

## Escopo consolidado

```text
Copas: 10
Países/seleções: 77
Seleções-Copa: 296
Partidas: 604
Jogadores-base: 5,120
Jogadores-Copa: 6,800
Gols: 1,524
Cartões: 2,331
Pênaltis: 308
Sinergias/pares: 44,378
```

## Composição ponderada final para o LEGION

```text
Real + derivado de real: 79.02%
Estimado/proxy: 16.48%
Sintético comparável: 4.50%
Ausente: 0.00%
```

## Interpretação

A base ficou operacionalmente completa para o motor, mas não significa que 100% dos campos são dados reais observados.

O dado real e derivado de real continua sendo a maior parte do peso do LEGION.  
O restante está preenchido por estimativas/proxies e sintéticos comparáveis, todos marcados e com limite de peso.

## Próximo passo

Depois desta G4, o próximo passo é consolidar **A-G** em um pacote único.

Depois disso, vem a Release 0.4 jogável integrada ao site.
