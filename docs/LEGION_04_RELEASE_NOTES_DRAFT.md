# Draft — Release Notes LEGION 0.4

## LEGION 0.4 — Simulation Rebuild Candidate

Esta release redesenha o motor de partidas para aproximar a simulação de uma lógica futebolística mais plausível.

## Principais mudanças

- Event Graph calibrado por evento-mãe.
- Probabilidades ajustadas por jogador, seleção, adversário e contexto.
- Separação entre atributos, modificadores e eventos.
- Telemetria de simulação.
- Quality gate estatístico.
- Relatório tático-estatístico mais rastreável.
- Narração derivada de eventos reais da simulação.
- Modo de segurança para manter o motor legado.

## Limitações conhecidas

- A base histórica ainda depende de expansão e validação completa.
- Algumas competências ainda devem permanecer como candidatas.
- Sinergias avançadas exigem minutos compartilhados e revisão metodológica.
- A Release 0.4 deve ser validada por lotes antes de publicação ampla.

## Critério de aprovação

A release só deve ser promovida de candidate para estável após:

```text
quality gate aprovado
regressão aprovada
teste visual aprovado
teste no GitHub Pages aprovado
```
