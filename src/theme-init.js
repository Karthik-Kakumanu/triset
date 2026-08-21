(function () {
  try {
    var storedTheme = localStorage.getItem('triset-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = storedTheme || (prefersDark ? 'dark' : 'light');
  } catch (error) {
    document.documentElement.dataset.theme = 'light';
  }
}());
