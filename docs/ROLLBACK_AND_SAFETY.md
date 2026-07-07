# Rollback e Segurança — Etapa E

## 1. Objetivo

Permitir integração sem risco de quebrar o jogo publicado.

---

## 2. Feature flag

Criar uma chave de configuração:

```js
const SIMULATION_ENGINE = 'legacy';
```

Valores:

```text
legacy
calibrated
comparison
```

---

## 3. Fallback automático

Se o motor calibrado falhar:

```text
1. registrar erro no console;
2. registrar quality flag;
3. rodar motor legado;
4. não interromper a partida do usuário.
```

---

## 4. Critérios para bloquear release

Bloquear publicação quando ocorrer:

```text
gol sem finalização
evento com jogador inexistente
placar final divergente da lista de gols
NaN em estatísticas
partida sem goleiro
mais de 7 gols médios em lote de teste
mais de 40 finalizações médias por jogo
```

---

## 5. Estratégia de publicação

Publicar primeiro como:

```text
Modo técnico/calibrado experimental
```

Depois, quando aprovado:

```text
Modo padrão
```
