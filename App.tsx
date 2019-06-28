import { Provider as PaperProvider } from 'react-native-paper'
import Main from './src/main';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';

const App = (): JSX.Element => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <Main />
    </PaperProvider>
  </ReduxProvider>
)

export default App