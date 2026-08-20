const axios = require('axios');

module.exports = async (req, res) => {
  const audioUrl = req.query.url;
  if (!audioUrl) return res.status(400).send("No audio URL provided");

  try {
    const range = req.headers.range;
    const axiosHeaders = {};
    if (range) axiosHeaders.Range = range;

    const response = await axios({
      method: 'get',
      url: audioUrl,
      responseType: 'stream',
      headers: axiosHeaders
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    if (response.headers['content-length']) res.setHeader('Content-Length', response.headers['content-length']);
    if (response.headers['content-range']) res.setHeader('Content-Range', response.headers['content-range']);
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(response.status);
    response.data.pipe(res);
  } catch (error) {
    return res.status(500).send("Error streaming audio");
  }
};
