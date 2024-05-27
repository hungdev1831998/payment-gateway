import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@mantine/core/styles.css";
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import "./App.scss";
import ReactQueryProvider from "./components/ReactQueryProvider";
import Payment from "./pages/Payment";

const customTheme = extendTheme({
  fonts: {
    // heading: '"Avenir Next", sans-serif',
    // body: '"Avenir Next", sans-serif',
    // heading: '"K2D", sans-serif',
    // body: '"K2D", sans-serif',
  },
});

function App() {
  const history = createBrowserHistory();

  return (
    <div className="App">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />
      <ReactQueryProvider>
        <ChakraProvider theme={customTheme}>
          <HashRouter {...{ history }}>
            <Routes>
              <Route path="/" element={<Payment />} />
              <Route path="/entry-code/entry" element={<Payment />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </HashRouter>
        </ChakraProvider>
      </ReactQueryProvider>
    </div>
  );
}

export default App;
