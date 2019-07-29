import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Button, List, Paragraph } from "react-native-paper";
import { NavigationScreenProp, NavigationState, ScrollView, withNavigation } from "react-navigation";
import { useDispatch } from "react-redux";
import useLotteryFromPelada from "../hooks/useLotteryFromPelada";
import { generateLottery } from "../redux/lottery";
import { Player, Team } from "../types";
import { getHumanType } from "./getHumanType";

const GenerateTeam = ({
  peladaId,
  again
}: {
  peladaId: number,
  again: boolean
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
      {again ? 'Sortear Novamente' : 'Sortear'}
    </Button>
  )
}

const getStarsAverage = (team: Team): number => {
  return team.players.length === 0 ? 0 : (
    team.players.map(p => p.stars).reduce((a, b) => a + b, 0) / team.players.length
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

  return (
    <ScrollView
    >
      <GenerateTeam peladaId={navigation.getParam('id')} again={!!lottery} />

      {lottery && lottery.teams.map((team, index) => (
        <Paragraph key={index} style={styles.team}>
        Time {index + 1} (média das estrelas: {getStarsAverage(team).toFixed(2)}) {`\n`}
          {team.players.map(player => 
            `${player.name} - ${getHumanType(player.type)}`
          ).join(`\n`)} {`\n`}
        </Paragraph>
      ))}
    </ScrollView>
  )
  
  // return (
  //   <SectionList
  //     keyboardShouldPersistTaps='handled'
  //     sections={sections}
  //     renderSectionHeader={SectionHeader}
  //     keyExtractor={(item: Player) => item.id.toString()}
  //     ListHeaderComponent={
  //       <GenerateTeam peladaId={navigation.getParam('id')} again={!!lottery} />
  //     }
  //     renderItem={
  //       ({
  //         item
  //       }: {
  //         item: Player
  //       }) => <PlayerItem player={item} />
  //     }
  //   />
  // )
}

const styles = StyleSheet.create({
  team: {
    paddingHorizontal: 10
  }
})

export default withNavigation(TeamsScreen)