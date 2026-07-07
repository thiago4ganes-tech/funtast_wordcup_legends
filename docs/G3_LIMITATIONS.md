# Limitações da G3

## 1. Limitação principal

A G3 completa a base operacional do motor, mas parte dos campos é estimada.

Isso é aceitável desde que o motor saiba a origem e limite o peso.

## 2. Dados não observados

Campos como passes, dribles, pressões, desarmes e posse não foram observados diretamente nesta base.

Eles são estimados por função e contexto.

## 3. Risco

O risco não está em estimar.  
O risco está em esconder que foi estimado.

Por isso todos os campos possuem:

```text
data_origin
estimation_method
confidence_level
engine_weight_limit
```

## 4. Próxima mitigação

A G4 deve consolidar e expor essas proporções de forma clara para o jogo e para o painel de qualidade.
