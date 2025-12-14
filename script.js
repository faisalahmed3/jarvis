// ===== TIME =====
const timeEl = document.getElementById("time");
setInterval(() => {
  timeEl.textContent = new Date().toUTCString();
}, 1000);

// ===== THEME TOGGLE =====
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// Persist theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}


// ===== API CALL =====
async function checkNews() {
  const text = document.getElementById("newsText").value.trim();
  const result = document.getElementById("result");

  if (!text) {
    result.innerHTML = "⚠ No signal detected.";
    return;
  }

  result.innerHTML = "🔍 Scanning neural patterns…";

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
    const verdict = data.verdict;

    const cls =
      verdict === "FAKE" ? "fake" :
      verdict === "REAL" ? "real" : "uncertain";

    const confidence =
      verdict === "FAKE"
        ? data.prob_fake ?? data.confidence / 100
        : verdict === "REAL"
        ? data.prob_real ?? data.confidence / 100
        : data.confidence / 100;

    result.innerHTML = `
      <div class="verdict ${cls}">
        VERDICT: ${verdict}
      </div>
      <div class="confidence">
        Confidence Level: ${(confidence * 100).toFixed(2)}%
      </div>
      <div class="confidence">
        ${data.note}
      </div>
    `;
  } catch (e) {
    result.innerHTML = "❌ Neural link disrupted.";
    console.error(e);
  }
}
