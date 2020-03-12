/*
 * Repos module
 *
 * This file is part of the React Native example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AsyncStorage } from 'react-native';
import { ofType, combineEpics } from 'redux-observable';
import { throwError } from 'rxjs';
import { mergeMap, map, debounceTime } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

//---------------------------------------------------------------------------------------
// Chunk function, used to split an array of repositories into smaller ones, aka pages
//---------------------------------------------------------------------------------------
const chunk = (arr, size) => (Array.from(
  { length: Math.ceil(arr.length / size) },
  (v, i) => arr.slice(i * size, i * size + size),
));

//---------------------------------------------------------------------------------------
// Action types
//---------------------------------------------------------------------------------------
export const SEARCH_REPOS = 'reactNativeExampleApp/repos/SEARCH_REPOS';
export const SEARCH_REPOS_API = 'reactNativeExampleApp/repos/SEARCH_REPOS_API';
export const SEARCH_REPOS_SUCCESS = 'reactNativeExampleApp/repos/SEARCH_REPOS_SUCCESS';

//---------------------------------------------------------------------------------------
// Action creators (Factories)
//---------------------------------------------------------------------------------------
export const searchReposFactory = (searchTerm) => ({
  type: SEARCH_REPOS,
  payload: searchTerm,
});

export const searchReposApiFactory = (searchTerm) => ({
  type: SEARCH_REPOS_API,
  payload: searchTerm,
});

export const searchReposSuccessFactory = (reposFound) => ({
  type: SEARCH_REPOS_SUCCESS,
  payload: reposFound,
});

//---------------------------------------------------------------------------------------
// Epics
//---------------------------------------------------------------------------------------
export const searchReposEpic = (action$) => action$.pipe(
  ofType(SEARCH_REPOS),
  debounceTime(500), // <- DEBOUNCE FOR SEARCHING (using the debounceTime operator from rxjs)
  mergeMap(async (action) => {
    const searchTerm = action.payload;

    // Look at the cache if there are repos already found for this searchTerm
    const reposFound = await AsyncStorage.getItem(searchTerm);

    if (reposFound) {
      // There are repos found in cache, trigger a "success action"
      return searchReposSuccessFactory({ searchTerm, reposFound: JSON.parse(reposFound) });
    }
    // There aren't repos in the cache for this searchTerm, call the API
    return searchReposApiFactory(searchTerm);
  }),
);

export const searchReposApiEpic = (action$) => action$.pipe(
  ofType(SEARCH_REPOS_API),
  mergeMap((action) => {
    const searchTerm = action.payload;
    const apiCall$ = ajax.getJSON(`https://api.github.com/search/repositories?q=${searchTerm}`).pipe(
      map((res) => {
        let reposFound = res.items.map((repo) => ({
          id: repo.id.toString(),
          ownerAvatar: repo.owner.avatar_url,
          name: repo.name,
          user: repo.owner.login,
          description: repo.description,
          stars: repo.stargazers_count,
          creation: repo.created_at,
        }));

        // Chunk repos in arrays of 9 items (9 per page)
        reposFound = chunk(reposFound, 9);

        // Save result in cache
        AsyncStorage.setItem(searchTerm, JSON.stringify(reposFound));

        return searchReposSuccessFactory({ searchTerm, reposFound });
      }),
    );
    return apiCall$;
  }),
);

export const reposEpic = combineEpics(
  searchReposEpic,
  searchReposApiEpic,
);

//---------------------------------------------------------------------------------------
// Reducer
//---------------------------------------------------------------------------------------
export default function reposReducer(state = [], action) {
  switch (action.type) {
    case SEARCH_REPOS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
