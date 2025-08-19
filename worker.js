export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 获取 pathname 去掉 /qrcode/req/
    let path = url.pathname.replace("/qrcode/req/", ""); 
    path = decodeURIComponent(path); // 避免 %2F 被截断
    const maid = path.replace(".html", ""); // 去掉 .html

    // 解析 query 参数
    const l = url.searchParams.get("l") || Math.floor(Date.now() / 1000) + 600; // 秒级
    const tHex = url.searchParams.get("t") || "";
    const dHex = url.searchParams.get("d") || "";

    // HEX → UTF-8 解码
    function fromHex(hex) {
      if (!hex) return "";
      const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
      return new TextDecoder().decode(bytes);
    }

    const title = fromHex(tHex) || "舞萌DX / 中二节奏 登入二维码";
    const desc = fromHex(dHex) || "把下方二维码对准机台扫描处，可用机台有【舞萌DX】和【中二节奏】";

    // 二维码内容 = SGWC + 完整文件名（不带.html）
    const qrData = "SGWC" + maid;

    // 过期时间（毫秒）
    const expire = parseInt(l) * 1000;

    // 生成 HTML 页面
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>${title}</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        html, body { border: none; padding: 0; margin: 0; width: 100%; height: 100%; background-color: white; }
        .contents { position: relative; height: 90%; width: 100%; }
        .main { height: 100%; width: 100%; display: table; }
        .wrapper { display: table-cell; height: 100%; text-align: center; vertical-align: middle; }
        .header { position: absolute; top: 0; font-size: 20px; line-height: 30px; text-align: center; width: 100%; }
        .footer { position: absolute; bottom: 0; font-size: 20px; line-height: 30px; text-align: center; width: 100%; color:#cc0000; font-weight:bold; }
        .line-break { word-wrap: break-word; }
    </style>
</head>
<body>
    <div class="contents">
        <div class="header line-break">${desc}</div>
        <div class="main">
            <div class="wrapper">
                <div id="qrcode"></div>
            </div>
        </div>
        <div class="footer">有效期限 : </div>
    </div>

    <script>
        var qrData = ${JSON.stringify(qrData)};
        var expireTime = ${expire};

        new QRCode(document.getElementById("qrcode"), {
            text: qrData,
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.L
        });

        setTimeout(function () { $("img").css("display", ""); }, 50);

        var date = new Date(expireTime);
        var m = ("0" + (date.getMonth() + 1)).slice(-2);
        var d = ("0" + date.getDate()).slice(-2);
        var h = ("0" + date.getHours()).slice(-2);
        var minute = ("0" + date.getMinutes()).slice(-2);

        var expireTimeStr = "有效期限 : " + m + "/" + d + " " + h + ":" + minute;
        $(".footer").text(expireTimeStr);
    </script>
</body>
</html>
`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  }
}
