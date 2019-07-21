import { Player, Team, Pelada, playerTypes } from "../types";

// uma tentativa de randomizar mais de uma vez
const rand = (): number => {
  const aux = []
  let randNumber: number = 0

  for (let index = 0; index < 10; index++) {
    aux.push(Math.random())
  }

  while (aux.length >= 1) {
    randNumber = Math.random() === 0.5 ? aux.pop()! : aux.shift()!
  }

  return randNumber
}

const isGoleiro = (player: Player) => player.type === 'goalkeeper'
const isNotGoleiro = (player: Player) => !isGoleiro(player)

const getPesoForTeam = (team: Team): number => {
  // se n tiver goleiro, assume que tem 1 de peso 1
  const hasGoleiro = team.players.filter(isGoleiro).length > 0
  const initial = hasGoleiro ? 0 : 1

  return team.players.reduce(
    (memo, player) => {
      return memo + player.stars
    }, initial
  )
}

const getAvailableTeams = (teams: Team[], linePlayersTotal: number, maxLinePlayersPerTeam: number) => {
  const lastTeamMaxCount = (linePlayersTotal % maxLinePlayersPerTeam) === 0 ? maxLinePlayersPerTeam : (linePlayersTotal % maxLinePlayersPerTeam)
  let teamsAux = [...teams]

  // + 1 por conta do goleiro
  const lastTeamLinePlayersCount = teams[ teams.length -1 ].players.filter(isNotGoleiro).length
  if (lastTeamLinePlayersCount >= lastTeamMaxCount) {
    teamsAux.pop()
  }

  // remove os times que ja tem todos os jogadores na linha
  teamsAux = teamsAux.filter(team => {
    return team.players.filter(isNotGoleiro).length < maxLinePlayersPerTeam
  })

  const menorPeso = teamsAux.map(
    getPesoForTeam).reduce((memo, item) => Math.min(memo, item))

  return teamsAux.filter(t => getPesoForTeam(t) == menorPeso)
}


export const generateTeams = (players: Player[], pelada: Pelada): Team[] => {
  const playersAvaiblable = players.filter(p => p.availableToPlay)
  const goalkeppers = playersAvaiblable.filter(isGoleiro)
  const linePlayers = playersAvaiblable.filter(isNotGoleiro)
  const maxLinePlayersPerTeam = pelada.teamPlayersCount || 5

  const teansCount = Math.max(goalkeppers.length, Math.ceil(linePlayers.length / maxLinePlayersPerTeam))

  const teams: Team[] = []

  for (let i = 0; i < teansCount ; i ++) {
    teams.push({
      players: []
    })
  }

  goalkeppers.sort(() => 0.5 - rand()).forEach(
    (goalkepper, index) => teams[index].players.push(goalkepper)
  )

  linePlayers.sort(
    (a, b) => {
      const playerTypeDiff = playerTypes.indexOf(a.type) - playerTypes.indexOf(b.type)
      if (playerTypeDiff !== 0) {
        return playerTypeDiff
      }

      const aPeso = a.stars || 5
      const bPeso = b.stars || 5

      if (aPeso === bPeso) {
        return 0.5 - rand()
      } else {
        return bPeso - aPeso
      }
  }).forEach(player => {
    const availableTeams = getAvailableTeams(teams, linePlayers.length, maxLinePlayersPerTeam)

    availableTeams[ Math.floor(rand() * availableTeams.length) ].players.push(player)
  })

  return teams
}