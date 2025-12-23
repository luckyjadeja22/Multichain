import fetch from "node-fetch";

const URL = "https://api.fogoscan.com/v1/common/chaininfo";

let last = {
  tps: null,
  txCount: null,
  blockHeight: null,
  tpsTime: null,
  txTime: null,
  blockTime: null
};

async function poll() {
  try {
    const res = await fetch(URL);
    const json = await res.json();

    const net = json?.data?.networkInfo;
    if (!net) return;

    const now = Date.now();

    // --- TPS change detection ---
    if (last.tps !== null && net.tps !== last.tps) {
      console.log(
        `🟢 TPS changed: ${last.tps.toFixed(2)} → ${net.tps.toFixed(2)} | after ${((now - last.tpsTime) / 1000).toFixed(1)}s`
      );
      last.tpsTime = now;
    }

    // --- Tx count change detection ---
    if (last.txCount !== null && net.transactionCount !== last.txCount) {
      console.log(
        `🔵 TxCount changed by ${net.transactionCount - last.txCount} | after ${((now - last.txTime) / 1000).toFixed(1)}s`
      );
      last.txTime = now;
    }

    // --- Block height change detection ---
    if (last.blockHeight !== null && net.blockHeight !== last.blockHeight) {
      console.log(
        `🟣 BlockHeight +${net.blockHeight - last.blockHeight} | after ${((now - last.blockTime) / 1000).toFixed(1)}s`
      );
      last.blockTime = now;
    }

    // init timestamps
    if (last.tps === null) last.tpsTime = now;
    if (last.txCount === null) last.txTime = now;
    if (last.blockHeight === null) last.blockTime = now;

    last.tps = net.tps;
    last.txCount = net.transactionCount;
    last.blockHeight = net.blockHeight;

  } catch (e) {
    console.error("Error:", e.message);
  }
}

// 1 second polling
setInterval(poll, 1000);
poll();