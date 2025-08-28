import { createGlobalStyle } from "styled-components";
import WebFont from "webfontloader";

WebFont.load({
  custom: {
    families: ["Stockholm Type:n4,n7"],
    urls: ["//font.stockholm.se/css/stockholm-type.css"],
  },
  timeout: 3000,
});

(function () {
  var wf = document.createElement("script");
  wf.src =
    ("https:" == document.location.protocol ? "https" : "http") +
    "://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js";
  wf.type = "text/javascript";
  wf.async = "true";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wf, s);
})();

export const GlobalStyles = createGlobalStyle`
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
 
.wf-stockholmtype-n7-inactive h1 {
    font-family: Verdana, Arial, sans-serif;
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
