import express from "express";
import { Resend } from "resend";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// API Routes
app.post("/api/capture-lead", async (req, res) => {
  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    // 1. Send Welcome Email via Resend
    if (resend) {
      await resend.emails.send({
        from: "AI Agency System <onboarding@resend.dev>",
        to: email,
        subject: "Your AI Client Acquisition System is Ready!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h1 style="color: #2563eb;">Welcome, ${firstName}!</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Thanks for starting your AI Client Acquisition analysis. You're one step closer to automating your agency's growth.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              <strong>What's next?</strong>
            </p>
            <ul style="font-size: 16px; line-height: 1.5; color: #333;">
              <li>Complete the interactive analysis on our site.</li>
              <li>Review your custom score and insights.</li>
              <li>Unlock your full 5-10 clients/month roadmap.</li>
            </ul>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
              © 2026 AI Agency System. All rights reserved.
            </div>
          </div>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY not found. Email not sent.");
    }

    // 2. Return success
    res.json({ success: true, message: "Lead captured and email sent" });
  } catch (error) {
    console.error("Error capturing lead:", error);
    res.status(500).json({ error: "Failed to process lead" });
  }
});

// Export for Vercel
export default app;

// Only run the server logic if not on Vercel
if (!process.env.VERCEL) {
  const startServer = async () => {
    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };

  startServer();
}
