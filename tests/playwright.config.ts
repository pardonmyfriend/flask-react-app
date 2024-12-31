// playwright.config.ts
module.exports = {
    use: {
      headless: false, // ustawienie na false sprawi, że przeglądarka będzie widoczna podczas testów
      //screenshot: 'only-on-failure', // opcjonalnie, zapisuj screeny tylko w przypadku błędów
    },
  };
  