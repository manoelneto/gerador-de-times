import { Player } from "../types";
import { Reducer, Action, ActionCreator, compose } from "redux";
import { AsyncStorage } from "react-native";
import { randId } from "../utils/randId";
import _ from "lodash";
import pelada from "../screens/pelada";
import { AddAction, addReducer, UpdateAction, removeReducer, RemoveAction, updateReducer, ResetAction, setReducer, State } from "./crud";
import composeReducersArray from "../utils/composeReducersArray";

export const PlayerKey = 'player'

export type PlayerState = State<Player>

export interface AddPlayerAction extends AddAction<Player, '@@player/AddPlayerAction'> {
  peladaId: number
}

export interface UpdatePlayerAction extends UpdateAction<Player, '@@player/UpdatePlayerAction'> {
}

export type RemovePlayerAction = RemoveAction<'@@player/RemovePlayerAction'>

export interface SetPlayerAction extends ResetAction<PlayerState, '@@player/SetPlayerAction'> {
}

const initialState: PlayerState = {}

const playerReducer: Reducer<PlayerState> = composeReducersArray(
  initialState,
  addReducer<PlayerState>('@@player/AddPlayerAction', initialState),
  updateReducer<PlayerState>('@@player/UpdatePlayerAction', initialState),
  removeReducer<PlayerState>('@@player/RemovePlayerAction', initialState),
  setReducer<PlayerState>('@@player/SetPlayerAction', initialState)
)

export const setPlayer = (players: PlayerState): SetPlayerAction => ({
  type: '@@player/SetPlayerAction',
  payload: players
})

export const addPlayer = (peladaId: number, name: string): AddPlayerAction => ({
  type: '@@player/AddPlayerAction',
  payload: {
    name,
    id: randId(),
    stars: 5,
    availableToPlay: true,
    type: 'player'
  },
  peladaId
})

export const updatePlayer = (player: Player): UpdatePlayerAction => ({
  type: '@@player/UpdatePlayerAction',
  payload: player
})

export const removePlayer = (playerId: number): RemovePlayerAction => ({
  type: '@@player/RemovePlayerAction',
  payload: playerId
})


export default playerReducer


