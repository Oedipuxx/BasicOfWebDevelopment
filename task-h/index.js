// Task H — Custom validation + append rows (no page reload)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  const tbody = document.getElementById("submissions");

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    birthDate: document.getElementById("birthDate"),
    terms: document.getElementById("terms"),
    timestamp: document.getElementById("timestamp"),
  };

  const errors = {
    fullName: document.getElementById("err-fullName"),
    email: document.getElementById("err-email"),
    phone: document.getElementById("err-phone"),
    birthDate: document.getElementById("err-birthDate"),
    terms: document.getElementById("err-terms"),
  };

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
    Object.values(fields).forEach((el) => {
      if (el && el.removeAttribute) el.removeAttribute("aria-invalid");
    });
  }
  function setError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (inputEl && inputEl.setAttribute) inputEl.setAttribute("aria-invalid", "true");
  }

  function validate() {
    clearErrors();
    let ok = true;

    const name = (fields.fullName.value || "").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length < 2 || parts.some((p) => p.length < 2)) {
      setError(fields.fullName, errors.fullName,
        "Please enter your full name (first and last), each at least 2 letters.");
      ok = false;
    }

    const email = (fields.email.value || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) {
      setError(fields.email, errors.email, "Enter a valid email like name@example.com.");
      ok = false;
    }

    const phone = (fields.phone.value || "").trim();
    const phoneOk = /^\+358\d{8,12}$/.test(phone) || /^0\d{7,10}$/.test(phone);
    if (!phoneOk) {
      setError(fields.phone, errors.phone,
        "Use +358XXXXXXXX (8–12 digits) or 0XXXXXXXX (7–10 digits).");
      ok = false;
    }

    const bdStr = fields.birthDate.value;
    const today = new Date();
    if (!bdStr) {
      setError(fields.birthDate, errors.birthDate, "Select your birth date.");
      ok = false;
    } else {
      const bd = new Date(bdStr + "T00:00:00");
      if (isNaN(bd.getTime())) {
        setError(fields.birthDate, errors.birthDate, "Birth date is invalid.");
        ok = false;
      } else {
        if (bd > new Date(today.toDateString())) {
          setError(fields.birthDate, errors.birthDate, "Birth date cannot be in the future.");
          ok = false;
        }
        const age = ageYears(bd, today);
        if (age < 13) {
          setError(fields.birthDate, errors.birthDate, "You must be at least 13 years old.");
          ok = false;
        }
      }
    }

    if (!fields.terms.checked) {
      setError(fields.terms, errors.terms, "You must accept the terms to continue.");
      ok = false;
    }

    return ok;
  }

  function ageYears(birth, now) {
    let a = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) a--;
    return a;
  }

  function isoLocalTimestamp(d = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ts = isoLocalTimestamp();
    fields.timestamp.value = ts;

    const tr = document.createElement("tr");
    tr.className = "text-center";
    tr.innerHTML = `
      <td class="p-3">${escapeHtml(fields.fullName.value.trim())}</td>
      <td class="p-3">${escapeHtml(fields.email.value.trim())}</td>
      <td class="p-3">${escapeHtml(fields.phone.value.trim())}</td>
      <td class="p-3">${escapeHtml(fields.birthDate.value)}</td>
      <td class="p-3">${escapeHtml(ts)}</td>
      <td class="p-3">Yes</td>
    `;
    tbody.appendChild(tr);

    form.reset();
    clearErrors();
    fields.fullName.focus();
  });

  ["input", "change", "blur"].forEach((evt) => {
    form.addEventListener(evt, () => clearErrors());
  });
});

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
