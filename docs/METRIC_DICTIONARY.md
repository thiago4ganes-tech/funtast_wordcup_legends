# Dicionário de Métricas — WCHD Etapa B

## 1. `team_wc_metrics`

| Campo | Descrição |
|---|---|
| team_wc_id | Seleção-Copa |
| country_id | País |
| year | Copa |
| games | Jogos |
| wins | Vitórias |
| draws | Empates |
| losses | Derrotas |
| goals_for | Gols marcados |
| goals_against | Gols sofridos |
| goal_difference | Saldo |
| goals_for_per_game | Gols marcados por jogo |
| goals_against_per_game | Gols sofridos por jogo |
| points_equivalent | Pontos equivalentes, 3 por vitória |
| points_per_game | Pontos por jogo |
| win_rate | Vitórias / jogos |
| clean_sheets | Jogos sem sofrer gol |
| failed_to_score | Jogos sem marcar |
| knockout_games | Jogos de mata-mata |
| knockout_wins | Vitórias em mata-mata |
| knockout_goals_for | Gols pró em mata-mata |
| knockout_goals_against | Gols contra em mata-mata |
| opponent_strength_avg | Força média dos adversários |
| campaign_index | Índice inicial de campanha |
| attack_observed_index | Índice ofensivo observado |
| defense_observed_index | Índice defensivo observado |
| confidence_level | Confiança da métrica |

---

## 2. `player_wc_metrics`

| Campo | Descrição |
|---|---|
| player_wc_id | Jogador-Copa |
| player_base_id | Atleta-base |
| team_wc_id | Seleção-Copa |
| country_id | País |
| year | Copa |
| matches_played | Partidas jogadas |
| starts | Titularidades |
| minutes | Minutos |
| minutes_share | Minutos / minutos possíveis do time |
| goals | Gols |
| assists | Assistências, quando disponíveis |
| goal_participations | Gols + assistências |
| goals_per_90 | Gols por 90 minutos |
| goal_participations_per_90 | Participações em gol por 90 |
| team_goal_share | Gols do jogador / gols do time |
| knockout_minutes | Minutos em mata-mata |
| knockout_goals | Gols em mata-mata |
| semifinal_goals | Gols em semifinal |
| final_goals | Gols em final |
| yellow_cards | Amarelos |
| red_cards | Vermelhos |
| penalties_taken | Pênaltis cobrados |
| penalties_scored | Pênaltis convertidos |
| structural_importance_index | Índice de importância estrutural |
| confidence_level | Confiança da métrica |

---

## 3. `player_pair_minutes`

| Campo | Descrição |
|---|---|
| pair_id | ID da dupla |
| team_wc_id | Seleção-Copa |
| year | Copa |
| player_a_wc_id | Jogador A |
| player_b_wc_id | Jogador B |
| matches_together | Jogos juntos |
| starts_together | Titularidades juntos |
| shared_minutes_estimated | Minutos compartilhados estimados |
| team_goals_with_both_on_pitch | Gols do time com ambos em campo |
| direct_goal_combinations | Gol/assistência entre os dois, quando disponível |
| factual_synergy_index | Índice factual de sinergia |
| confidence_level | Confiança |

---

## 4. `head_to_head_metrics`

| Campo | Descrição |
|---|---|
| h2h_id | ID do confronto |
| country_a_id | País A |
| country_b_id | País B |
| world_cup_matches | Partidas em Copas |
| country_a_wins | Vitórias A |
| country_b_wins | Vitórias B |
| draws | Empates |
| goals_a | Gols A |
| goals_b | Gols B |
| knockout_matches | Partidas em mata-mata |
| finals | Finais |
| sample_size | Tamanho da amostra |
| weight_cap | Peso máximo permitido no LEGION |

---

## 5. `opponent_strength_metrics`

| Campo | Descrição |
|---|---|
| team_wc_id | Seleção-Copa avaliada |
| opponent_team_wc_id | Adversário |
| match_id | Partida |
| opponent_stage_reached | Fase atingida pelo adversário |
| opponent_final_position | Posição final do adversário |
| opponent_goal_difference | Saldo final do adversário |
| opponent_points_per_game | Pontos por jogo do adversário |
| opponent_strength_score | Score de força do adversário |
| confidence_level | Confiança |
