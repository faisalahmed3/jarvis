// ===== TIME =====
const timeEl = document.getElementById("time");
setInterval(() => {
  timeEl.textContent = new Date().toUTCString();
}, 1000);

// ===== THEME TOGGLE =====
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// ===== API CALL =====
async function checkNews() {
  const text = document.getElementById("newsText").value.trim();
  const result = document.getElementById("result");

  if (!text) {
    result.innerHTML = "No report received.";
    return;
  }

  result.innerHTML = "Analyzing credibility…";

  try {
    const res = await fetch(
      "https://faisalahmed3-veritas-intel-api.hf.space/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      }
    );

    const data = await res.json();

    // === FIX STARTS HERE ===
    const verdict = data.verdict; // REAL | FAKE | UNCERTAIN

    const cls =
      verdict === "FAKE"
        ? "fake"
        : verdict === "REAL"
        ? "real"
        : "uncertain";

    const confidence =
      verdict === "FAKE"
        ? data.prob_fake
        : verdict === "REAL"
        ? data.prob_real
        : data.confidence / 100;

    result.innerHTML = `
      <div class="verdict ${cls}">
        VERDICT: ${verdict}
      </div>
      <div class="confidence">
        Confidence level: ${(confidence * 100).toFixed(2)}%
      </div>
      <div class="confidence">
        Editorial note: ${data.note}
      </div>
    `;
    // === FIX ENDS HERE ===

  } catch (err) {
    result.innerHTML = "Secure channel failure. Scan aborted.";
    console.error(err);
  }
}
