import { Reducer, ActionCreator, Action, compose, combineReducers } from "redux";
import { AsyncStorage } from "react-native";
import { tsNamespaceExportDeclaration } from "@babel/types";
import { Pelada, Player } from "../types";
import _ from "lodash";
import { AddPlayerAction, RemovePlayerAction, addPlayer } from "./player";
import { randId } from "../utils/randId";
import { AddAction, RemoveAction, UpdateAction, ResetAction, addReducer, removeReducer, updateReducer, setReducer, State } from "./crud";
import composeReducersArray from "../utils/composeReducersArray";


export const PeladaKey = 'peladas'

export type PeladaState = State<Pelada>

interface AddPeladaAction extends AddAction<Pelada, '@@pelada/AddPeladaAction'> {}
interface UpdatePeladaAction extends UpdateAction<Pelada, '@@pelada/UpdatePeladaAction'> {}
interface RemovePeladaAction extends RemoveAction<'@@pelada/RemovePeladaAction'> {}
interface SetPeladaAction extends ResetAction<PeladaState, '@@pelada/SetPeladaAction'> {}

const initialState: PeladaState = {}

const playerReducer: Reducer<PeladaState> = (
  state: PeladaState = initialState,
  action
) => {
  switch (action.type) {
    case `@@player/AddPlayerAction`: {
      const playerId = (action as AddPlayerAction).payload.id
      const pelada = state[(action as AddPlayerAction).peladaId]

      const newPelada = {
        ...pelada,
        player_ids: [
          ...pelada.player_ids,
          playerId
        ]
      }

      const newState: PeladaState = {
        ...state,
        [newPelada.id]: newPelada
      }

      return newState
    }

    case '@@player/RemovePlayerAction': {
      const playerId = (action as RemovePlayerAction).payload
      const newState: PeladaState = _.reduce(state, (acc: PeladaState, pelada: Pelada) => {

        acc[pelada.id] = {
          ...pelada,
          player_ids: pelada.player_ids.filter(id => playerId !== id)
        }

        return acc
      }, {})

      return newState
    }

    default:
      return state
  }
}


const peladaReducer: Reducer<PeladaState> = composeReducersArray(
  initialState,
  addReducer<PeladaState>('@@pelada/AddPeladaAction'),
  updateReducer<PeladaState>('@@pelada/UpdatePeladaAction'),
  removeReducer<PeladaState>('@@pelada/RemovePeladaAction'),
  setReducer<PeladaState>('@@pelada/SetPeladaAction'),
  playerReducer
)

export const setPelada = (peladas: PeladaState): SetPeladaAction => ({
  type: '@@pelada/SetPeladaAction',
  payload: peladas
}) 

export const addPelada = (name: string): AddPeladaAction => ({
  type: '@@pelada/AddPeladaAction',
  payload: {
    name,
    id: randId(),
    player_ids: [],
    teamPlayersCount: 5
  }
}) 

export const removePelada = (peladaId: number): RemovePeladaAction => ({
  type: '@@pelada/RemovePeladaAction',
  payload: peladaId
}) 

export const updatePelada = (pelada: Pelada): UpdatePeladaAction => ({
  type: '@@pelada/UpdatePeladaAction',
  payload: pelada
}) 

export default peladaReducer