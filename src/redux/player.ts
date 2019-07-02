import { Player } from "../types";
import { Reducer, Action, ActionCreator, compose } from "redux";
import { AsyncStorage } from "react-native";
import { randId } from "../utils/randId";
import _ from "lodash";
import pelada from "../screens/pelada";
import { AddAction, addReducer, UpdateAction, removeReducer, RemoveAction, updateReducer, ResetAction, setReducer, State } from "./crud";

export const PlayerKey = 'player'

type PlayerState = State<Player>

export interface AddPlayerAction extends AddAction<Player, '@@player/AddPlayerAction'> {
  peladaId: number
}

export interface UpdatePlayerAction extends UpdateAction<Player, '@@player/UpdatePlayerAction'> {
}

export interface RemovePlayerAction extends RemoveAction<'@@player/RemovePlayerAction'> {
  peladaId: number
}

export interface SetPlayerAction extends ResetAction<PlayerState, '@@player/SetPlayerAction'> {
}

const initialState: PlayerState = {}

const playerReducer: Reducer<PlayerState> = compose(
  addReducer<PlayerState>('@@player/AddPlayerAction', initialState),
  updateReducer<PlayerState>('@@player/AddPlayerAction', initialState),
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

export const removePlayer = (playerId: number, peladaId: number): RemovePlayerAction => ({
  type: '@@player/RemovePlayerAction',
  payload: playerId,
  peladaId
})

export default playerReducer


