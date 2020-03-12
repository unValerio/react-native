/*
 * Repos Component
 *
 * This file is part of the React Native example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import { searchReposFactory } from '../redux/modules/repos';

//---------------------------------------------------------------------------------------
// Component styles
//---------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  reposContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  reposList: {
    flex: 1,
  },
  listItem: {
    padding: 16,
    flexDirection: 'row',
  },
});

//---------------------------------------------------------------------------------------
// Repos Component
//---------------------------------------------------------------------------------------
class Repos extends Component {
  constructor(props) {
    super(props);
    this.state = { loadedRepos: [], nextPage: 0, searchTerm: '' };
  }

  componentDidUpdate() {
    const { loadedRepos, searchTerm } = this.state;
    const { repos } = this.props;

    // Only fetch first page of repos if search has finished and it has not been initialized yet
    if (loadedRepos.length === 0 && searchTerm === repos.searchTerm) {
      this.fetchNextPage(repos);
    }
  }

  // Fetch next page of repositories.
  // "loadedRepos" contains the rendered repos while "repos" contains all of the pages
  fetchNextPage(repos) {
    const { nextPage, loadedRepos } = this.state;

    if (nextPage < repos.reposFound.length) {
      this.setState({
        loadedRepos: loadedRepos.concat(repos.reposFound[nextPage]),
        nextPage: nextPage + 1,
      });
    }
    return true;
  }

  // Executed every time the text in input search box changes
  triggerSearchRepos(searchTerm) {
    const { searchRepos } = this.props;

    // Reset state for a new search
    this.setState({
      loadedRepos: [],
      nextPage: 0,
      searchTerm,
    });

    if (searchTerm) {
      // Trigger search action
      searchRepos(searchTerm);
    }
  }

  render() {
    const { loadedRepos } = this.state;
    const { repos } = this.props;

    return (
      <View style={styles.reposContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            label="Search for a repository"
            mode="outlined"
            onChangeText={(searchTerm) => this.triggerSearchRepos(searchTerm)}
          />
        </View>
        <View style={styles.reposList}>
          <FlatList
            data={loadedRepos}
            extraData={this.state}
            renderItem={({ item }) => (
              <ListItem
                key={item.id}
                title={`${item.name}`}
                subtitle={`ID:${item.id}`}
                badge={{
                  value: `⭐ ${item.stars}`,
                  textStyle: { color: '#5917da' },
                  badgeStyle: { backgroundColor: 'white' },
                }}
                rightTitle={new Date(item.creation).toLocaleDateString()}
                rightTitleStyle={{ fontSize: 12 }}
                rightSubtitle={item.user}
                rightSubtitleStyle={{ fontSize: 10 }}
                bottomDivider
              />
            )}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={() => { this.callOnScrollEnd = true; }}
            onMomentumScrollEnd={() => {
              // This function is necessary in order to stop fetching next page multiple times
              if (this.callOnScrollEnd) {
                this.fetchNextPage(repos);
              }
              this.callOnScrollEnd = false;
            }}
          />
        </View>
      </View>
    );
  }
}

//---------------------------------------------------------------------------------------
// Redux functions and connection
//---------------------------------------------------------------------------------------
const mapStateToProps = (state) => ({
  repos: state.repos,
});

const mapDispatchToProps = (dispatch) => ({
  searchRepos: (searchTerm) => dispatch(searchReposFactory(searchTerm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Repos);
