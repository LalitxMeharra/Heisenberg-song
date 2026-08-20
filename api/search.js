const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    // Unofficial JioSaavn search API
    const response = await axios.get(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    const results = response.data.data.results.map((song) => {
      // 320kbps ya best available link
      const highQuality = song.downloadUrl.find((u) => u.quality === '320kbps') || song.downloadUrl.slice(-1)[0];
      
      return {
        id: song.id,
        title: song.name,
        artists: song.primaryArtists,
        image: song.image.slice(-1)[0].url,
        duration: song.duration,
        // Tumhara custom hidden stream endpoint:
        stream_url: `/api/stream?url=${encodeURIComponent(highQuality.url)}`
      };
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ status: "success", data: results });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch songs", details: error.message });
  }
};
