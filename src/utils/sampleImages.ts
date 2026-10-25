/**
 * Generates sample images client-side via Canvas so users can test mekit instantly
 * without needing to upload personal files first.
 */

export async function createSampleFile(
  type: 'photo' | 'transparent' | 'portrait'
): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  if (type === 'photo') {
    // 1920x1080 rich landscape mockup
    canvas.width = 1920;
    canvas.height = 1080;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, 700);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.6, '#38bdf8');
    sky.addColorStop(1, '#fed7aa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(1400, 320, 120, 0, Math.PI * 2);
    ctx.fill();

    // Mountains
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 1080);
    ctx.lineTo(400, 480);
    ctx.lineTo(850, 750);
    ctx.lineTo(1250, 420);
    ctx.lineTo(1700, 720);
    ctx.lineTo(1920, 520);
    ctx.lineTo(1920, 1080);
    ctx.closePath();
    ctx.fill();

    // Foreground hills
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 1080);
    ctx.quadraticCurveTo(600, 720, 1200, 880);
    ctx.quadraticCurveTo(1600, 960, 1920, 820);
    ctx.lineTo(1920, 1080);
    ctx.closePath();
    ctx.fill();

    // Text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('mekit Test Landscape Sample (1920x1080)', 80, 120);

    // Add noise texture to make image realistic in size
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 16) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'sample-landscape-hd.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.98);
    });
  } else if (type === 'transparent') {
    // 800x800 transparent badge
    canvas.width = 800;
    canvas.height = 800;

    // Clear alpha
    ctx.clearRect(0, 0, 800, 800);

    // Rounded emblem with transparent surroundings
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(400, 400, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(400, 400, 290, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(400, 400, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TRANSPARENT', 400, 370);
    ctx.font = '32px sans-serif';
    ctx.fillText('PNG Badge Sample', 400, 440);
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'sample-transparent-badge.png', { type: 'image/png' }));
      }, 'image/png');
    });
  } else {
    // 800x1000 ID Photo / Form Portrait Sample
    canvas.width = 800;
    canvas.height = 1000;

    // Studio backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, 1000);
    grad.addColorStop(0, '#e2e8f0');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    // Silhouette head & shoulders
    ctx.fillStyle = '#334155';
    // Body / shoulders
    ctx.beginPath();
    ctx.ellipse(400, 920, 320, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(400, 440, 180, 230, 0, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ID / Form Document Sample', 400, 140);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('800 x 1000 px · Standard Portrait', 400, 185);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'sample-id-portrait.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    });
  }
}
