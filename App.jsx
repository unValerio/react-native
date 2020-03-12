/*
 * Main App Component
 *
 * This file is part of the React Native Example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import configureStore from './src/redux/configureStore';
import Header from './src/components/Header';
import Repos from './src/components/Repos';

//---------------------------------------------------------------------------------------
// Redux store configuration and initialization
//---------------------------------------------------------------------------------------
const store = configureStore();

//---------------------------------------------------------------------------------------
// Component styles
//---------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

//---------------------------------------------------------------------------------------
// App Component
//---------------------------------------------------------------------------------------
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Header />
        <Repos />
      </View>
    </Provider>
  );
}
