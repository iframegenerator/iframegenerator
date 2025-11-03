const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple endpoint to return generated iframe HTML (could be used by frontend)
app.post('/generate', (req, res) => {
  const {
    src = 'https://iframegenerator.xyz/sample',
    width = '600',
    height = '400',
    frameborder = '0',
    allowfullscreen = 'true'
  } = req.body;

  // Ensure src is present
  const safeSrc = String(src).trim() || 'https://iframegenerator.xyz/sample';

  // The iframe's content should include a visible backlink if the src is same-origin
  // Since cross-origin content cannot be forced, we'll provide an optional wrapper via a simple data URL with backlink
  // However, data URLs have length limits — we will by default produce a standard iframe that embeds the provided src,
  // and include a small backlink below the generated snippet linking to iframegenerator.xyz.

  const iframeHtml = `<iframe src="${escapeHtml(safeSrc)}" width="${escapeHtml(width)}" height="${escapeHtml(height)}" frameborder="${escapeHtml(frameborder)}" ${allowfullscreen === 'true' ? 'allowfullscreen' : ''}></iframe>`;

  res.json({
    iframe: iframeHtml,
    backlink: '<div style="font-size:12px;margin-top:6px;"><a href="https://iframegenerator.xyz" target="_blank" rel="noopener noreferrer">Powered by iframegenerator.xyz</a></div>'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.listen(PORT, () => {
  console.log(`Iframe generator listening on http://localhost:${PORT}`);
});