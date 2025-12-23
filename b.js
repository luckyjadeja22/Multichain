import fetch from "node-fetch";

const CHAININFO_URL = "https://api.fogoscan.com/v1/common/chaininfo";

let lastTxCount = null;
let lastTime = null;

async function fetchTPS() {
  try {
    const res = await fetch(CHAININFO_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    /**
     * Typical fields (names may vary slightly):
     * data.transactionCount
     * data.blockHeight
     * data.blockTime
     */

    const txCount =
      data.transactionCount ||
      data.txCount ||
      data.totalTransactions;

    if (!txCount) {
      console.log("❌ txCount not found in response");
      console.log(data);
      return;
    }

    const now = Date.now();

    if (lastTxCount !== null) {
      const txDiff = txCount - lastTxCount;
      const timeDiffSec = (now - lastTime) / 1000;

      const tps = txDiff / timeDiffSec;

      console.clear();
      console.log("🔥 Fogo TPS (derived from chaininfo)");
      console.log("--------------------------------");
      console.log("TPS:", tps.toFixed(2));
      console.log("Tx delta:", txDiff);
      console.log("Interval:", timeDiffSec.toFixed(2), "sec");
      console.log("Block height:", data.blockHeight);
      console.log("Updated:", new Date().toLocaleTimeString());
    }

    lastTxCount = txCount;
    lastTime = now;

  } catch (e) {
    console.error("Error fetching chaininfo TPS:", e.message);
  }
}

// poll every 3 seconds (same as explorer refresh)
setInterval(fetchTPS, 3000);
fetchTPS();