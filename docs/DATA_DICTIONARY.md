# Dicionário de Dados — WCHD Etapa A

Este documento descreve as tabelas estruturais da Etapa A.

## 1. `world_cups`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| world_cup_id | string | Sim | ID da Copa |
| year | integer | Sim | Ano da edição |
| host_country | string | Sim | País-sede |
| start_date | string/null | Não | Data inicial |
| end_date | string/null | Não | Data final |
| champion | string/null | Não | Campeão |
| runner_up | string/null | Não | Vice |
| teams_count | integer/null | Não | Número de seleções |
| matches_count | integer/null | Não | Número de partidas |
| source_primary | string | Sim | Fonte principal |
| source_confidence | A/B/C/D | Sim | Confiança |

## 2. `countries`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| country_id | string | Sim | ID normalizado |
| country_name | string | Sim | Nome atual/histórico |
| fifa_code | string/null | Não | Código FIFA |
| confederation | string/null | Não | Confederação |
| historical_name_variation | array | Não | Variações históricas |
| active_flag | boolean | Sim | País ativo ou histórico |
| source_primary | string | Sim | Fonte principal |
| source_confidence | A/B/C/D | Sim | Confiança |

## 3. `team_world_cup`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| team_wc_id | string | Sim | ID seleção-Copa |
| country_id | string | Sim | País |
| year | integer | Sim | Copa |
| team_display_name | string | Sim | Nome exibido |
| manager_name | string/null | Não | Técnico |
| final_position | integer/null | Não | Posição final |
| stage_reached | string/null | Não | Fase alcançada |
| games | integer/null | Não | Jogos |
| wins | integer/null | Não | Vitórias |
| draws | integer/null | Não | Empates |
| losses | integer/null | Não | Derrotas |
| goals_for | integer/null | Não | Gols pró |
| goals_against | integer/null | Não | Gols contra |
| source_primary | string | Sim | Fonte |
| source_confidence | A/B/C/D | Sim | Confiança |

## 4. `matches`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| match_id | string | Sim | ID da partida |
| world_cup_id | string | Sim | Copa |
| year | integer | Sim | Ano |
| stage | string | Sim | Fase |
| round | string/null | Não | Rodada |
| group_name | string/null | Não | Grupo |
| match_date | string/null | Não | Data |
| stadium | string/null | Não | Estádio |
| city | string/null | Não | Cidade |
| team_home_id | string | Sim | Time A |
| team_away_id | string | Sim | Time B |
| home_score | integer | Sim | Gols A |
| away_score | integer | Sim | Gols B |
| home_penalty_score | integer/null | Não | Pênaltis A |
| away_penalty_score | integer/null | Não | Pênaltis B |
| winner_team_id | string/null | Não | Vencedor |
| source_primary | string | Sim | Fonte |
| source_confidence | A/B/C/D | Sim | Confiança |

## 5. `player_base`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| player_base_id | string | Sim | ID único do atleta |
| player_name | string | Sim | Nome completo |
| short_name | string/null | Não | Nome curto |
| birth_date | string/null | Não | Data de nascimento |
| nationality_country_id | string/null | Não | País |
| height | number/null | Não | Altura |
| preferred_foot | string/null | Não | Pé dominante |
| primary_career_position | string/null | Não | Posição histórica |
| name_variations | array | Não | Variações de nome |
| source_primary | string | Sim | Fonte |
| source_confidence | A/B/C/D | Sim | Confiança |

## 6. `player_world_cup`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| player_wc_id | string | Sim | ID do jogador na Copa |
| player_base_id | string | Sim | Atleta-base |
| country_id | string | Sim | País |
| team_wc_id | string | Sim | Seleção-Copa |
| year | integer | Sim | Copa |
| squad_number | integer/null | Não | Número |
| age_at_tournament | number/null | Não | Idade |
| club_at_time | string/null | Não | Clube na época |
| primary_position_wc | string | Sim | Posição principal |
| secondary_positions_wc | array | Não | Posições secundárias |
| squad_status | string/null | Não | titular/reserva/convocado |
| source_primary | string | Sim | Fonte |
| source_confidence | A/B/C/D | Sim | Confiança |
