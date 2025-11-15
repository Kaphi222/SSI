import express from "express";
import fetch from "node-fetch";
import pkg from "https-proxy-agent";
const { HttpsProxyAgent } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

// Residential proxy với user/pass
const PROXY = "http://shopuytin49901:v58kt@103.82.132.171:49901";

// Route root: hiển thị thông báo
app.get("/", (req, res) => {
  res.send("SSI Proxy server is running. Use /ssi?stock=XXX to fetch data.");
});

// Route fetch SSI CSV
app.get("/ssi", async (req, res) => {
  try {
    const stock = req.query.stock || "NVL";
    const targetURL = `https://iboard-api.ssi.com.vn/statistics/reports/export-le-table?stockSymbol=${stock}&lang=vi`;

    const agent = new HttpsProxyAgent(PROXY);

    const response = await fetch(targetURL, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/csv,application/json,text/plain,*/*",
        "Referer": "https://iboard.ssi.com.vn/",
        "Origin": "https://iboard.ssi.com.vn",
      },
      agent
    });

    if (!response.ok) return res.status(500).send("SSI API error: " + response.status);

    const csv = await response.text();

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csv);

  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
