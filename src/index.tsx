/** @jsxImportSource @emotion/react */
import ReactDOM from 'react-dom/client';
import Roteador from './routes/routes';
import { css, Global, ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: "light",
    contrastThreshold: 4.5,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    {
      theme.palette.mode === "dark" ?
        <Global
          styles={css`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: #303235;
          }
        `}
        /> :
        <Global
          styles={css`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: #F9F8F8;
          }
        `}
        />
    }
    <Roteador />
  </ThemeProvider>
);