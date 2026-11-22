---
title: "Poster Sample"
authors:
    筆頭著者: "所属1"
    共著者1: "所属1"
    共著者2:
        - "所属1"
        - "所属2"
style:
  # color
  colorCommonBackground: "white"
  colorCommonText: "black"
  colorCommonBorder: "black"
  colorKeyBackground: "#8fc231"
  colorOnKeyBackground: "white"
  colorKeyPrimary: "#689f39"

  # font-size
  fontSizeTitle: "96px"
  fontSizeAuthor: "54px"
  fontSizeAffiliation: "54px"
  fontSizeSectionTitle: "64px"
  fontSizeSubsectionTitle: "36px"
  fontSizeContent: "24px"
  fontSizeCaption: "16px"
  fontSizeSmall: "12px"

  # spacing
  paddingFrame: "64px 96px"
  paddingTitle: "48px"
  paddingSectionTitle: "36px 48px"
  paddingSectionContent: "24px 48px"
  paddingList: "0 0 8px 0"
  marginSubsectionTitle: "36px 0"
  gapAuthorAffiliation: "24px"
  gapContent: "64px"
  gapTitleContent: "48px"

  # layout
  sizeWidth: "841mm"
  sizeHeight: "1189mm"
  layoutColumns: 2
---

## フロントマター

上記のように、マークダウンの冒頭で `---` の間に YAML 形式でメタデータを記載することができます。

### Title

タイトルを文字列で指定します。

### Authors

著者をマップ形式で指定します。キーが著者名の文字列、値が所属の文字列かその配列、または、 `null` になります。 `null` や空文字列の場合は所属なしとして扱われます。同一の所属の著者が複数いる場合は、所属を同じ値にすることでまとめて表示されます。一名のみの場合は `author` を使って `author: 著者名` とすることができます。

### Style

スタイルを `style` にマップ形式で指定します。上記フロントマターではすべてのプロパティのデフォルト値を指定しています。

- `size` は、ポスターのサイズを指定します。以下の値に対応しています。

  - ISO Aシリーズの `A0` ~ `A10`
  - ISO Bシリーズの `B0` ~ `B10`
  - JIS Bシリーズの `JIS-B0` ~ `JIS-B10`
  - 北米サイズの `letter` 、 `legal` および `ledger`
  
  `size` の代わりに `sizeWidth` と `sizeHeight` を指定することもできます。これらは CSS に直接対応しており、CSS の値をそのまま指定できます。重複して指定された場合は `size` が優先されます。
- `color*`, `fontSize*`, `padding*`, `margin*`, `gap*` は、それぞれ色、フォントサイズ、内側余白、外側余白、要素間の隙間を指定します。これらは CSS に直接対応しており、CSS の値をそのまま指定できます。
  - 色の指定について WCAG 2.1 AA に準拠するため、以下の組み合わせはコントラスト比が 4.5:1 以上になるように設定することを推奨します。
    - `colorCommonBackground` と `colorCommonText`
    - `colorCommonBackground` と `colorKeyPrimary`
    - `colorKeyBackground` と `colorOnKeyBackground`
- `layoutColumns` は、セクションの内容を横に並べる列数を指定します。

## エディターの機能

画面左のエディターには、マークダウン形式でテキストを入力できます。

### エディターへのドラッグアンドドロップ

一覧にあるファイルは読み込みを試みますが、すべてのファイルがサポートされているわけではありません。

- テキストファイル: [一覧](https://www.iana.org/assignments/media-types/media-types.xhtml#text)
  - 現在のカーソル位置にテキストが挿入されます。
- 画像ファイル: [一覧](https://www.iana.org/assignments/media-types/media-types.xhtml#image)
  - 現在のカーソル位置に画像が挿入されます。画像は Base64 エンコードされてマークダウンに埋め込まれます。
  - この機能は簡易的なものです。大きな画像を挿入すると、マークダウンのサイズが非常に大きくなります。画像はホスティングサービスなどにアップロードして URL で指定することを推奨します。

### エディターでのショートカットキー

基本的には [Monaco Editor](https://microsoft.github.io/monaco-editor/) のキーマップに従います。以下は、追加で設定されているショートカットキーです。

- `Ctrl + S` (`Cmd + S`): ローカルストレージに内容を保存します。
- `Ctrl + O` (`Cmd + O`): ローカルストレージから内容を読み込みます。
- `Ctrl + E` (`Cmd + E`): ローカルストレージの内容を削除します。
- `Ctrl + Shift + S` (`Cmd + Shift + S`): マークダウンファイルを保存します。
- `Ctrl + Shift + O` (`Cmd + Shift + O`): マークダウンファイルを読み込みます。
- `Ctrl + M` (`Cmd + M`): エディターの内容を削除します。

---

**以降は、マークダウンの機能を紹介するサンプルです。**

## セクションタイトル

### サブセクションタイトル

## 段落と改行

これは1つ目の段落です。
改行は反映されません。

これは2つ目の段落です。\
改行を反映させたい場合は、行末にバックスラッシュを入れます。

## 引用

> これは引用文です。

## 箇条書きと番号付きリスト

### 箇条書き

- 箇条書き1
  - 箇条書き1-1
    - 箇条書き1-1-1

### 番号付きリスト

1. 番号付きリスト1
   1. 番号付きリスト1-1
      1. 番号付きリスト1-1-1

## コードと数式

### コード

コードブロック

```python
print("Hello, World!")
```

`print("Hello, World!")` はインラインコードです。

### 数式

ブロック数式

$$
f(x) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\}
$$

$f(x) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\}$ はインライン数式です。

## 表

| 左寄せ | 中央寄せ | 右寄せ |
| :----- | :------: | -----: |
| セル1  |  セル2   |  セル3 |
| セル4  |  セル5   |  セル6 |

## リンク

[これ](https://poster.n-ha.jp/) はリンクです。

プレビューや印刷時には見た目のみ反映されますが、 HTML 形式で保存した際にはリンクとして機能します。

## 強調と打ち消し線

*これ* は強調(斜体)です。

**これ** は強い強調(太字、色付き)です。

~~これ~~ は打ち消し線です。

## 画像

![説明文](https://poster.n-ha.jp/favicon.svg){height=64px, width=64px}

![絶対位置を指定した画像](https://poster.n-ha.jp/favicon.svg){right=128px, bottom=960px, height=128px, width=128px}

## 横並びと小さい文字

:::::row
左の内容

:::column
中央の内容

これは縦に並びます。
:::

右の内容
:::::

画像の横並び

:::row
![左の画像](https://poster.n-ha.jp/favicon.svg){height=64px, width=64px}
![右の画像](https://poster.n-ha.jp/favicon.svg){height=64px, width=64px}
:::

:::small
小さく表示されるテキストです。
:::
