import _ from 'lodash'
import React, {Component, PureComponent} from 'react';
import { createBottomTabNavigator, createAppContainer, NavigationState } from 'react-navigation';
import Home from './screens/home';
import { createStackNavigator } from 'react-navigation';
import { Appbar, Drawer, Button, Text, TouchableRipple } from 'react-native-paper';
import { NavigationParams } from 'react-navigation';
import { NavigationScreenProp } from 'react-navigation';
import { NavigationRoute } from 'react-navigation';
import PeladaSettings from './screens/PeladaSettings';
import PeladaScreen from './screens/pelada';
import { StyleSheet } from 'react-native';
import TeamsScreen from './screens/teams';
import EditPlayerScreen from './screens/EditPlayer';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

interface HeaderProps {
  scene: any,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>,
  headerRight?: JSX.Element,
  showBack?: boolean
}

class Header extends PureComponent<HeaderProps> {
  render() {
    const {
      scene,
      navigation,
      headerRight,
      showBack
    } = this.props

    return (
      <Appbar.Header>
        {showBack && (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}

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

const PeladaNavigation = createBottomTabNavigator({
  peladaMain: {
    screen: PeladaScreen,
    navigationOptions: {
      tabBarLabel: 'Início'
    }
  },
  peladaSettings: {
    screen: PeladaSettings,
    navigationOptions: {
      tabBarLabel: 'Configurações'
    }
  },
  peladaTeam: {
    screen: TeamsScreen,
    navigationOptions: {
      tabBarLabel: 'Gerar'
    }
  }
}, {
  initialRouteName: 'peladaMain',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state
      let iconName: string

      if (routeName === 'peladaMain') {
        iconName = `home${focused ? '' : '-outline'}`
      } else if (routeName === 'peladaTeam') {
        iconName = `account-multiple${focused ? '' : '-outline'}`
      } else if (routeName === 'peladaSettings') {
        iconName = `settings${focused ? '' : '-outline'}`
      }

      return (
        <MaterialCommunityIcon
          name={iconName!}
          size={horizontal ? 20 : 25}
          color={tintColor!}
        />
      )
    }
  })
})

PeladaNavigation.navigationOptions = (
  {
    navigation
  }: {
    navigation: NavigationScreenProp<NavigationState>
  }
) => {
  const { routeName } = navigation.state.routes[navigation.state.index]

  let headerTitle = 'Pelada'

  switch (routeName) {

    case 'peladaSettings':
      headerTitle = 'Configurações'
      break;

    case 'peladaTeam':
      headerTitle = 'Gerar Time'
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

const PeladaNavigationWithProps = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>
}) => (
  <PeladaNavigation
    navigation={navigation}
  />
)

PeladaNavigationWithProps.router = PeladaNavigation.router

const MainStack = createStackNavigator({
  main: {
    screen: Home,
    navigationOptions: ({
      navigation
    }: {
      navigation: NavigationScreenProp<NavigationState>
    }) => ({
      headerTitle: 'Home',
      header: (props: any) => <Header {...props} navigation={navigation}  />
    })
  },
  pelada: PeladaNavigationWithProps,
  teams: TeamsScreen,
  editPlayer: EditPlayerScreen
}, {
  initialRouteName: 'main',
  defaultNavigationOptions: ({ navigation }) => {
    return {
      header: props => (
        <Header {...props} navigation={navigation} showBack />
      )
    }
  }
})


const NavigationWithContainer = createAppContainer(MainStack)

export default () => (
  <NavigationWithContainer />
)
