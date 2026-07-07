# Fantasy World Cup Legends — Full Project + WCHD A-G

Data de geração: 2026-07-07

Este pacote junta:

```text
1. Arquivos estruturais do projeto jogável atual
2. Etapas WCHD/LEGION A-F
3. Fase G completa: G1, G2, G3 e G4
```

## Para que serve

Este é o pacote correto para colar na raiz do repositório GitHub quando você quer preservar o projeto inteiro e adicionar a base de dados/metodologia A-G.

## Como usar

1. Extraia este ZIP.
2. Entre na pasta:

```text
fwcl_full_project_with_wchd_a_g_v1
```

3. Copie tudo que está dentro dela.
4. Cole na raiz local do repositório:

```text
funtast_worldcup_legends
```

5. Quando o Windows perguntar, escolha substituir/mesclar.
6. No GitHub Desktop, faça o commit:

```text
Full project - base estrutural e WCHD A-G production data pack
```

7. Clique em **Push origin**.

## Arquivo mais importante da base final

```text
data/production/wchd_legion_inputs.json
```

Esse será o principal arquivo para a futura Release 0.4.

## Composição ponderada final dos dados

```text
Real + derivado de real: 79.02%
Estimado/proxy: 16.48%
Sintético comparável: 4.5%
Ausente: 0.0%
```

## Observação importante

Este pacote agrega a estrutura do jogo e a base A-G.  
Ele ainda não é, por si só, a Release 0.4 jogável integrada.

A próxima etapa técnica será alterar o motor do jogo para consumir:

```text
data/production/wchd_legion_inputs.json
```

e ativar os modos:

```text
legacy
calibrated
comparison
```

## Conflitos de arquivo

Conflitos preservados: 17

Quando houve conflito, o arquivo extra foi mantido com sufixo `_FROM_<origem>`.
