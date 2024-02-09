import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Header from './Pages/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes />
      </div>
    </Router>
  );
};

export default App;
