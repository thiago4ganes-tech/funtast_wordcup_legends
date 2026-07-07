# Release 0.4.3 — Correção de dados, áudio de gol e campo ao vivo

## Correção de nomes

A expressão `not applicable` é removida dos nomes antes de qualquer comparação,
exibição ou cruzamento com a base curada.

## Posições

Foi criado:

```text
data/production/wchd_player_position_overrides.json
```

As posições são derivadas prioritariamente dos códigos observados nas aparições
reais de cada jogador em cada Copa, por exemplo:

- LW → PE;
- RW → PD;
- DM → VOL;
- AM → MEI;
- CB → ZAG;
- LB → LE;
- RB → LD;
- CF → CA;
- SS → SA.

Casos conhecidos com dados genéricos receberam revisão manual controlada.

## Áudio

Foi criado um áudio original em estilo de narrador retrô:

```text
Gooooooooooooooooool!
```

O sistema usa voz em português disponível no navegador e uma vinheta sintetizada.
Não reutiliza gravação do jogo citado.

## Campo ao vivo

O campo agora:

- organiza jogadores conforme a formação atual;
- separa claramente as duas equipes;
- reduz sobreposição de nomes;
- destaca portador da bola, apoio e marcador;
- desenha linhas de apoio e disputa;
- acompanha substituições e mudanças de formação.

## Controle de versão

```text
Release 0.4.3 — Dados, áudio e campo ao vivo
Build fwcl-0-4-3-20260707
```
