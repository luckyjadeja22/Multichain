import fetch from "node-fetch";

const CHAININFO_URL = "https://api.fogoscan.com/v1/common/chaininfo";

async function fetchTPS() {
  try {
    const res = await fetch(CHAININFO_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (!json.success) {
      console.log("API returned success=false");
      return;
    }

    const data = json.data;

    const tps = data?.networkInfo?.tps;
    const txCount = data?.networkInfo?.transactionCount;
    const blockHeight = data?.networkInfo?.blockHeight;
    const blockTime = data?.networkInfo?.blockTime;

    if (tps == null) {
      console.log("❌ TPS not found");
      return;
    }

    console.clear();
    console.log("🔥 Fogo Network Stats (from chaininfo)");
    console.log("------------------------------------");
    console.log("TPS:", tps.toFixed(2));
    console.log("Tx Count:", txCount);
    console.log("Block Height:", blockHeight);
    console.log("Avg Block Time:", blockTime, "ms");
    console.log("Updated:", new Date().toLocaleTimeString());

  } catch (e) {
    console.error("Error:", e.message);
  }
}

// poll every 3 seconds
setInterval(fetchTPS, 3000);
fetchTPS();