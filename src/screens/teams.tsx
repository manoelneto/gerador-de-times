import { Lottery, Team, Player } from "../types";
import { SectionList } from "react-native";
import React, { useMemo, useCallback } from "react";
import { List, Button } from "react-native-paper";
import { SectionHeader } from "./SectionHeader";
import { getHumanType } from "./getHumanType";
import { withNavigation, NavigationScreenProp, NavigationState } from "react-navigation";
import { useDispatch } from "react-redux";
import { generateLottery } from "../redux/lottery";
import useLotteryFromPelada from "../hooks/useLotteryFromPelada";

const GenerateTeam = ({
  peladaId
}: {
  peladaId: number
}) => {
  const dispatch = useDispatch()
  const onShuffle = useCallback(() => {
    dispatch(generateLottery(peladaId))
  }, [])

  return (
    <Button
      onPress={onShuffle}
      mode='contained'
      style={{
        marginVertical: 10
      }}
    >
      Sortear
    </Button>
  )
}

const PlayerItem = ({
  player
}: {
  player: Player
}) => {
  const description = []
  
  description.push(getHumanType(player.type))
  description.push(`${player.stars} estrelas`)
  
  return (
    <List.Item
      title={player.name}
      description={description.join(`\n`)}
    />
  )
}

const TeamsScreen = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>
}) => {

  const lottery = useLotteryFromPelada(navigation.getParam('id'))

  const sections = useMemo(() => {
    if (!lottery) { return []}
    
    return lottery.teams.map((team, index) => ({
      title: `Time ${index + 1}`,
      data: team.players
    }))
  }, [lottery])
  
  return (
    <SectionList
      sections={sections}
      renderSectionHeader={SectionHeader}
      keyExtractor={(item: Player) => item.id.toString()}
      ListHeaderComponent={
        <GenerateTeam peladaId={navigation.getParam('id')} />
      }
      renderItem={
        ({
          item
        }: {
          item: Player
        }) => <PlayerItem player={item} />
      }
    />
  )
}

export default withNavigation(TeamsScreen)