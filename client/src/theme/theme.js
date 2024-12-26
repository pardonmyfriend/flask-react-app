import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#3FBDBD',
      },
      secondary: {
        main: '#ff4081', // Kolor dodatkowy
      },
      error: {
        main: '#d32f2f', // Czerwony kolor (domyślny dla error)
        contrastText: '#ffffff', // Kolor tekstu na przyciskach wypełnionych
      },
      background: {
        default: '#f5f5f5', // Domyślne tło aplikacji
        paper: '#ffffff', // Tło kart i okien dialogowych
      },
      text: {
        primary: '#474747', // Kolor głównego tekstu
        secondary: '#666666', // Kolor dodatkowego tekstu
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif', // Globalny font
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: '#ffffff', // Domyślny kolor tekstu w przyciskach
            '&.MuiButton-containedPrimary': {
              color: '#ffffff', // Tekst w przyciskach z `variant="contained"` i kolorem `primary`
            },
            '&.MuiButton-text': {
              color: '#1976d2', // Tekst w przyciskach z `variant="text"`
            },
            '&.Mui-disabled': {
              backgroundColor: '#D7D7D7', // Kolor tła dla disabled
              color: '#9F9F9F', // Kolor tekstu dla disabled
              cursor: 'not-allowed', // Wygląd kursora
            },
          },
          outlinedError: {
            color: '#d32f2f', // Kolor tekstu
            borderColor: '#d32f2f', // Kolor obramowania
            '&:hover': {
              borderColor: '#b71c1c', // Ciemniejszy czerwony po najechaniu
              backgroundColor: 'rgba(211, 47, 47, 0.08)', // Subtelne tło
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              fontSize: '17px',
            },
            '& .MuiDataGrid-row:nth-of-type(2n)': {
              backgroundColor: '#f6f6f6',
            },
            '& .MuiDataGrid-toolbar': {
              color: 'white',
            },
            '& .MuiButton-textPrimary': {
              color: 'white !important',
            },
            '& .MuiTypography-root': {
              color: 'white !important',
            },
            '& .MuiButtonBase-root': {
              color: 'white !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#3fbdbd !important',
            },
            '& .MuiDataGrid-columnsManagement': {
              backgroundColor: '#3fbdbd !important',
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: '#474747',
              fontWeight: 'bold',
              padding: '10px',
              fontSize: '30px',
              color: '#ffffff',
              '& .MuiButtonBase-root': {
                color: 'white',
              },
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            color: '#ffffff', // Kolor tekstu (ikony) dla wszystkich Fab
            backgroundColor: '#3FBDBD', // Kolor tła
            '&:hover': {
              backgroundColor: '#2C8484', // Kolor tła po najechaniu
            },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: '#D7D7D7', // Domyślny kolor tła kółek dla nieaktywnych kroków

            '&.Mui-active': {
              color: '#3FBDBD', // Kolor tła dla aktywnego kroku
            },
            '&.Mui-completed': {
              color: '#3FBDBD', // Kolor tła dla ukończonych kroków
            },
            '& .MuiStepIcon-text': {
              fill: '#9F9F9F', // Szary kolor dla numerów nieaktywnych kroków
            },
            // Kolor numerów dla aktywnego kroku
            '&.Mui-active .MuiStepIcon-text': {
              fill: 'white', // Niebieski kolor dla aktywnego kroku
            },
            // Kolor numerów dla ukończonego kroku
            '&.Mui-completed .MuiStepIcon-text': {
              fill: 'white', // Zielony kolor dla ukończonego kroku
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: '8px', // Zaokrąglenie paska zakładek
            backgroundColor: 'rgba(63, 189, 189, 0.3)', // Jasne tło AppBar
            boxShadow: 'none', // Usunięcie cienia
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: '48px', // Wysokość zakładek
          },
          indicator: {
            backgroundColor: '#3FBDBD', // Kolor wskaźnika aktywnej zakładki
            height: '4px', // Grubość wskaźnika
            borderRadius: '2px', // Zaokrąglenie wskaźnika
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: 'bold', // Wyróżnienie tekstu zakładek
            // fontSize: '1rem', // Rozmiar tekstu
            // textTransform: 'none', // Bez automatycznego wielkiego formatu
            color: 'white', // Kolor tekstu nieaktywnej zakładki
            transition: 'color 0.3s ease', // Animacja zmiany koloru
            '&.Mui-selected': {
              color: 'white', // Kolor aktywnej zakładki
              backgroundColor: 'rgba(63, 189, 189, 0.5)', // Tło aktywnej zakładki
              borderRadius: '8px', // Zaokrąglenie aktywnej zakładki
            },
            '&:hover': {
              color: '#3FBDBD', // Kolor tekstu podczas najechania
            },
          },
        },
      },
    },
  });

export default theme;