import express from "express";
import { Spotify } from "spdl";
import dotenv from "dotenv";
dotenv.config();  // .env ഫയൽ ലോഡ് ചെയ്യുന്നു

const app = express();
const port = 3000;

// .env-ലുള്ള SP_DC cookie value ഇവിടെ ഉപയോഗിക്കുന്നു
const SPOTIFY_COOKIE = process.env.SP_DC;

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Spotify URL ആവശ്യമാണ്" });

  try {
    // Cookie ഉപയോഗിച്ച് Spotify client സൃഷ്ടിക്കുന്നു
    const client = await Spotify.create({
      cookie: `sp_dc=${SPOTIFY_COOKIE}`
    });

    const stream = await client.download(url);
    res.setHeader("Content-Disposition", "attachment; filename=song.ogg");
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Spotify Downloader API http://localhost:${port} പ്രവർത്തിക്കുന്നു`);
});
