export default function CustomHead() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="color-scheme" content="light dark" />
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // On page load, immediately apply saved theme to prevent flash
              const savedTheme = localStorage.getItem('scientific-blog-theme');
              if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } else if (savedTheme === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              } else {
                // If no saved theme, check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              }
              // Add class to prevent transitions during page load
              document.documentElement.classList.add('no-transitions');
              window.addEventListener('load', function() {
                setTimeout(function() {
                  document.documentElement.classList.remove('no-transitions');
                }, 100);
              });
            } catch (e) {
              console.error('Theme initialization error:', e);
            }
          })();
        `
      }} />
      <script src="/debug-theme.js" defer></script>
    </>
  )
}