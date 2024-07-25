import { ThemeProvider } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Spinnerr from './components/common/Spinner.jsx';
import './index.css';
import store from './redux/store';
const RootComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoading = () => {
      setLoading(false);
    };

    // Simulate a loading delay (e.g., for data fetching)
    setTimeout(handleLoading, 500);

    return () => {
      clearTimeout(handleLoading);
    };
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <Spinnerr />
      ) : (
        <BrowserRouter>
          <ThemeProvider>
            <Provider store={store}>
    <App />
  </Provider>
          </ThemeProvider>
        </BrowserRouter>
      )}
    </React.Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootComponent />);
