import { Idable } from "./redux/crud";

export const humanPositions = {
  defender: "Zagueiro",
  midfielder: "Meio Campo",
  forward: "Atacante"
}

export interface Player extends Idable {
  name: string
  position: 'defender' | 'midfielder' | 'forward'
  type: 'goalkeeper' | 'player'
  stars: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  availableToPlay: boolean
}

export interface Pelada extends Idable {
  name: string
  player_ids: number[],
  teamPlayersCount: number
}
