import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Proxy bạn cung cấp (không user/pass)
const PROXY = "http://103.82.37.52:41205";

app.get("/ssi", async (req, res) => {
  try {
    const stock = req.query.stock || "NVL";
    const target = `https://iboard-api.ssi.com.vn/statistics/reports/export-le-table?stockSymbol=${stock}&lang=vi`;

    const agent = new HttpsProxyAgent(PROXY);

    const response = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/csv,application/json,text/plain,*/*",
        "Accept-Language": "vi,en-US;q=0.9",
        "Origin": "https://iboard.ssi.com.vn",
        "Referer": "https://iboard.ssi.com.vn/"
      },
      agent
    });

    if (!response.ok) {
      return res.status(500).send("SSI API error: " + response.status);
    }

    const csv = await response.text();

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csv);

  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log("Proxy server chạy trên port " + PORT);
});
