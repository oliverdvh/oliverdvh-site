// Cloudflare Pages Function: POST /api/contact
// Validates honeypot + Cloudflare Turnstile, then sends an email via MailChannels.
// Requires the following environment variables set in Cloudflare Pages > Settings > Environment variables:
//   TO_EMAIL                 -- where submissions are forwarded (e.g. oliverdvh@posteo.net)
//   FROM_EMAIL               -- the address messages are sent FROM (must be on your verified domain, e.g. contact@oliverdudokvanheel.com)
//   TURNSTILE_SECRET_KEY     -- the Cloudflare Turnstile *secret* key (paired with the public site key in the form)

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();

    // ---- Honeypot ----
    // Real users leave this field empty; bots tend to fill every visible input.
    if ((form.get("website") || "").toString().trim() !== "") {
      // Pretend success so the bot moves on.
      return json({ ok: true });
    }

    // ---- Required fields ----
    const name = (form.get("name") || "").toString().trim();
    const org = (form.get("org") || "").toString().trim();
    const topic = (form.get("topic") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();
    const replyEmail = (form.get("reply_email") || "").toString().trim();

    if (!name || !topic || !message || !replyEmail) {
      return json({ ok: false, error: "Please fill in all required fields." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyEmail)) {
      return json({ ok: false, error: "Please enter a valid email address so I can reply." }, 400);
    }
    if (message.length > 5000) {
      return json({ ok: false, error: "Message is too long (max 5000 characters)." }, 400);
    }

    // ---- Turnstile ----
    const turnstileToken = (form.get("cf-turnstile-response") || "").toString();
    if (!turnstileToken) {
      return json({ ok: false, error: "Please complete the verification check." }, 400);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: ip,
      }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return json({ ok: false, error: "Verification failed. Please try again." }, 400);
    }

    // ---- Compose ----
    const subject = `Website contact: ${topic} — ${name}${org ? " (" + org + ")" : ""}`;
    const bodyLines = [
      `From: ${name}${org ? " (" + org + ")" : ""}`,
      `Reply email: ${replyEmail}`,
      `Topic: ${topic}`,
      `IP: ${ip}`,
      ``,
      `Message:`,
      message,
    ];
    const textBody = bodyLines.join("\n");

    // ---- Send via MailChannels ----
    const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.TO_EMAIL }] }],
        from: { email: env.FROM_EMAIL, name: "oliverdudokvanheel.com" },
        reply_to: { email: replyEmail, name: name },
        subject,
        content: [{ type: "text/plain", value: textBody }],
      }),
    });

    if (!mcRes.ok) {
      const errText = await mcRes.text();
      console.error("MailChannels error:", mcRes.status, errText);
      return json({ ok: false, error: "Couldn't send right now. Please try again in a moment, or email directly." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("contact handler error:", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
