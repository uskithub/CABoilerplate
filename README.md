CABoilerplate
=============

1. フォルダ構成
2. Viewの表示
3. ユースケースのコードによる表現
4. ドメインモデルの実装
5. プレゼンテーション層でのユースケース呼び出し
6. インフラ層と依存性逆転の原則
7. 振る舞い駆動開発

# 1. プロジェクトの作成

## 1.1 プロジェクトの新規作成

TypeScript + pug + SASS

```shell
$ yarn create vite CABoilerplate --template vue-ts
$ yarn add --dev pug sass
```

### importを "@/.." でアクセスできるようにする

TypeScript側とVite側の両方でパスのエイリアスを指定する必要があります。

```shell
$ yarn add --dev @types/node
```

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

```vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
  , resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/")
      , "@views": path.resolve(__dirname, "src/service/presentation/views")
    }
  }
})

```

## 1.2 フォルダ構成

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

# 2. Viewの表示

## 2.1 Viewを作成する

src/service/presentation/views 以下に Home.vueと Signin.vueを用意します。

```Home.vue
<script setup lang="ts">
</script>

<template lang="pug">
h1 Home
router-link(to="/signin") -> Signin
</template>
```

```Signin.vue
<script setup lang="ts">
</script>

<template lang="pug">
h1 Signin
</template>
```

## 2.2 ルーティングを実装する

Vue Router 4.x を利用します。

```shell
$ yarn add vue-router@4 rxjs
```

```App.vue
<script setup lang="ts">
</script>

<template lang="pug">
router-view
</template>
```

```main.ts
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from '@views/Home.vue'
import Signin from '@views/Signin.vue'

const routes = [
    { path: '/', component: Home }
    , { path: '/signin', component: Signin }
]

const router = createRouter({
    history: createWebHashHistory()
    , routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
```

# 3. ユースケースのコードによる表現

ここではユースケースを const enum と Union型で表現します。

## 3.1 ユースケースシナリオの記述

service/application/useasesフォルダを作成し、boot.ts ファイルを新規作成します。

ユースケースシナリオを以下のように const enum で表現します。
また、シナリオの各シーンをUnion型で定義します。


```boot.ts
/**
 * usecase: アプリを起動する
 */
export const enum Boot {
    /* 基本コース */
    userOpenSite = "ユーザはサイトを開く"
    , serviceCheckSession = "サービスはセッションがあるかを確認する"
    , sessionExistsThenPresentHome = "セッションがある場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , sessionNotExistsThenPreesntSignin = "セッションがない場合_サービスはログイン画面を表示する"
}

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
export type BootContext = { scene: Boot.userOpenSite }
    | { scene: Boot.serviceCheckSession }
    | { scene: Boot.sessionExistsThenPresentHome }
    | { scene: Boot.sessionNotExistsThenPreesntSignin }
;
```

## 3.2 ユースケースの実装

const enumで定義したユースケースのシナリオを実行可能にします。
具体的にはシナリオの一つひとつのシーンをSceneオブジェクトとして定義し、これを再起呼び出しを使って処理していくようにします。

system/interfacesフォルダを作成し、usecase.ts ファイルを新規作成します。

```usecase.ts
import { Observable, of } from "rxjs";
import { mergeMap, map } from "rxjs/operators";

interface Scene<T> {
    context: T;
    next: () => Observable<this> | null;
}

export abstract class AbstractScene<T> implements Scene<T> {
    abstract context: T;
    abstract next(): Observable<this> | null;

    protected instantiate(nextContext: T): this {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (this.constructor as any)(nextContext);
    }

    just(nextContext: T): Observable<this> {
        return of(this.instantiate(nextContext));
    }
}

export class Usecase {

    static interact<T, U extends Scene<T>>(initialScene: U): Observable<T[]> {

        const _interact = (senario: U[]): Observable<U[]> => {
            const lastScene = senario.slice(-1)[0];
            const observable = lastScene.next();

            // 再帰の終了条件
            if (!observable) {
                // console.log(`[usecase:${lastScene.constructor.name.replace("Scene", "")}:${senario.length-1}:END    ]`, lastScene.context );
                return of(senario);
            } else {
                const tag = (senario.length === 1) ? "START  " : "PROCESS";
                // console.log(`[usecase:${lastScene.constructor.name.replace("Scene", "")}:${senario.length-1}:${tag}]`, lastScene.context );
            }

            // 再帰処理
            return observable
                .pipe(
                    mergeMap((nextScene: U) => {
                        senario.push(nextScene);
                        return _interact(senario);
                    })
                );
        };

        return _interact([initialScene])
            .pipe(
                map((scenes: U[]) => {
                    const performedSenario = scenes.map(scene => scene.context);
                    console.log("performedSenario:", performedSenario);
                    return performedSenario;
                })
            );
    }
}
```

