/*
 * Root of Epics and Reducers of each module in the App
 *
 * This file is part of the React Native example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { catchError } from 'rxjs/operators';

import reposReducer, { reposEpic } from './repos';

//---------------------------------------------------------------------------------------
// Epics combined with a global error handler
//---------------------------------------------------------------------------------------
export const rootEpic = (action$, store$, dependencies) => (
  combineEpics(reposEpic)(action$, store$, dependencies).pipe(
    catchError((error, source) => source),
  )
);

//---------------------------------------------------------------------------------------
// Reducers combined
//---------------------------------------------------------------------------------------
export const rootReducer = combineReducers({
  repos: reposReducer,
});
