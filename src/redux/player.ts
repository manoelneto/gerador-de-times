import { Player } from "../types";
import { Reducer, Action, ActionCreator } from "redux";
import { AsyncStorage } from "react-native";
import { randId } from "../utils/randId";

export const PlayerKey = 'player'

export interface PlayerState {
  [key: number]: Player
}

export interface AddPlayerAction extends Action {
  type: '@@player/AddPlayerAction',
  player: Player
  peladaId: number
}

export interface SetAvailableToPlayAction extends Action {
  type: '@@player/SetAvailableToPlayAction',
  playerId: number
  availableToPlay: boolean
}

export interface UpdatePlayerAction extends Action {
  type: '@@player/UpdatePlayerAction',
  player: Player
}

export interface InitializePlayerAction extends Action {
  type: '@@player/InitializePlayerAction',
  players: Player[]
}

const initialState: PlayerState = {}

const playerReducer: Reducer<PlayerState> = (
  state: PlayerState = initialState,
  action
) => {
  switch (action.type) {
    case '@@player/InitializePlayerAction': {
      return (action as InitializePlayerAction).players
    }
    
    case '@@player/AddPlayerAction': {
      const player = (action as AddPlayerAction).player

      const newState = {
        ...state,
        [player.id]: player
      }

      AsyncStorage.setItem(PlayerKey, JSON.stringify(newState))

      return newState
    }
  
    case '@@player/SetAvailableToPlayAction': {
      const playerId = (action as SetAvailableToPlayAction).playerId
      const availableToPlay = (action as SetAvailableToPlayAction).availableToPlay

      const newState = {
        ...state,
        [playerId]: {
          ...state[playerId],
          availableToPlay
        }
      }

      AsyncStorage.setItem(PlayerKey, JSON.stringify(newState))

      return newState
    }
  
    case '@@player/UpdatePlayerAction': {
      const player = (action as UpdatePlayerAction).player

      const newState = {
        ...state,
        [player.id]: player
      }

      AsyncStorage.setItem(PlayerKey, JSON.stringify(newState))

      return newState
    }
  
    default:
      return state
  }
}

export const initializePlayer: ActionCreator<InitializePlayerAction> = (players: Player[]) => ({
  type: '@@player/InitializePlayerAction',
  players
})

export const addPlayer: ActionCreator<AddPlayerAction> = (peladaId: number, name: string) => ({
  type: '@@player/AddPlayerAction',
  player: {
    name,
    id: randId(),
    stars: 5,
    availableToPlay: true,
    type: 'player'
  },
  peladaId
})

export const setAvailableToPlay = (playerId: number, availableToPlay: boolean): SetAvailableToPlayAction => ({
  type: '@@player/SetAvailableToPlayAction',
  playerId,
  availableToPlay
})

export const updatePlayer = (player: Player): UpdatePlayerAction => ({
  type: '@@player/UpdatePlayerAction',
  player
})

export default playerReducer


