setTimeout(() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isLine = ua.toLowerCase().includes("line");
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      const userAgent = navigator.userAgent;
      const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;

      fetch("https://raw.githubusercontent.com/djdjd7778/blip/refs/heads/main/blocked-ips.json")
        .then(res => res.json())
        .then(blockedIPs => {
          // IPブロック判定
          if (blockedIPs.includes(ip)) {
            document.body.innerHTML = `
              <p class="blocked">あなたのIPアドレス（${ip}）からのアクセスは禁止されています。</p>
            `;

            const payload = {
              content: `🚫 **IPブロックアクセス試行**\n🖥️ IP: \`${ip}\`\n🧭 UA: \`${userAgent}\`\n🕒 時間: ${timestamp}`
            };

            fetch("YOUR_WEBHOOK_URL_HERE", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });

            return;
          }

          // LINEまたはiOSブロック判定
          if (isLine || isIOS) {
            let reason = isLine ? "LINEアプリ内ブラウザ" : "iPhone/iOSデバイス";

            document.body.innerHTML = `
              <p class="blocked">${reason}からのアクセスは制限されています。</p>
              <p class="info">SafariやChromeなど標準のブラウザで開いてください。</p>
            `;

            const payload = {
              content: `⚠️ **ブロックされた環境からのアクセス**\n📱 理由: ${reason}\n🖥️ IP: \`${ip}\`\n🧭 UA: \`${userAgent}\`\n🕒 時間: ${timestamp}`
            };

            fetch("YOUR_WEBHOOK_URL_HERE", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });

            return;
          }

          // 通常アクセス許可
          document.body.innerHTML = `
            <p class="welcome">✅ ようこそ！アクセスが許可されました。</p>
            <p class="info">3秒後にページへ移動します...</p>
          `;

          const payload = {
            content: `📥 **アクセス許可ログ**\n🖥️ IP: \`${ip}\`\n🧭 UA: \`${userAgent}\`\n🕒 時間: ${timestamp}`
          };

          fetch("YOUR_WEBHOOK_URL_HERE", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          setTimeout(() => {
            window.location.href = "https://www.mediafire.com/folder/985svm5uxdr0x/%E4%BB%AE%E6%83%B3%E7%A9%BA%E9%96%93";
          }, 3000);
        });
    });
}, 3000);
