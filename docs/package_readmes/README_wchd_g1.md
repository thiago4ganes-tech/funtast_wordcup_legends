# FWCL / WCHD Stage G1 — Real Data Backbone v1

Data de geração: 2026-07-06

Este pacote inicia a **Fase G — Production Data Pack** com uma decisão metodológica: a Fase G será dividida em subetapas, mas terá um pacote final consolidado.

## Subetapas da Fase G

```text
G1 — Backbone real estrutural
G2 — Métricas reais e relatório de lacunas
G3 — Estimativas/proxies/sintéticos comparáveis
G4 — Data Pack final consolidado para LEGION
```

Este pacote é o **G1**. Ele baixa/organiza dados reais estruturados e gera a primeira base populada para o recorte principal.

## Escopo do G1

```text
FIFA Men's World Cup — 1986 a 2022
```

## Fonte principal

DataHub Football World Cup, derivado do Fjelstul World Cup Database.

## O que está populado

- Copas
- países/seleções
- seleções por Copa
- partidas
- jogadores-base
- jogador-Copa
- elencos
- aparições por partida
- gols
- cartões
- substituições
- pênaltis
- métricas de seleção
- métricas de jogador
- head-to-head
- minutos compartilhados estimados entre pares

## O que ainda não está resolvido no G1

- assistências;
- passes;
- passes progressivos;
- dribles;
- pressões;
- duelos;
- atributos técnicos completos;
- estimativas sintéticas por comparáveis.

Esses pontos entram nas próximas subetapas da Fase G.

## Arquivo de cobertura

Consulte:

```text
data/quality/data_origin_coverage_report.json
```

Ele separa dado real, derivado de dado real, proxy estimado e lacunas.
