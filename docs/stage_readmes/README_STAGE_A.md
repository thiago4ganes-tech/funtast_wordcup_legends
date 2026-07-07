# FWCL / LEGION — Etapa A: Base Estrutural do WCHD

Data de geração: 2026-07-06

Este pacote contém os entregáveis iniciais da **Etapa A — Base Estrutural** do WCHD (*World Cup Historical Database*).

A Etapa A organiza a base factual que sustentará o motor LEGION:

- Copas
- países
- seleções por Copa
- partidas
- jogadores
- elencos
- aparições por partida
- gols
- cartões
- substituições
- pênaltis
- regras de qualidade
- dicionário de dados
- matriz de fontes

## Como usar no projeto

Copie o conteúdo deste pacote para a raiz do repositório.

```text
FUNTAST_WORLDCUP_LEGENDS/
├── docs/
├── data/
├── tests/
└── tools/
```

## Arquivos principais

```text
docs/WCHD_STAGE_A.md
docs/SOURCES.md
docs/DATA_DICTIONARY.md
docs/QUALITY_RULES.md
docs/STAGE_A_ACCEPTANCE.md
docs/IMPORT_PIPELINE.md

data/schema/*.schema.json
data/raw/*.json
data/normalized/*.json
data/source_registry/sources.json

tests/stage_a_quality_checklist.json
tools/validate_stage_a.js
```

## Decisão de arquitetura

A Etapa A deve ser tratada como **fundação factual**. Nenhuma habilidade, preço, competência ou probabilidade do LEGION deve ser calculada diretamente de memória ou opinião sem passar por uma trilha de evidência.
