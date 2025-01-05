'use client'

import './globals.css';  // Import Tailwind CSS
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const Layout = ({ children }) => {
  return (
    <>
      {/* Root HTML Structure */}
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>HRMS-AAS-Internationla Private Limited</title>
        </head>
        <body className="min-h-screen bg-gray-100">
          <Provider store={store}>
            <div>{children}</div>
          </Provider>
        </body>
      </html>
    </>
  );
};

export default Layout;
