import _ from 'lodash'
import { Text, TextInput, Button, Card, List } from 'react-native-paper'
import React, { useCallback, useMemo } from "react";
import Pelada from "../types/Pelada";
import Player from "../types/Player";
import { View, StyleSheet, SectionListData, SectionList } from "react-native";
import { NavigationScreenProp, NavigationRoute, NavigationParams, withNavigation } from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationState } from "../store";
import { NewPeladaForm } from './home';
import { addPlayer } from '../redux/pelada';
import { FormApi } from 'final-form';

const PeladaScreenHeader = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => {
  return (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: 'center'
        }}
      >
        <TextInput
          label='Adicione Jogadores'
          style={{
            flex: 1
          }}
        />
        <Button>
          Ok
        </Button>
      </View>
    </View>
  )
}

const PeladaScreenHeaderEnhanced = withNavigation(PeladaScreenHeader)

const PlayerCard = ({
  player
}: {
  player: Player
}) => {
  const dispatch = useDispatch()

  const onPress = useCallback(
    () => {
      dispatch()    
    }, [player]
  )

  return (
    <List.Item
      onPress={onPress}
      title={player.name}
      left={(props) => player.availableToPlay && <List.Icon {...props} icon='check' />}
    />
  )
}

const getHumanType = (type: string): string => {
  if (type === 'goalkeeper') {
    return 'Goleiro'
  } else if (type === 'player') {
    return "Jogador"
  }

  return ''
}

const PeladaScreen = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => {
  const pelada: Pelada | undefined = useSelector(
    useCallback((store: ApplicationState) => {
      return store.pelada.find(_pelada => _pelada.id === navigation.getParam('id'))
    }, []))

  const playersGroupedByType: SectionListData<Player>[] = useMemo(() => {
    if (!pelada) {
      return []
    }

    return _.map(
      _.toPairs(
        _.groupBy(pelada.players, player => player.type)
      ),
      ([ type, players ]) => ({
        title: getHumanType(type),
        data: players
      })
    )
  } , [pelada])

  const dispatch = useDispatch()

  return (
    <SectionList
      ListHeaderComponent={
        <NewPeladaForm
          label='Nome da pelada'
          onSubmit={(
            { name } :
            { name: string },
            form: FormApi
          ) => {
            if (pelada && name) {
              dispatch(
                addPlayer(pelada.id, name)
              )
              setTimeout(() => form.reset(), 100)
            }
          }}
        />
      }
      renderSectionHeader={(
        { section } :
        {
          section: SectionListData<Player>
        }
      ) => (
        <Text style={styles.section}>{section.title}</Text>
      )}
      sections={playersGroupedByType}
      keyExtractor={(item: Player) => item.id.toString()}
      renderItem={
        ({
          item
        }: {
          item: Player
        }) => <PlayerCard player={item} />
      }
    />
  )
}

const styles = StyleSheet.create({
  player: {
    marginBottom: 5
  },
  section: {
    fontWeight: 'bold',
    backgroundColor: 'black',
    color: 'white',
    padding: 3
  }
})

export default withNavigation(PeladaScreen)