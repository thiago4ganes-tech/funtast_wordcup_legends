# Pipeline de Importação — WCHD Etapa A

## 1. Fluxo geral

```text
Fontes externas
↓
data/raw/
↓
normalização de IDs
↓
validação estrutural
↓
data/normalized/
↓
quality gate
↓
camadas derivadas futuras
```

## 2. Ordem recomendada de importação

1. `world_cups`
2. `countries`
3. `team_world_cup`
4. `matches`
5. `player_base`
6. `player_world_cup`
7. `squad_membership`
8. `player_match_appearance`
9. `goals`
10. `bookings`
11. `substitutions`
12. `penalty_kicks`

## 3. Normalização de nomes

Criar IDs estáveis.

Exemplo:

```text
Ronaldo Luís Nazário de Lima → player_ronaldo_nazario
Cristiano Ronaldo → player_cristiano_ronaldo
```

## 4. Normalização de seleções históricas

Exemplo:

```text
West Germany 1990 → team_west_germany_1990
Germany 2014 → team_germany_2014
```

Nunca misturar automaticamente seleções históricas sem regra documentada.

## 5. Regra para dados incompletos

Se um dado não existir com confiança suficiente:

- preencher como `null`;
- marcar `source_confidence: "D"` se for provisório;
- registrar observação em `method_note` ou `data_issue`.

## 6. Próxima fase

A Etapa A não calcula habilidades. Após a base estrutural validada, a Etapa B criará indicadores de seleção-Copa, jogador-Copa, minutos compartilhados, sinergias reais, matriz de confrontos e atributos derivados.
