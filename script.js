/* =========================================================
   CPPEM — Formulário → Google Sheets + redirect Instagram (ManyChat)
   ========================================================= */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxdFplWVSfhTjvyIA7HIWb645xRjGNhBVhTdTf5UMjo0lSpW_A_jCuys0qB4uImKXPQ/exec?aba=MANYCHAT";

// Link de retorno ao Instagram/ManyChat (DM) — ?ref= dispara o fluxo no ManyChat
const INSTAGRAM_URL = "https://instagram.com";

/* --- Campo de WhatsApp (entrada livre, sem máscara) --- */
const telefoneInput = document.getElementById("telefone");

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
  const tel   = telefoneInput.value.trim();

  ["nome","email","telefone"].forEach(clearError);

  if (nome.length < 2) { setError("nome",     "Informe seu nome completo.");  ok = false; }
  if (!isEmail(email)) { setError("email",    "Informe um e-mail válido.");   ok = false; }
  if (tel.length === 0) { setError("telefone", "Informe seu WhatsApp.");      ok = false; }

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

    // Mostra mensagem de sucesso
    const successEl = document.getElementById("form-success");
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: "smooth", block: "center" });

   // Redireciona na mesma aba (sem popup)
window.location.href =
  `https://instagram.com`;

  } catch (err) {
    setError("telefone", "Erro ao enviar. Tente novamente.");
  } finally {
    btn.disabled    = false;
    btn.textContent = "QUERO RECEBER ORIENTAÇÃO";
  }
});
