document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('genForm');
  const preview = document.getElementById('preview');
  const generated = document.getElementById('generated');
  const copyBtn = document.getElementById('copyBtn');
  const backlinkDiv = document.getElementById('backlink');

  // Initial generate
  generateFromForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateFromForm();
  });

  copyBtn.addEventListener('click', async () => {
    const text = generated.textContent;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy HTML', 1200);
    } catch (err) {
      alert('Unable to copy. Select and copy manually.');
    }
  });

  async function generateFromForm() {
    const data = {
      src: document.getElementById('src').value,
      width: document.getElementById('width').value,
      height: document.getElementById('height').value,
      frameborder: document.getElementById('frameborder').value,
      allowfullscreen: document.getElementById('allowfullscreen').value
    };

    // Call server to produce safe HTML
    try {
      const resp = await fetch('/generate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const json = await resp.json();

      // Update generated HTML and preview
      generated.textContent = json.iframe + '\\n' + json.backlink;
      // For preview, show the iframe element itself and a visible backlink below
      preview.innerHTML = json.iframe + json.backlink;
    } catch (err) {
      generated.textContent = '<!-- Error generating iframe -->';
      preview.innerHTML = '<div style="color:#a00">Error generating preview</div>';
    }
  }
});