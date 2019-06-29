import { Reducer, ActionCreator, Action } from "redux";
import { AsyncStorage } from "react-native";
import { tsNamespaceExportDeclaration } from "@babel/types";
import { Pelada, Player } from "../types";
import _ from "lodash";
import { AddPlayerAction, RemovePlayerAction } from "./player";
import { randId } from "../utils/randId";

export const PeladaKey = 'peladas'

export type PeladaState = {
  [key: number]: Pelada
}

interface InitializePeladaAction extends Action {
  type: '@@pelada/InitializePeladaAction',
  payload: Pelada[]
}

interface AddPeladaAction extends Action {
  type: '@@pelada/AddPeladaAction',
  payload: Pelada
}

interface RemovePeladaAction extends Action {
  type: '@@pelada/RemovePeladaAction',
  payload: number
}

interface UpdatePeladaAction extends Action {
  type: '@@pelada/UpdatePeladaAction',
  payload: Pelada
}

const initialState: PeladaState = {}

const peladaReducer: Reducer<PeladaState> = (
  state: PeladaState = initialState,
  action
) => {
  switch (action.type) {
    case '@@pelada/InitializePeladaAction': {
      return (action as InitializePeladaAction).payload
    }

    case '@@pelada/AddPeladaAction':
    case '@@pelada/UpdatePeladaAction': {
      const pelada = (action as AddPeladaAction).payload

      const newState = {
        ...state,
        [pelada.id]: pelada
      }

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }


    case '@@pelada/RemovePeladaAction': {
      const peladaId = (action as RemovePeladaAction).payload

      const newState = _.omit(state, peladaId)

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }

    case `@@player/AddPlayerAction`: {
      const playerId = (action as AddPlayerAction).player.id
      const pelada = state[(action as AddPlayerAction).peladaId]

      const newPelada = {
        ...pelada,
        player_ids: [
          ...pelada.player_ids,
          playerId
        ]
      }

      const newState = {
        ...state,
        [newPelada.id]: newPelada
      }

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }

    case '@@player/RemovePlayerAction': {
      const playerId = (action as RemovePlayerAction).playerId
      const pelada = state[(action as RemovePlayerAction).peladaId]

      const newPelada = {
        ...pelada,
        player_ids: _.omit(pelada.player_ids, playerId)
      }

      const newState = {
        ...state,
        [newPelada.id]: newPelada
      }

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }

    default:
      return state
  }
}


export const initialize: ActionCreator<InitializePeladaAction> = (peladas: Pelada[]) => ({
  type: '@@pelada/InitializePeladaAction',
  payload: peladas
}) 

export const addPelada: ActionCreator<AddPeladaAction> = (name: string) => ({
  type: '@@pelada/AddPeladaAction',
  payload: {
    name,
    id: randId(),
    player_ids: []
  }
}) 

export const removePelada: ActionCreator<RemovePeladaAction> = (peladaId: number) => ({
  type: '@@pelada/RemovePeladaAction',
  payload: peladaId
}) 

export const updatePelada: ActionCreator<UpdatePeladaAction> = (pelada: Pelada) => ({
  type: '@@pelada/UpdatePeladaAction',
  payload: pelada
}) 

export default peladaReducer