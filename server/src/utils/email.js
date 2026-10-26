
export async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!from) {
    throw new Error("EMAIL_FROM is missing");
  }

  const recipients = Array.isArray(to)
    ? to.map((email) =>
        typeof email === "string" ? { email } : email
      )
    : [{ email: to }];

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: from },
        to: recipients,
        subject,
        textContent: text,
        htmlContent: html,
      }),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Brevo API error (${response.status}): ${errorDetails}`
    );
  }

  return response.json();
}