BootSceneをSceneインタフェースに準拠するようにし、next関数を実装します。
next関数は、自身が表すシーンの次のシーンを指定します。処理終了の場合には null を返すようにします。

```boot.ts
export class BootScene extends AbstractScene<BootContext> {
    context: BootContext;

    constructor(context: BootContext = { scene: Boot.userOpenSite }) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case Boot.userOpenSite: {
            // TODO
        }
        case Boot.serviceCheckSession : {
            // TODO
        }
        case Boot.sessionExistsThenPresentHome: {
            // TODO
        }
        case Boot.sessionNotExistsThenPreesntSignin: {
            // TODO
        }
        }
    }
}
```

例えば以下のようにし、check関数の中でサインインセッションがあるか否かを調べることとします。

```boot.ts
    next(): Observable<this>|null {
        switch (this.context.scene) {
        case Boot.userOpenSite: {
            return this.just({ scene: Boot.serviceCheckSession });
        }
        case Boot.serviceCheckSession : {
            return this.check();
        }
        case Boot.sessionExistsThenPresentHome: {
            return null;
        }
        case Boot.sessionNotExistsThenPreesntSignin: {
            return null;
        }
        }
    }
```

```boot.ts
    private check(): Observable<this> {
        if (/* TODO: ドメインモデルが持つメソッドが結果を返すようにする */ false) {
            return of(this.instantiate({ scene: Boot.sessionExistsThenPresentHome }));
        } else {
            return of(this.instantiate({ scene: Boot.sessionNotExistsThenPreesntSignin }));
        }
    }
```

# 5. プレゼンテーション層でのユースケース呼び出し

ユーザの入力イベントなどをトリガーとして、プレゼンテーション層からユースケースを実行する必要があります。

## 5.1 ユースケースの実行

以下のように、Bootユースケースを初期化し、interact関数を実行し、結果をサブスクライブするようにします（これをどこに実装するかについては5.2参照）。
結果は実際に実行されたSceneの配列（これをscenarioと呼ぶことにします）で返ってくるので、その最後のSceneが何だったかによって、次の処理を変更します。

```typescript
import { Usecase } from '@/system/interfaces/usecase';
import { Boot, BootScene } from '@usecases/boot';
import type { BootContext } from '@usecases/boot';
import { Subscription } from 'rxjs';

const boot = () => {
    let subscription: Subscription|null = null;
    subscription = Usecase
        .interact<BootContext, BootScene>(new BootScene())
        .subscribe({
            next: (performedSenario) => {
                const lastContext = performedSenario.slice(-1)[0];
                switch(lastContext.scene){
                    case Boot.sessionExistsThenPresentHome:
                        // TODO
                        break;
                    case Boot.sessionNotExistsThenPreesntSignin:
                        // TODO
                        break;
                }
            }
            , error: (e) => console.error(e)
            , complete: () => {
                console.info('complete')
                subscription?.unsubscribe();
            }
        });
};
```

# firebase

```shell
$ yarn add firebase
```


# Vuetify

vue-cliを入れる

```shell
$ yarn global add @vue/cli
```

```shell
$ vue add vuetify

? Choose a preset: (Use arrow keys)
  Configure (advanced)
  Default (recommended)
❯ Vite Preview (Vuetify 3 + Vite)
  Prototype (rapid development)
  Vuetify 3 Preview (Vuetify 3)
```

src以下にpluginsフォルダができるので、system以下に移動する。
vite.config.jsファイルが自動生成されるので、（.tsと重複するため）削除し、.tsを以下のように書き換える。

```vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from '@vuetify/vite-plugin'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    , vuetify({
      autoImport: true,
    })
  ]
  , define: { 'process.env': {} }
  ...
})
```

```main.ts
import { createApp } from 'vue'
import vuetify from '@/system/plugins/vuetify'
import { loadFonts } from '@/system/plugins/webfontloader'
...
loadFonts()

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');
```

```App.vue
<script setup lang="ts">
</script>

<template lang="pug">
v-app
  v-main
    router-view
</template>
```