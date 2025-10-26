import express from "express";
import spdl from "spdl";      // default import, curly braces ഇല്ല
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render uses PORT env var

// .env ഫയലിൽ 'SP_DC=നിങ്ങളുടെ_cookie_value' ചേർക്കുക
const SPOTIFY_COOKIE = process.env.SP_DC;

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Spotify URL ആവശ്യമാണ്" });

  try {
    // spdl(url, options) pattern
    const stream = await spdl(url, {
      cookie: `sp_dc=${SPOTIFY_COOKIE}`
    });
    res.setHeader("Content-Disposition", "attachment; filename=song.ogg");
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Render expects server to bind to PORT env var & 0.0.0.0
app.listen(port, "0.0.0.0", () => {
  console.log(`Spotify Downloader API Render-ൽ port ${port} -ൽ പ്രവർത്തിക്കുന്നു`);
});
