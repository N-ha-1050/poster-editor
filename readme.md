---
title: "README"
author: "N_ha"
---

## ポスターサンプルと使い方

[poster-sample.md](https://poster.n-ha.jp/?sample) でサンプルのマークダウンをWebエディターで表示できます。

### CLI ツールの使い方

ローカルの Markdown ファイルからポスター HTML を生成したり、ブラウザでリアルタイムプレビューを行うことができます。

#### クローン不要で直接実行する場合 (npx)

プロジェクトをクローンせずに、GitHub から直接 CLI を実行できます。

```bash
# Markdown から HTML をビルド
npx github:N-ha-1050/poster-editor build sample.md

# プレビューサーバーを起動
npx github:N-ha-1050/poster-editor preview sample.md
```

#### GitHub からインストールして利用する場合 (npm install)

```bash
# グローバルにインストールして poster コマンドとして利用
npm install -g github:N-ha-1050/poster-editor
poster build sample.md

# 既存のプロジェクトに開発用依存関係として追加
npm install -D github:N-ha-1050/poster-editor
npx poster build sample.md
```

#### リポジトリ内から実行する場合

```bash
# ヘルプの表示
npm run poster -- --help

# 1. Markdown から HTML をビルド (デフォルトは <ファイル名>.html で出力)
npm run poster -- build sample.md

# 出力先パスを指定してビルド
npm run poster -- build sample.md -o output.html

# 2. ファイル変更を監視して自動で再ビルド (watch モード)
npm run poster -- build sample.md -w

# 3. ローカルプレビューサーバーを起動 (保存時の自動リロード & ローカル画像表示に対応)
npm run poster -- preview sample.md

# ポート番号を指定してプレビュー
npm run poster -- preview sample.md -p 8080
```

## 開発者向け導入方法

0. プロジェクトのクローンと移動

   `git clone https://github.com/N-ha-1050/poster-editor.git && cd poster-editor`

1. Node.js のインストール

    `npm -v` でインストール済みか確認できます。

   インストールされていない場合は <https://nodejs.org/ja/download> を参照してインストールしてください。

2. 依存関係のインストール

   `npm install`

3. lefthook のインストール (git hooks の同期)

   `npm run lefthook install`

4. 開発サーバーの起動

   `npm run dev`

   ブラウザで <http://localhost:5173> を開いてください。
