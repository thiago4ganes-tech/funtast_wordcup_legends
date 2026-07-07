# Checklist de Aceite — Etapa E

A Etapa E estará concluída quando:

## 1. Integração

```text
[ ] Bridge converte times do jogo para formato LEGION
[ ] Jogadores sem ID são marcados com fallback
[ ] Motor calibrado roda sem quebrar UI
[ ] Motor legado permanece como fallback
[ ] Placar evolui por eventos
```

## 2. Telemetria

```text
[ ] Cada evento registra tipo e consequência
[ ] Cada gol tem finalização associada
[ ] xG é acumulado por chance
[ ] Estatísticas de time são atualizadas
[ ] Estatísticas de jogador são atualizadas
```

## 3. Narração

```text
[ ] Eventos técnicos viram frases de transmissão
[ ] Gols têm narração e alerta
[ ] Frases variam por intensidade
[ ] Relatório final usa telemetria
```

## 4. Testes massivos

```text
[ ] Batch runner executa matriz de confrontos
[ ] Médias são calculadas
[ ] Quality gate aprova/reprova
[ ] Recomendações de calibração são geradas
```

## 5. Segurança

```text
[ ] Feature flag criada
[ ] Rollback possível
[ ] Erros críticos bloqueiam release
[ ] Dados ausentes não são mascarados
```
