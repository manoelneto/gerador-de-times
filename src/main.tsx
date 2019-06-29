import _ from 'lodash'
import React, {Component, PureComponent} from 'react';
import { createBottomTabNavigator, createAppContainer, NavigationState } from 'react-navigation';
import Home from './screens/Home';
import { createStackNavigator } from 'react-navigation';
import { Appbar, Drawer, Button, Text, TouchableRipple } from 'react-native-paper';
import { NavigationParams } from 'react-navigation';
import { NavigationScreenProp } from 'react-navigation';
import { NavigationRoute } from 'react-navigation';
import Settings from './screens/settings';
import PeladaScreen from './screens/pelada';
import { StyleSheet } from 'react-native';
import TeamsScreen from './screens/teams';
import EditPlayerScreen from './screens/EditPlayer';

interface HeaderProps {
  scene: any,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>,
  headerRight?: JSX.Element
}

class Header extends PureComponent<HeaderProps> {
  render() {
    const {
      scene,
      navigation,
      headerRight
    } = this.props

    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />

        <Appbar.Content
          title={
            _.get(scene, 'descriptor.options.headerTitle') ||
              navigation.getParam('title') || 'Gerador de Times'
          }
        />

        {headerRight}
      </Appbar.Header>
    )
  }
}

const Main = createBottomTabNavigator({
  home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Início'
    }
  },
  settings: {
    screen: Settings,
    navigationOptions: {
      tabBarLabel: 'Configurações'
    }
  }
}, {
  initialRouteName: 'home'
})


Main.navigationOptions = (
  {
    navigation
  }: {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
  }
) => {
  const { routeName } = navigation.state.routes[navigation.state.index]

  let headerTitle = 'Geador de Times'

  switch (routeName) {
    case 'home':
      headerTitle = 'Gerador de Times'
      break;

    case 'settings':
      headerTitle = 'Configurações'
      break;
  
    default:
      break;
  }

  return {
    headerTitle,
    header: (props: any) => (
      <Header
        {...props}
        navigation={navigation}
      />
    )
  }
}

const MainStack = createStackNavigator({
  main: Main,
  pelada: PeladaScreen,
  teams: TeamsScreen,
  edit_player: EditPlayerScreen
}, {
  initialRouteName: 'main',
  defaultNavigationOptions: ({ navigation }) => {
    const routeName = navigation.state.routeName
    let headerRight : JSX.Element | undefined = undefined

    switch (routeName) {
      case 'pelada':
        headerRight = (
          <TouchableRipple
            onPress={() => {
              navigation.navigate("teams")
            }}
          >
            <Text style={styles.topRightText}>
              Gerar
            </Text>
          </TouchableRipple>
        )
        break;
    
      default:
        break;
    }
    
    return {
      header: props => (
        <Header {...props} navigation={navigation} headerRight={headerRight} />
      )
    }
  }
})

const styles = StyleSheet.create({
  topRightText: {
    color: 'white'
  }
})

const NavigationWithContainer = createAppContainer(MainStack)

export default () => (
  <NavigationWithContainer />
)
