# WCHD — Stage G3: Estimativas, Proxies e Sintéticos Comparáveis

## 1. Objetivo

A G3 preenche lacunas críticas identificadas na G2, sem apagar a diferença entre dado real e dado estimado.

Ela não transforma estimativa em fato.  
Ela cria dados utilizáveis pelo motor, com controle de origem, confiança e peso.

---

## 2. Subfases da Fase G

A Fase G terá 4 subfases:

```text
G1 — Backbone real estrutural
G2 — Métricas reais, cobertura e lacunas
G3 — Estimativas, proxies e sintéticos comparáveis
G4 — Production Data Pack final para o LEGION
```

Esta entrega conclui a G3.

---

## 3. Dados gerados

```text
Jogadores: 6,800
Seleções-Copa: 296
Pares de sinergia: 44,378
```

---

## 4. Tipos de estimativa

### 4.1 estimated_proxy

Estimativa baseada em dado real indireto.

Exemplo:

```text
chutes estimados a partir de gols, minutos, posição e força ofensiva do time.
```

### 4.2 synthetic_comparable

Estimativa baseada em jogadores ou funções comparáveis.

Exemplo:

```text
passes, dribles, pressões e desarmes estimados por posição, época e perfil coletivo.
```

---

## 5. Cobertura ponderada

Antes da G3:

```text
Real + derivado de real: 79.02%
Estimado/proxy: 8.00%
Sintético comparável: 0.00%
Ausente: 12.98%
```

Depois da G3:

```text
Real + derivado de real: 79.02%
Estimado/proxy: 16.48%
Sintético comparável: 4.50%
Ausente: 0.00%
```

---

## 6. Conclusão

A G3 torna o motor operacionalmente completo, mas com transparência.

O LEGION poderá usar estimativas, porém com peso limitado e relatório de origem.

A G4 deve consolidar tudo em uma base final única.
