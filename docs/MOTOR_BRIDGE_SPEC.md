# Especificação da Ponte do Motor — Etapa E

## 1. Função da ponte

A ponte converte o estado atual do jogo para o formato esperado pelo LEGION calibrado.

Ela resolve diferenças entre:

```text
UI atual / mercado atual / WCHD provisório
```

e

```text
Historical Evidence Engine / Event Graph calibrado
```

---

## 2. Responsabilidades

A ponte deve:

1. normalizar jogadores;
2. garantir IDs;
3. buscar atributos e modificadores;
4. selecionar funções táticas;
5. preparar contexto da partida;
6. executar simulação calibrada;
7. converter resultado para a UI atual;
8. registrar flags de qualidade.

---

## 3. Normalização de jogador

Entrada possível do jogo atual:

```json
{
  "name": "Ronaldo",
  "year": 2002,
  "country": "Brazil",
  "position": "CA"
}
```

Saída esperada:

```json
{
  "player_wc_id": "player_ronaldo_nazario_2002",
  "player_base_id": "player_ronaldo_nazario",
  "display_name": "Ronaldo",
  "team_wc_id": "team_brazil_2002",
  "slot": "CA",
  "evidence_confidence": "A"
}
```

---

## 4. Normalização de time

```json
{
  "team_wc_id": "team_brazil_2002",
  "display_name": "Brazil 2002",
  "formation": "3-4-1-2",
  "players": []
}
```

---

## 5. Quality flags

A ponte deve retornar alertas:

```text
missing_player_wc_id
missing_team_modifier
missing_player_modifier
low_confidence_attribute
fallback_used
invalid_lineup_size
no_goalkeeper_found
```

Esses alertas ajudam a não mascarar problemas de base.
