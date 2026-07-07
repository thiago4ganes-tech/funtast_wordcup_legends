# Plano de Release Candidate — LEGION 0.4

## 1. Objetivo

Preparar a Release 0.4 sem substituir o motor atual de forma arriscada.

---

## 2. Estratégia de ativação

A Release 0.4 deve ter três modos:

```text
legacy
calibrated
comparison
```

### legacy

Usa o motor antigo.

### calibrated

Usa o motor calibrado.

### comparison

Roda motor antigo e novo em paralelo para análise técnica, exibindo apenas um resultado ao usuário.

---

## 3. Ordem de integração

```text
1. Integrar adaptador de evidências
2. Integrar Event Graph calibrado
3. Integrar telemetria
4. Integrar relatório tático-estatístico
5. Integrar narração orientada por evento
6. Ativar modo calibrated apenas após quality gate
```

---

## 4. Critérios de go/no-go

### Go

```text
quality gate aprovado
sem erro crítico no console
simulação completa sem travar
relatório coerente
narração coerente
rollback possível
```

### No-go

```text
placares médios fora da faixa crítica
jogo quebra montagem de elenco
jogo quebra GitHub Pages
motor novo gera erro JS
relatório contradiz placar/eventos
```

---

## 5. Rollback

Manter:

```text
engineMode = "legacy"
```

como fallback.

Nenhuma alteração deve impedir retorno ao motor anterior.

---

## 6. Comunicação da release

A Release 0.4 deve ser descrita como:

```text
LEGION 0.4 — Motor calibrado por evidência histórica, com event graph revisado, telemetria e quality gate.
```

Não afirmar que a base histórica está completa até ela estar.
