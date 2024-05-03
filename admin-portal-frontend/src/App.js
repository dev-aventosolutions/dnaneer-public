import React, { Component } from 'react';
// import 'antd/dist/antd.css';
// import './App.scss';
import './Styles.scss';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import MyRoutes from "./Routes";
import { ConfigProvider } from 'antd';



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Inter',
              colorPrimary: '#4B5563',
            },
          }}>
            <MyRoutes />
        </ConfigProvider>
      </BrowserRouter>
    );
  }

}

export default App;