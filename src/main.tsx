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
  tabBarOptions: {
    showIcon: false
  }
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
  main: Home,
  pelada: PeladaNavigationWithProps,
  teams: TeamsScreen,
  editPlayer: EditPlayerScreen
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
              navigation.navigate(
                "peladaTeam", {
                  id: navigation.getParam('id')
                }
              )
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
