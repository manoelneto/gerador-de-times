import { FormApi } from 'final-form';
import _ from 'lodash';
import React, { useCallback, useMemo } from "react";
import { SectionList, SectionListData } from "react-native";
import { List, TouchableRipple } from 'react-native-paper';
import { NavigationParams, NavigationRoute, NavigationScreenProp, withNavigation } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { addPlayer, updatePlayer } from '../redux/player';
import { ApplicationState } from "../store";
import { Pelada, Player, playerType, playerTypes } from '../types';
import { NewPeladaForm } from "./NewPeladaForm";
import { SectionHeader } from './SectionHeader';
import { getHumanType } from './getHumanType';

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

const getHumanTypeSelected = (type: string, players: Player[]): string => {
  const result = [
    getHumanType(type),
    `${players.filter(p => p.type === type && p.availableToPlay).length} marcados para sorteiro`
  ]

  return result.join(' - ')
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
    const sortedPlayers = players.sort((player1, player2) => {
      let result = playerTypes.indexOf(player1.type) - playerTypes.indexOf(player2.type)

      if (result === 0) {
        result = player1.name < player2.name ? -1 : 1
      }

      return result
    })

    return _.map(
      _.toPairs(
        _.groupBy(sortedPlayers, player => player.type)
      ),
      ([ type, players ]) => ({
        title: getHumanTypeSelected(type, players),
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
      keyboardShouldPersistTaps='handled'
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
      renderSectionHeader={SectionHeader}
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

export default withNavigation(PeladaScreen)