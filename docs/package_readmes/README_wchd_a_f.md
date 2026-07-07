# FWCL / LEGION — WCHD Research Framework Consolidado A–F

Data de consolidação: 2026-07-06

Este pacote consolida, em uma única estrutura, os entregáveis das etapas A a F do trabalho de pesquisa, governança de dados, métricas, atributos, Event Graph, integração, telemetria, testes massivos e release candidate.

## Por que este pacote existe

Copiar cada etapa separadamente aumenta o risco de:

- esquecer arquivos;
- sobrescrever README e documentos;
- deixar `data/`, `docs/`, `js/`, `tools/` e `tests/` em estados diferentes;
- subir uma base parcialmente integrada ao GitHub.

Este pacote é o caminho recomendado para o repositório.

## Como usar

1. Extraia este ZIP.
2. Entre na pasta `fwcl_wchd_a_f_consolidated`.
3. Copie tudo que está dentro dela.
4. Cole na raiz do repositório local `funtast_worldcup_legends`.
5. Substitua/mescle as pastas quando o Windows pedir.
6. No GitHub Desktop, faça um commit único.

Commit sugerido:

```text
WCHD A-F - framework consolidado de pesquisa e motor LEGION
```

## Estrutura consolidada

```text
docs/
data/
js/
tests/
tools/
release/
README.md
```

## Escopo

Este pacote é uma fundação técnica/metodológica.  
Ele ainda não substitui automaticamente o motor jogável atual no site.

A próxima entrega prática deve ser a Release 0.4 integrada ao jogo, usando:

```text
legacy
calibrated
comparison
```

## Observação sobre README das etapas

Os README originais das etapas foram preservados em:

```text
docs/stage_readmes/
```

## Status de conflito

Conflitos detectados na consolidação: 0

Quando houve arquivo com mesmo caminho e conteúdo diferente, o arquivo conflitante foi preservado com sufixo `_STAGE_X`.
