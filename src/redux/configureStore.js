/*
 * Redux store configuration of the App
 *
 * This file is part of the React Native example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './modules/root';

//---------------------------------------------------------------------------------------
// Root Epic middleware that will intercept each Redux action dispatched
//---------------------------------------------------------------------------------------
const epicMiddleware = createEpicMiddleware();

//---------------------------------------------------------------------------------------
// Store initialization using the root Reducer and the root Epic as middleware
//---------------------------------------------------------------------------------------
export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware),
  );

  epicMiddleware.run(rootEpic);

  return store;
}
