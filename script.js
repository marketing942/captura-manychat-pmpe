/* =========================================================
   CPPEM — Formulário → Google Sheets + redirect Instagram (ManyChat)
   ========================================================= */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxdFplWVSfhTjvyIA7HIWb645xRjGNhBVhTdTf5UMjo0lSpW_A_jCuys0qB4uImKXPQ/exec";

// Link de retorno ao Instagram/ManyChat (DM) — ?ref= dispara o fluxo no ManyChat
const INSTAGRAM_URL = "https://ig.me/m/prof.evertonmota?ref=pmpe";

/* --- Máscara: (00) 00000-0000 --- */
const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let d = telefoneInput.value.replace(/\D/g, "").slice(0, 11);
  let out = "";
  if (d.length > 0)  out  = "(" + d.slice(0, 2);
  if (d.length >= 2) out += ") ";
  if (d.length > 2)  out += d.slice(2, 7);
  if (d.length > 7)  out += "-" + d.slice(7, 11);
  telefoneInput.value = out;
});

/* --- Validação --- */
function setError(id, msg) {
  document.getElementById(id).classList.add("is-invalid");
  document.querySelector(`[data-error-for="${id}"]`).textContent = msg;
}
function clearError(id) {
  document.getElementById(id).classList.remove("is-invalid");
  document.querySelector(`[data-error-for="${id}"]`).textContent = "";
}
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate() {
  let ok = true;
  const nome  = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tel   = telefoneInput.value.replace(/\D/g, "");

  ["nome","email","telefone"].forEach(clearError);

  if (nome.length < 2) { setError("nome",     "Informe seu nome completo.");  ok = false; }
  if (!isEmail(email)) { setError("email",    "Informe um e-mail válido.");   ok = false; }
  if (tel.length < 11) { setError("telefone", "Informe o telefone com DDD."); ok = false; }

  return ok;
}

/* --- Envio --- */
document.getElementById("lead-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled    = true;
  btn.textContent = "ENVIANDO...";

  const payload = {
    nome:     document.getElementById("nome").value.trim(),
    email:    document.getElementById("email").value.trim(),
    telefone: telefoneInput.value.trim(),
  };

  try {
    await fetch(SHEET_URL, {
      method:  "POST",
      mode:    "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    e.target.reset();

    // Dispara evento Lead no Meta Pixel
    if (typeof fbq !== "undefined") fbq('track', 'Lead');

    // Mostra mensagem de sucesso
    const successEl = document.getElementById("form-success");
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // Contagem regressiva 3s → volta ao Instagram (ManyChat)
    const countEl = document.getElementById("countdown");
    let seg = 3;
    const timer = setInterval(() => {
      seg--;
      if (countEl) countEl.textContent = seg;
      if (seg <= 0) {
        clearInterval(timer);
        window.open(INSTAGRAM_URL, "_blank");
      }
    }, 1000);

  } catch (err) {
    setError("telefone", "Erro ao enviar. Tente novamente.");
  } finally {
    btn.disabled    = false;
    btn.textContent = "QUERO RECEBER ORIENTAÇÃO";
  }
});
