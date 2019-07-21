import { Idable } from "./redux/crud";

export const humanPositions = {
  defender: "Zagueiro",
  midfielder: "Meio Campo",
  forward: "Atacante"
}

export type playerType = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'

export type playerStars = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const playerTypes: playerType[] = [
  "goalkeeper",
  "defender",
  "midfielder",
  "forward"
]

export interface Player extends Idable {
  name: string
  type: playerType
  stars: playerStars
  availableToPlay: boolean
}

export interface Pelada extends Idable {
  name: string
  player_ids: number[],
  teamPlayersCount: number
}

export interface Team {
  players: Player[]
}

export interface Lottery {
  id: number
  peladaId: number
  teams: Team[]
}
