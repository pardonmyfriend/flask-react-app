# Aplikacja Flask + React do Analizy i Eksploracji Danych

Jest to aplikacja webowa typu full-stack, która służy do analizy i eksploracji danych. Backend aplikacji został stworzony przy użyciu frameworka **Flask** (Python), natomiast frontend opiera się na **React** (JavaScript). Aplikacja umożliwia użytkownikom przesyłanie plików danych (CSV, Excel), ich przetwarzanie, wyświetlanie podstawowych statystyk oraz wykonywanie operacji takich jak redukcja wymiarów, klasteryzacja i klasyfikacja.

## Wymagania

Upewnij się, że masz zainstalowane następujące narzędzia:
- [Node.js](https://nodejs.org/en/download/) (dla frontendowej części Reacta)
- [Python 3.x](https://www.python.org/downloads/) (dla backendowej części Flaska)
- [Git](https://git-scm.com/downloads)

## Klonowanie Repozytorium

Aby sklonować projekt i otworzyć go w VS Code, wykonaj poniższe kroki:

1. Sklonuj projekt, uruchamiając poniższe polecenie w terminalu:

```
git clone https://github.com/pardonmyfriend/flask-react-app.git
```

2. Przejdź do katalogu głównego aplikacji:

```
cd flask-react-app
```

3. Otwórz projekt w Visual Studio Code:

```
code .
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

1. Otwórz nowy terminal i przejdź do katalogu client:

```
cd client
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