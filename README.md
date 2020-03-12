# React Native Example App

_This project consists in the development of a React Native App that displays dynamic rows dataset of repositories fetched from the GitHub public API which can be useful to find the updated overview of a repository easily._

## Finished app available from Expo
[View app from Expo](https://expo.io/@unvalerio/react-native-example-sergio)

### Features list 📋

* 🍺 List containing ID, Repo title, Owner, Stars, Creation date of every repo found
* 🍺 Input component to search for a repository by name
* 🍺 Caching results of every search, (not making an API request if the results are already stored)
* 🍺 Instead of triggering requests as long as the user is typing I used a debounce function
* 🍺 Pagination implemented (locally, not by using API queries)
* 🍺 Material design plus Android and iOS platform patterns

### Some tools and methodologies used ⭐

* 🍺 ESLint as code formatter
* 🍺 Redux for state management
* 🍺 RXJS and Redux-Observables
* 🍺 [Ducks pattern](https://github.com/erikras/ducks-modular-redux)

## Planning 📝

1. To establish the best projet structure for an app of this kind ("The Ducks Pattern" in this case)
2. For the state management Redux will be used because it is an indispensable factor in The Ducks Pattern.
3. react-redux will be used in order to implement Redux in the app, 
4. rxjs will be used as a reactive programming platform
5. redux-observable will be used in order to implement rxjs in the app using "Epics"
6. For the main user interface "Material Design" will be selected. Android and iOS design patters will be used as a support for special cases.
7. For pagination of results, data will be loaded as "LazyLoad" using the onEndReached prop from the FlatList component.
8. For cahing results, AsyncStorage from react-native will be implemented because of its simplicity of saving and recovery of local data.
9. All of the files will be formatted using ESLint using the default plugin for react formatting and the Airbnb formatter plugin for JavaScript.

## Development ⌨️

1. The App.jsx file initialize the Store and loads the Header and Repos components.
2. Repos.jsx is the main component of the app, this one contains the search input and the list of results
  * For the top bar and the search input it was used "material design" built with the react-native-paper library. For the repositories list the ListItem component from react-native-elements was used, which adjusts desgin patterns for Android and iOS, it is coupled easily to the FlatList component from react-native in order to show results.
3. The search input (TextInput) executes the "triggerSearchRepos" function each time a change in the input is detected.
4. The repos.js file is a module (based on the Ducks pattern) containing the "action types", "action creators", "epics" and the "reducer".
5. "repos module" has two "epics" that intercept the "SEARCH_REPOS" and "SEARCH_REPOS_API" actions.
6. The Epic that intercepts "SEARCH_REPOS" waits for a "debounce" and then search for possible results saved localy from cache (using AsyncStorage). If there are saved data, it dispatches the "SEARCH_REPOS_SUCCESS" action with the results as payload, otherwise it dispatches the "SEARCH_REPOS_API" action.
7. The Epic that intercept "SEARCH_REPOS_API" starts an ajax call to the Github public API requesting a search for repositories. Then, all of the needed information is structured and chunked into pages (array of arrays) with the "chunk" function. All of the results are saved in cache and finally, the Epic dispatches the "SEARCH_REPOS_SUCCESS" action with all of the results as payload.
8. When the "SEARCH_REPOS_SUCCESS" action is executed, it passes through the "reducer" and the results are sent as "pages" to the "Repos.jsx" using the "mapStateToProps" function from Redux to the "repos" prop of the component.
9. Changes are detected from the "componentDidUpdate" method from Repos.jsx, if the results belong to the current search, the first page of the "loadedRepos" state is loaded, which feeds the FlatList component.
10. In order to load all of the remaining pages I used the "onEndReached" callback from FlatList, but I realized that all the pages were being loaded immediately, so I fixed it using the "onMomentumScrollEnd" callback.

---
⌨️ with ❤️ by [Sergio Enrique Vargas](https://github.com/SergioEnrique) 😊