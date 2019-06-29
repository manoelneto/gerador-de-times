import { createStore, combineReducers, Reducer, Store } from "redux";
import peladaReducer, { PeladaState, initialize as initializePelada, PeladaKey } from "./redux/pelada";
import { AsyncStorage } from "react-native";
import playerReducer, { PlayerKey, initializePlayer, PlayerState } from "./redux/player";

const initialState = {
  
}

export interface ApplicationState {
  pelada: PeladaState,
  player: PlayerState
}

const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  pelada: peladaReducer,
  player: playerReducer
})

const store: Store<ApplicationState> = createStore(
  reducers,
  initialState
)

// AsyncStorage.removeItem(PeladaKey)
// AsyncStorage.removeItem(PlayerKey)

AsyncStorage.getItem(PeladaKey).then(peladas => {
  store.dispatch(initializePelada(JSON.parse(peladas || '{}')))
})

AsyncStorage.getItem(PlayerKey).then(players => {
  store.dispatch(initializePlayer(JSON.parse(players || '{}')))
})


export default store