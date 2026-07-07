# Checklist de Aceite — WCHD Etapa C

A Etapa C estará concluída quando:

## 1. Atributos de jogadores

```text
[ ] player_derived_attributes gerado
[ ] Cada jogador tem player_wc_id
[ ] Cada atributo possui valor ou null
[ ] Cada atributo possui confidence_level
[ ] Cada atributo possui formula_id ou fallback_id
[ ] Atributos com dados insuficientes não recebem nota extrema
```

## 2. Perfis de seleção

```text
[ ] team_derived_profiles gerado
[ ] attack_profile calculado
[ ] defense_profile calculado
[ ] transition_profile calculado ou null
[ ] possession_profile calculado ou null
[ ] aerial_profile calculado ou null
[ ] set_piece_profile calculado ou null
[ ] knockout_resilience_profile calculado ou null
```

## 3. Modificadores LEGION

```text
[ ] player_legion_modifiers gerado
[ ] team_legion_modifiers gerado
[ ] Modificadores dentro dos limites permitidos
[ ] Nenhum modificador isolado excede limite sem justificativa
```

## 4. Governança

```text
[ ] Fórmulas documentadas
[ ] Teto por confiança aplicado
[ ] Fallbacks documentados
[ ] Competências apenas como candidatas
[ ] Validador executado
```

## 5. Pronto para Etapa D

```text
[ ] Event Graph consegue consultar atributos e modificadores
[ ] Cruzamento consegue usar crossing/header/aerial
[ ] Finalização consegue usar finishing/composure/clutch
[ ] Defesa consegue usar marking/tackling/interception
[ ] Goleiro consegue usar reflexes/handling/one_v_one
[ ] Relatório consegue explicar evidências usadas
```
