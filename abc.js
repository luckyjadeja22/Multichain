const axios = require("axios");

const FOGOSCAN_PERF_URL = "https://api.fogoscan.com/v2/system/performance";

async function fetchTPS() {
  try {
    const res = await axios.get(FOGOSCAN_PERF_URL, {
      timeout: 5000,
    });

    const data = res.data;

    if (!Array.isArray(data) || data.length === 0) {
      console.log("No performance data");
      return;
    }

    const latest = data[0];

    const tps =
      latest.numTransactions / latest.samplePeriodSecs;

    console.clear();
    console.log("🔥 Fogo Network Stats");
    console.log("---------------------");
    console.log("TPS:", tps.toFixed(2));
    console.log("Transactions:", latest.numTransactions);
    console.log("Sample Period (sec):", latest.samplePeriodSecs);
    console.log("Slot:", latest.slot);
    console.log("Updated at:", new Date().toLocaleTimeString());

  } catch (err) {
    console.error("Error fetching TPS:", err.message);
  }
}

// fetch every 3 seconds (safe & realistic)
setInterval(fetchTPS, 3000);

// initial fetch
fetchTPS();