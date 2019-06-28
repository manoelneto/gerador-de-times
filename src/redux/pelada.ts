import Pelada from "../types/Pelada";
import { Reducer, ActionCreator, Action } from "redux";
import { AsyncStorage } from "react-native";
import { tsNamespaceExportDeclaration } from "@babel/types";

export const PeladaKey = 'peladas'

export type PeladaState = Pelada[]

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
  payload: Pelada
}

interface UpdatePeladaAction extends Action {
  type: '@@pelada/UpdatePeladaAction',
  payload: Pelada
}


// const initialState = JSON.parse(localStorage.getItem('pelada') || "[]")

const initialState: Pelada[] = []

const peladaReducer: Reducer<PeladaState> = (
  state: PeladaState = initialState,
  action
) => {
  switch (action.type) {
    case '@@pelada/InitializePeladaAction': {
      return (action as InitializePeladaAction).payload
    }

    case '@@pelada/AddPeladaAction': {
      const pelada = (action as AddPeladaAction).payload

      const newState = [
        ...state,
        pelada
      ]

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }


    case '@@pelada/RemovePeladaAction': {
      const pelada = (action as RemovePeladaAction).payload

      const newState = state.filter(_pelada => _pelada.id !== pelada.id)

      AsyncStorage.setItem(PeladaKey, JSON.stringify(newState))

      return newState
    }

    case '@@pelada/UpdatePeladaAction': {
      const pelada = (action as UpdatePeladaAction).payload

      const index = state.findIndex(_pelada => _pelada.id === pelada.id)

      const newState = [...state].splice(index, 1, pelada)

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
    id: Math.random() * 999999 + 10,
    players: []
  }
}) 

export const removePelada: ActionCreator<RemovePeladaAction> = (pelada: Pelada) => ({
  type: '@@pelada/RemovePeladaAction',
  payload: pelada
}) 

export const updatePelada: ActionCreator<UpdatePeladaAction> = (pelada: Pelada) => ({
  type: '@@pelada/UpdatePeladaAction',
  payload: pelada
}) 


export default peladaReducer