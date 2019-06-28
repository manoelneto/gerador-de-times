import _ from 'lodash'
import { FlatList } from "react-native-gesture-handler";
import { Text, TextInput, Button, Card, List } from 'react-native-paper'
import React, { useCallback, useMemo } from "react";
import Pelada from "../types/Pelada";
import Player from "../types/Player";
import { View, StyleSheet, SectionListData } from "react-native";
import { NavigationScreenProp, NavigationRoute, NavigationParams, withNavigation, SectionList } from "react-navigation";
import { useSelector } from "react-redux";
import { ApplicationState } from "../store";

const players = [{
  name: "Manoel",
  id: 1
}, {
  name: "Manoel Quirino Neto",
  id: 2
}]

const sections: SectionListData<Player>[] = [{
  title: "Goleiros",
  data: players
}, {
  title: "Jogadores",
  data: players
}]

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
  return (
    <List.Item
      title={player.name}
    />
  )
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

  const playersGroupedByType = useMemo(() => {
    if (!pelada) {
      return []
    }

    return _.groupBy<Player>(pelada.players, player => player.type).
  } , [pelada])

  return (
    <SectionList
      ListHeaderComponent={PeladaScreenHeaderEnhanced}
      renderSectionHeader={(
        { section } :
        {
          section: SectionListData<Player>
        }
      ) => (
        <Text style={styles.section}>{section.title}</Text>
      )}
      sections={playersGroupedByType}
      renderItem={({
        item
      }: {
        item: Player
      }) => <PlayerCard player={item} />}
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