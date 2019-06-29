import _ from 'lodash'
import { Text, TextInput, Button, Card, List, TouchableRipple } from 'react-native-paper'
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, SectionListData, SectionList } from "react-native";
import { NavigationScreenProp, NavigationRoute, NavigationParams, withNavigation } from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationState } from "../store";
import { NewPeladaForm } from './Home';
import { FormApi } from 'final-form';
import { Player, Pelada } from '../types';
import { addPlayer, setAvailableToPlay } from '../redux/player';

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
  player,
  navigation
}: {
  player: Player,
  navigation: NavigationScreenProp<NavigationRoute>
}) => {
  const dispatch = useDispatch()

  const toogleAvailableToPlay = useCallback(
    () => {
      dispatch(setAvailableToPlay(player.id, !player.availableToPlay))
    }, [player]
  )

  const onMorePress = useCallback(() => navigation.navigate('edit_player', {
    id: player.id
  }), [])
  
  const description = []
  
  description.push(`${player.stars} estrelas`)

  if (player.availableToPlay) {
    description.push(`Disponível para sorteio`)
  }

  return (
    <List.Item
      onPress={toogleAvailableToPlay}
      title={player.name}
      left={(props) => player.availableToPlay && <List.Icon {...props} icon='check' />}
      right={(props) => (
        <TouchableRipple
          onPress={onMorePress}
        >
          <List.Icon {...props} icon='more-vert' />
        </TouchableRipple>
      )}
      description={description.join(' - ')}
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

const usePelada = (peladaId: number): Pelada | undefined => {
  const peladaSelector = useCallback((store: ApplicationState) => {
    return store.pelada[peladaId]
  }, [])

  return useSelector(peladaSelector)
}

export const usePlayers = (peladaId: number): Player[] => {
  const pelada = usePelada(peladaId)

  const playersSelector = useCallback((store: ApplicationState) => {
    if (!pelada) {
      return []
    }

    return pelada.player_ids.map(playerId => store.player[playerId]).filter(player => !!player)
  }, [pelada])

  return useSelector(playersSelector)
}

const PeladaScreen = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => {
  const pelada: Pelada | undefined = usePelada(navigation.getParam('id'))
  const players: Player[] = usePlayers(navigation.getParam('id'))

  const playersGroupedByType: SectionListData<Player>[] = useMemo(() => {
    return _.map(
      _.toPairs(
        _.groupBy(players, player => player.type)
      ),
      ([ type, players ]) => ({
        title: getHumanType(type),
        data: players
      })
    )
  } , [players])

  const dispatch = useDispatch()

  if (!pelada) {
    return null
  }

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
            if (name) {
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
        }) => <PlayerCard player={item} navigation={navigation} />
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