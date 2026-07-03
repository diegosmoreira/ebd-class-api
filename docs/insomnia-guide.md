# Guia de Testes de API - MVP EBD Class (Insomnia / Postman)

Este guia contém as rotas, payloads e ordem de execução sugerida para testar o MVP no Insomnia.

**Base URL**: `http://localhost:3000`

---

## 1. Autenticação (Auth)

### 1.1 Login do Admin (Seed)
- **Método**: `POST`
- **URL**: `/auth/login`
- **Body** (JSON):
```json
{
  "email": "admin@ebd.com",
  "password": "senha-padrao"
}
```
*Atenção*: Como `must_change_password` está `true`, este token estará restrito para as outras rotas até que a senha seja trocada! Copie o `token` do retorno.

### 1.2 Trocar Senha (Obrigatório)
- **Método**: `POST`
- **URL**: `/auth/change-password`
- **Auth**: Bearer Token (Cole o token obtido no passo 1.1)
- **Body** (JSON):
```json
{
  "oldPassword": "senha-padrao",
  "newPassword": "nova-senha-segura"
}
```

### 1.3 Novo Login (Para obter Token Liberado)
- **Método**: `POST`
- **URL**: `/auth/login`
- **Body** (JSON):
```json
{
  "email": "admin@ebd.com",
  "password": "nova-senha-segura"
}
```
> **IMPORTANTE**: Use este novo `token` em todas as requisições subsequentes na aba de "Auth" -> "Bearer Token".

---

## 2. Classes

### 2.1 Criar Classe
- **Método**: `POST`
- **URL**: `/classes`
- **Body** (JSON):
```json
{
  "nome": "Jovens"
}
```

### 2.2 Listar Classes
- **Método**: `GET`
- **URL**: `/classes`

---

## 3. Professores

### 3.1 Criar Professor
- **Método**: `POST`
- **URL**: `/professores`
- **Body** (JSON):
```json
{
  "email": "joao.professor@ebd.com",
  "nome": "João Silva",
  "codigo": "PROF-001",
  "classesIds": ["<ID_DA_CLASSE_CRIADA_NO_PASSO_2>"]
}
```
*Nota*: Isso cria o Professor e um Usuário atrelado a ele automaticamente com a senha "senha-padrao".

### 3.2 Listar Professores
- **Método**: `GET`
- **URL**: `/professores`

### 3.3 Inativar Professor
- **Método**: `POST`
- **URL**: `/professores/<ID_DO_PROFESSOR>/inativar`

---

## 4. Trimestres

### 4.1 Criar Trimestre
- **Método**: `POST`
- **URL**: `/trimestres`
- **Body** (JSON):
```json
{
  "numero": 3,
  "titulo": "As Epístolas Paulinas",
  "ano": 2026,
  "data_inicial": "2026-07-05T00:00:00Z",
  "data_final": "2026-09-27T00:00:00Z",
  "meses": [7, 8, 9]
}
```
*Nota*: As datas devem englobar exatamente 13 domingos, senão retornará erro. A validação já está implementada!

### 4.2 Listar Trimestres
- **Método**: `GET`
- **URL**: `/trimestres`

---

## 5. Lições

### 5.1 Criar 13 Lições (Repita mudando o número de 1 a 13)
- **Método**: `POST`
- **URL**: `/licoes`
- **Body** (JSON):
```json
{
  "numero": 1,
  "titulo": "Introdução a Romanos",
  "trimestre_id": "<ID_DO_TRIMESTRE>",
  "classe_id": "<ID_DA_CLASSE>"
}
```
*Nota*: Para gerar as aulas (passo 6), a classe obrigatoriamente precisa ter 13 lições criadas para o trimestre.

---

## 6. Gerar Aulas (Trimestres -> Aulas)

### 6.1 Acionar Geração
- **Método**: `POST`
- **URL**: `/trimestres/<ID_DO_TRIMESTRE>/gerar-aulas`
- **Body** (JSON):
```json
{
  "classe_id": "<ID_DA_CLASSE>"
}
```
*Resultado Esperado*: O sistema varre as 13 lições cadastradas para esta classe no trimestre, encontra os 13 domingos no período do trimestre, e cria 13 registros de `Aula` no banco.
