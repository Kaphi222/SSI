import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy public bạn cung cấp
const PROXY = "http://103.82.37.52:41205";

app.get("/ssi", async (req, res) => {
  const stock = req.query.stock || "NVL";
  const targetURL = `https://iboard-api.ssi.com.vn/statistics/reports/export-le-table?stockSymbol=${stock}&lang=vi`;

  try {
    const agent = new HttpsProxyAgent(PROXY);

    const response = await fetch(targetURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/csv,application/json,text/plain,*/*",
        "Referer": "https://iboard.ssi.com.vn/",
        "Origin": "https://iboard.ssi.com.vn",
      },
      agent,
    });

    if (!response.ok) return res.status(500).send(`SSI API error ${response.status}`);

    const csvText = await response.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvText);

  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
