import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

@font-face {
  font-family: 'Proxima Nova';
  src: url('/Proxima_Nova_Samsonson/proximanova_regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Proxima Nova Bold';
  src: url('/Proxima_Nova_Samsonson/proximanova_bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Proxima Nova Italic';
  src: url('/Proxima_Nova_Samsonson/proximanova_blackit.woff2') format('woff2');
  font-weight: normal;
  font-style: italic;

}
@font-face {
  font-family: 'Proxima Nova light';
  src: url('/Proxima_Nova_Samsonson/proximanova_light.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;

}
@font-face {
  font-family: 'Proxima Nova Extra Bold';
  src: url('/Proxima_Nova_Samsonson/proximanova_extrabold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Proxima Nova Black';
  src: url('/Proxima_Nova_Samsonson/proximanova_black.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
}
body {
  background: ${({ theme, isDarkMode }) =>
    isDarkMode ? theme.colorsDarkmode.background : theme.colors.background};
}
  html {
    box-sizing: border-box;
    font-size: 16px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
   
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  button {
    font-family: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  input, select, textarea {
    font-family: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    padding: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
