// Debug script to help identify theme switching issues
(function() {
  // Create debugging element
  const debugContainer = document.createElement('div');
  debugContainer.id = 'theme-debug';
  debugContainer.style.position = 'fixed';
  debugContainer.style.bottom = '10px';
  debugContainer.style.right = '10px';
  debugContainer.style.zIndex = '9999';
  debugContainer.style.background = 'rgba(0,0,0,0.7)';
  debugContainer.style.color = 'white';
  debugContainer.style.padding = '8px';
  debugContainer.style.borderRadius = '4px';
  debugContainer.style.fontSize = '12px';
  debugContainer.style.fontFamily = 'monospace';
  debugContainer.style.maxWidth = '80vw';
  debugContainer.style.display = 'none'; // Hidden by default
  
  // Toggle debug display on triple tap
  let tapCount = 0;
  document.addEventListener('touchend', function() {
    tapCount++;
    if (tapCount === 3) {
      debugContainer.style.display = debugContainer.style.display === 'none' ? 'block' : 'none';
      tapCount = 0;
    }
    setTimeout(() => { tapCount = 0; }, 500);
  });
  
  // Update debug info
  function updateDebugInfo() {
    const html = document.documentElement;
    const theme = localStorage.getItem('scientific-blog-theme') || 'not set';
    const htmlClass = html.classList.contains('dark') ? 'dark' : 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    debugContainer.innerHTML = `
      <div><strong>Storage Theme:</strong> ${theme}</div>
      <div><strong>HTML Class:</strong> ${htmlClass}</div>
      <div><strong>Prefers Dark:</strong> ${prefersDark}</div>
      <div><strong>User Agent:</strong> ${navigator.userAgent.substring(0, 50)}...</div>
      <button id="force-light" style="margin:5px;padding:3px;background:#fff;color:#000;border:none;border-radius:3px;">Force Light</button>
      <button id="force-dark" style="margin:5px;padding:3px;background:#333;color:#fff;border:none;border-radius:3px;">Force Dark</button>
    `;
    
    // Add button event listeners
    document.getElementById('force-light').addEventListener('click', function() {
      localStorage.setItem('scientific-blog-theme', 'light');
      html.classList.remove('dark');
      updateDebugInfo();
    });
    
    document.getElementById('force-dark').addEventListener('click', function() {
      localStorage.setItem('scientific-blog-theme', 'dark');
      html.classList.add('dark');
      updateDebugInfo();
    });
  }
  
  // Add to page and update info
  document.body.appendChild(debugContainer);
  setInterval(updateDebugInfo, 1000);
})();