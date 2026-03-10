// Injected as a blocking script in <head> to prevent FOUC on theme load
export default function ThemeScript() {
    const script = `
    (function() {
      try {
        var stored = localStorage.getItem('mih-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefersDark ? 'dark' : 'light');
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } catch(e) {}
    })();
  `;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
