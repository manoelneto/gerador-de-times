import { Provider as PaperProvider } from 'react-native-paper'
import Index from './src';
import React from 'react';

const App = (): JSX.Element => (
  <PaperProvider>
    <Index />
  </PaperProvider>
)

export default App