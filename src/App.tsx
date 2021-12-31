import React from 'react';
import Stylesheet from './App.module.css';

import CommandTextField from './components/CommandTextField/CommandTextField';

function App() {
  return (
    <div className={Stylesheet.App}>
        <div className={Stylesheet.Container}>
          <CommandTextField />
        </div>
    </div>
  );
}

export default App;
