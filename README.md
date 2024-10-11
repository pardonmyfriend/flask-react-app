# Flask + React App

Ten projekt to aplikacja webowa typu full-stack, która korzysta z Flaska po stronie backendu oraz Reacta po stronie frontendowej. Poniżej znajdują się instrukcje, jak sklonować i uruchomić projekt lokalnie.

## Wymagania

Upewnij się, że masz zainstalowane następujące narzędzia:
- [Node.js](https://nodejs.org/en/download/) (dla frontendowej części Reacta)
- [Python 3.x](https://www.python.org/downloads/) (dla backendowej części Flaska)
- [Git](https://git-scm.com/downloads)

## Klonowanie Repozytorium

Aby sklonować projekt, uruchom poniższe polecenie w terminalu:

```
git clone https://github.com/twoja-nazwa-uzytkownika/flask-react-app.git
```

```
cd flask-react-app
```

## Konfiguracja Backend (Flask)

1. Przejdź do katalogu server:

```
cd server
```
2. Utwórz i aktywuj środowisko wirtualne:

```
python -m venv .venv
```

```
.venv\Scripts\activate
```

3. Zainstaluj zależności:

Skopiuj kod
```
pip install -r requirements.txt
```

4. Uruchom aplikację Flask:

```
python app.py
```

Backend powinien teraz działać pod adresem http://localhost:5000.

## Konfiguracja Frontend (React)

1. Przejdź do katalogu client:

```
cd ../client
```

2. Zainstaluj zależności:

```
npm install
```

3. Uruchom serwer developerski React:

```
npm start
```

Frontend powinien teraz działać pod adresem http://localhost:3000.

## Uruchamianie Pełnej Aplikacji

Kiedy zarówno backend (Flask), jak i frontend (React) będą uruchomione, otwórz przeglądarkę i wejdź na http://localhost:3000, aby korzystać z aplikacji.