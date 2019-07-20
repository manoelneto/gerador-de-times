import { FormApi } from 'final-form';
import _ from 'lodash';
import React, { useCallback, useMemo } from "react";
import { SectionList, SectionListData, StyleSheet } from "react-native";
import { List, Text, TouchableRipple } from 'react-native-paper';
import { NavigationParams, NavigationRoute, NavigationScreenProp, withNavigation } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { addPlayer, updatePlayer } from '../redux/player';
import { ApplicationState } from "../store";
import { humanPositions, Pelada, Player } from '../types';
import { NewPeladaForm } from "./NewPeladaForm";

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
      dispatch(updatePlayer({
        ...player,
        availableToPlay: !player.availableToPlay
      }))
    }, [player]
  )

  const onMorePress = useCallback(() => navigation.navigate('editPlayer', {
    id: player.id,
    peladaId: navigation.getParam('id')
  }), [])
  
  const description = []
  
  description.push(`${player.stars} estrelas`)

  if (player.type === 'player') {
    description.push(humanPositions[player.position])
  }

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
      description={description.join(`\n`)}
    />
  )
}

const getHumanType = (type: string): string => {
  if (type === 'goalkeeper') {
    return 'Goleiro'
  } else if (type === 'player-defender') {
    return "Zagueiro"
  } if (type === 'player-midfielder') {
    return "Meio campo"
  }if (type === 'player-forward') {
    return "Atacante"
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

const tipos = {
  goalkeeper: 0,
  player: 1
}

const posicoes = {
  defender: 0,
  midfielder: 0,
  forward: 2
}

const PeladaScreen = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}) => {
  const pelada: Pelada | undefined = usePelada(navigation.getParam('id'))
  const players: Player[] = usePlayers(navigation.getParam('id'))

  const playersGroupedByType: SectionListData<Player>[] = useMemo(() => {
    const sortedPlayers = players.sort((player1, player2) => {
      let result = tipos[player1.type] - tipos[player2.type]
      // let result = (tipos[player1.type] * 10 + posicoes[player1.position]) - (tipos[player2.type] * 10 + posicoes[player2.position])

      if (result === 0) {
        result = player1.name < player2.name ? -1 : 1
      }

      return result
    })

    return _.map(
      _.toPairs(
        _.groupBy(sortedPlayers, player => (
          player.type === 'goalkeeper' ? player.type : `${player.type}-${player.position}`
        ))
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
          label='Nome do jogador'
          buttonText='Adicionar Jogador'
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