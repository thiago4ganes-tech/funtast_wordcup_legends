# DATA_QUALITY — WCHD

## Objetivo

Este documento define o nível mínimo de controle para o banco histórico do Fantasy World Cup Legends.

## Estado atual

A base WCHD atual é **provisória**. Ela existe para testar o LEGION, o mercado, o Event Graph e a experiência de partida. Ainda não deve ser tratada como base estatística final.

## Classificação dos campos

### Dado observado
Campos que devem vir de fontes públicas ou bases históricas:

- jogos;
- minutos;
- gols;
- assistências;
- cartões;
- defesas;
- gols sofridos;
- pênaltis;
- campanha da seleção.

### Atributo derivado
Campos calculados a partir de dados observados e análise técnica:

- finalização;
- passe;
- drible;
- cabeceio;
- marcação;
- resistência;
- decisão;
- compostura.

### Competência interpretativa
Traços que dependem de histórico público e validação qualitativa:

- frio sob pressão;
- cresce em jogo grande;
- acredita até o fim;
- temperamental;
- organizador;
- especialista aéreo;
- chama a responsabilidade.

## Níveis de confiança

| Nível | Critério |
|---|---|
| A | Dado oficial ou amplamente documentado |
| B | Fonte pública confiável, mas não oficial |
| C | Estimativa técnica baseada em evidências parciais |
| D | Placeholder provisório para balanceamento |

## Regras de qualidade

1. Nenhuma seleção deve ser considerada completa com menos de 23 jogadores.
2. Nenhum atleta pode aparecer duas vezes no mesmo XI.
3. Versões diferentes do mesmo atleta devem bloquear uma à outra no elenco do usuário.
4. Cada posição sorteada deve buscar preferencialmente 6 a 12 opções.
5. Quando houver menos de 6 opções, o jogo deve sinalizar baixa profundidade da convocação.
6. Preços devem ter maior variação entre reservas, titulares, craques e lendas.
7. A base final precisa registrar metodologia e fonte por campo relevante.

## Próxima meta

Expandir a base de 558 registros para, no mínimo, 897 registros jogador-copa para cobrir 39 seleções com 23 convocados cada.
