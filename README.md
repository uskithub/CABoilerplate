CABoilerplate
=============

# 0. プロジェクトの作成

## 0.1 プロジェクトの新規作成

TypeScript + pug + SASS

```shell
$ yarn create vite Joyn --template vue-ts
$ yarn add --dev pug sass
```

### importを "@/.." でアクセスできるようにする

```tsconfig.json
{
    "compilerOptions": {
        ...
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
            , "@views/*": ["src/service/presentation/views/*"]
        },
        ...
    },
}
```

## 0.2 フォルダ構成

以下のようにし、自動生成される `env.d.ts` は system/types 以下へ移動させます。

```
src/
  ├── service
  │   ├── application
  │   ├── domain
  │   │   ├── interfaces
  │   │   └── models
  │   ├── infrastructure
  │   └── presentation
  │       └── views
  ├── system
  │   └── types
  │       └── env.d.ts
  ├── App.vue
  └── main.ts
```

# 1. Routing

```shell
$ yarn add vue-router@4 rxjs
```

```App.vue
<script setup lang="ts">
</script>

<template lang="pug">
v-app
  router-view
</template>
```

