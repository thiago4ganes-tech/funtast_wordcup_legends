# Fontes da Etapa A — WCHD

Este documento define as fontes utilizadas ou recomendadas para a construção da base estrutural.

## 1. Fonte estrutural principal

### Fjelstul World Cup Database

**URL:** https://github.com/jfjelstul/worldcup  
**Função:** estrutura relacional ampla de Copas do Mundo.

Uso no WCHD:

- Copas
- partidas
- times
- jogadores
- técnicos
- árbitros
- squads
- gols
- pênaltis
- cartões
- substituições
- standings
- prêmios

**Prioridade:** Alta  
**Tipo:** fonte aberta estruturada  
**Uso recomendado:** importação inicial da Etapa A

---

## 2. Fonte oficial de validação

### FIFA Data Centre — International Match Archive

**URL:** https://inside.fifa.com/data-centre/matches  
**Função:** validação oficial de partidas e resultados.

Uso no WCHD:

- placares
- datas
- competições
- seleções
- histórico de partidas
- conferência de confrontos

**Prioridade:** Alta  
**Tipo:** fonte oficial  
**Uso recomendado:** validação de partidas, placares e fases

---

## 3. Fonte complementar para arquivos em CSV/JSON

### DataHub — FIFA World Cup

**URL:** https://datahub.io/football/worldcup  
**Função:** acesso prático a datasets de Copa em formatos reutilizáveis.

---

## 4. Fonte aberta de redundância

### OpenFootball World Cup

**URL:** https://github.com/openfootball/worldcup  
**Função:** dados abertos em formato Football.TXT.

---

## 5. Fonte complementar para Copas recentes

### FBref — World Cup Stats

**URL:** https://fbref.com/en/comps/1/  
**Função:** estatísticas detalhadas modernas.

Uso futuro:

- minutos
- finalizações
- goleiros
- passes
- misc stats
- ações defensivas
- playing time

---

## 6. Fonte complementar estatística

### StatBunker

**URL:** https://www.statbunker.com/  
**Função:** rankings e estatísticas agregadas por competição.

---

## 7. Hierarquia de confiança

| Prioridade | Fonte | Tipo de dado |
|---|---|---|
| 1 | FIFA | placar, partida, competição, fase |
| 2 | Fjelstul | estrutura relacional, squads, eventos |
| 3 | FBref | estatísticas avançadas recentes |
| 4 | StatBunker | agregados e rankings |
| 5 | DataHub/OpenFootball | redundância e fallback |

---

## 8. Regra de divergência

Quando houver divergência:

1. FIFA prevalece para placar, data, fase e participantes.
2. Fjelstul prevalece para estrutura relacional, desde que não contradiga a FIFA.
3. Fontes complementares devem ser usadas para investigar divergências, não para sobrescrever automaticamente.
4. Toda divergência relevante deve ser registrada em `docs/DATA_ISSUES.md`.
