import express from "express";
import fetch from "node-fetch"; // hoặc npm i node-fetch
import csvStringify from "csv-stringify/lib/sync"; // npm i csv-stringify

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Thông tin proxy dân cư ----
const PROXY = "http://ccjgoomn:ce6da4dqld55@38.153.152.244:9594";

app.get("/ssi", async (req, res) => {
  try {
    const stock = req.query.stock || "NVL";
    const targetURL = `https://iboard-api.ssi.com.vn/statistics/reports/export-le-table?stockSymbol=${stock}&lang=vi`;

    // Node-fetch + proxy
    const HttpsProxyAgent = (await import("https-proxy-agent")).default;
    const agent = new HttpsProxyAgent(PROXY);

    const response = await fetch(targetURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/csv,application/json,text/plain,*/*",
        "Referer": "https://iboard.ssi.com.vn/",
        "Origin": "https://iboard.ssi.com.vn",
      },
      agent,
    });

    if (!response.ok) {
      return res.status(500).json({ error: true, status: response.status });
    }

    const csvText = await response.text();

    // Trả CSV nguyên bản
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvText);
  } catch (err) {
    res.status(500).json({ error: true, message: err.toString() });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
