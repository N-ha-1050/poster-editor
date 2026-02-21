---
title: "README"
author: "N_ha"
---

## 導入

0. プロジェクトのクローンと移動

   `git clone https://github.com/N-ha/poster-editor.git && cd poster-editor`

1. Node.js のインストール

    `npm -v` でインストール済みか確認できます。

   インストールされていない場合は <https://nodejs.org/ja/download> を参照してインストールしてください。

2. 依存関係のインストール

   `npm install`

3. lefthook のインストール (git hooks の同期)

   `npm run lefthook install`

## (自分用)新規環境構築手順

0. プロジェクトディレクトリの作成と移動、Git の初期化

   `mkdir poster-editor && cd poster-editor && git init`

1. Node.js のインストール

   先述

2. vite プロジェクトの作成

   `npm create vite@latest .`

   選択はデフォルトのままで問題ありません。

   - `Select a framework:` で `vanilla` を選択
   - `Select a variant:` で `TypeScript` を選択
   - `Install with npm and start now?` で `Yes` を選択
  
3. Biome のインストール

   `npm install -D -E @biomejs/biome`

4. Biome の初期化

   `biome init`

5. Lefthook のインストール

   `npm install lefthook --save-dev`

6. Biome の設定

   - VSCode の Biome 拡張機能をインストール

     <https://biomejs.dev/ja/reference/vscode/>

     `.vscode/settings.json` を作成して以下の内容を追加

     ```json
     {
       "editor.defaultFormatter": "biomejs.biome",
       "biome.enabled": true,
       "editor.formatOnSave": true,
       "editor.codeActionsOnSave": {
         "source.fixAll.biome": "explicit",
         "source.organizeImports.biome": "explicit"
       }
     }
     ```

   - `package.json` の `scripts` に biome のコマンドを追加

   - `biome.json` を編集

   - 継続的インテグレーションの設定

     <https://biomejs.dev/ja/recipes/continuous-integration/>

     `.github/workflows/pull_request.yml` を作成

   - git hooks の設定

     <https://biomejs.dev/ja/recipes/git-hooks/>

     `lefthook.yml` を作成して `npm run lefthook install` を実行

7. GitHub Pages へのデプロイ設定

   <https://ja.vite.dev/guide/static-deploy>

   `vite.config.ts` と `.github/workflows/deploy.yml` を作成
