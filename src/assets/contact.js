// Contact-page JS: reveal email on click + submit form to Web3Forms
(function () {
  // ----- Reveal email -----
  var btn = document.getElementById("reveal-email");
  var out = document.getElementById("email-revealed");
  if (btn && out) {
    btn.addEventListener("click", function () {
      var local = btn.getAttribute("data-l") || "";
      var domain = btn.getAttribute("data-d") || "";
      var addr = local + "\u0040" + domain; // \u0040 = @
      out.innerHTML =
        '<a href="mai' + 'lto:' + addr + '">' + addr + "</a>" +
        '<br><span style="font-family: var(--font-ui); font-size: 0.9rem; color: var(--ink-soft);">' +
        "I read everything; I reply within 48 hours." +
        "</span>";
      out.hidden = false;
      btn.style.display = "none";
    });
  }

  // ----- Submit form -----
  var form = document.getElementById("contact-form");
  if (!form) return;
  var statusEl = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "form-status form-status--" + (kind || "info");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot — if filled, silently pretend success.
    var hp = form.querySelector('input[name="website"]');
    if (hp && hp.value && hp.value.trim() !== "") {
      form.reset();
      setStatus("Thanks — your message is on its way. I'll come back to you inside 48 hours.", "success");
      return;
    }

    setStatus("Sending…", "info");
    submitBtn.disabled = true;

    var data = new FormData(form);

    // Web3Forms expects access_key and a subject (we build one from the topic)
    var accessKey = form.getAttribute("data-access-key") || "";
    if (!accessKey) {
      setStatus("Form is not yet configured. Please use the email link instead.", "error");
      submitBtn.disabled = false;
      return;
    }
    data.set("access_key", accessKey);

    var name = (data.get("name") || "").toString().trim();
    var org = (data.get("org") || "").toString().trim();
    var topic = (data.get("topic") || "").toString().trim();
    var subject = "Website contact: " + topic + " — " + name + (org ? " (" + org + ")" : "");
    data.set("subject", subject);
    data.set("from_name", "oliverdudokvanheel.com");

    try {
      var res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      var json = await res.json().catch(function () { return {}; });
      if (res.ok && json.success) {
        form.reset();
        if (window.turnstile && typeof window.turnstile.reset === "function") {
          try { window.turnstile.reset(); } catch (e) {}
        }
        setStatus("Thanks — your message is on its way. I'll come back to you inside 48 hours.", "success");
      } else {
        setStatus((json && json.message) || "Something went wrong. Please try again.", "error");
        submitBtn.disabled = false;
      }
    } catch (err) {
      setStatus("Network error. Please try again, or use the email link.", "error");
      submitBtn.disabled = false;
    }
  });
})();
