# WCHD — Stage G2: Métricas Reais, Cobertura e Lacunas

## 1. Objetivo

A G2 mede a cobertura real da base populada na G1.

Ela responde:

> Quanto da base já é real, quanto é derivado de dado real, quanto é proxy, quanto ainda está ausente e onde a G3 precisa atuar?

---

## 2. Fase G terá 4 subfases

```text
G1 — Backbone real estrutural
G2 — Métricas reais, cobertura e lacunas
G3 — Estimativas, proxies e sintéticos comparáveis
G4 — Production Data Pack final para o LEGION
```

Esta entrega conclui a G2.

---

## 3. Resultado resumido

### Registros

```text
Total de registros analisados: 102,406
Jogadores-Copa: 6,800
Seleções-Copa: 296
Pares de jogadores/sinergia proxy: 44,378
```

### Cobertura ponderada para o motor

```text
Real + derivado de real: 79.02%
Estimado/proxy: 8.0%
Sintético comparável: 0%
Ausente: 12.98%
```

---

## 4. Interpretação

A base já é forte para:

- estrutura de Copas;
- seleções;
- partidas;
- placares;
- jogadores;
- elencos;
- gols;
- cartões;
- pênaltis;
- substituições;
- aparições;
- métricas básicas de seleção;
- métricas de gols e disciplina por jogador;
- histórico direto entre países.

A base ainda precisa de G3 para:

- assistências;
- chutes;
- chutes no alvo;
- passes;
- passes-chave;
- passes progressivos;
- dribles;
- desarmes;
- interceptações;
- pressões;
- defesas de goleiro;
- estilo coletivo;
- sinergia direta por gol/assistência.

---

## 5. Decisão

Não há autorização metodológica para considerar a base encerrada na G2.

A G2 cria o diagnóstico de lacunas.  
A G3 deve preencher essas lacunas com origem explícita:

```text
real_complementary
estimated_proxy
synthetic_comparable
manual_review
missing
```
