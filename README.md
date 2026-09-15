# NEST & NOOK — GitHub Pages向けサンプルEC

HTML / CSS / JavaScriptだけで動く、架空のライフスタイルECサイトです。ビルド作業は不要です。

## 公開方法

1. このフォルダの内容をGitHubリポジトリへpushします。
2. GitHubの `Settings` → `Pages` を開きます。
3. `Deploy from a branch` を選び、公開ブランチの `/ (root)` を指定します。

## GTMの設定

GTMコンテナ `GTM-N655JHJ` を `index.html` と `product.html` に設定済みです。Repro Web SDKはHTMLへ直接埋め込まず、GTMのカスタムHTMLタグとして配信する想定です。

GTMではReproタグのトリガーに `DOM Ready` を指定してください。Reproの公式手順に従い、GTMのカスタムHTMLへRepro管理画面で取得した計測タグとSDKトークンを設定します。

## dataLayerイベント

次のイベントを `dataLayer` へ送信します。GTMのカスタムイベントトリガーからGA4やRepro用タグに接続できます。

- `view_item_list`: 商品一覧表示
- `select_item`: 商品詳細リンクのクリック
- `view_item`: 商品詳細表示
- `add_to_cart`: カート追加
- `remove_from_cart`: カート削除
- `begin_checkout`: チェックアウトボタン
- `select_category`: カテゴリー絞り込み
- `newsletter_signup`: メール登録デモ

購入処理とメール送信はデモのため実行されません。
