import { createStore, combineReducers, Reducer, Store } from "redux";
import peladaReducer, { PeladaState, initialize as initializePelada, PeladaKey } from "./redux/pelada";
import { AsyncStorage } from "react-native";

const initialState = {
  
}

export interface ApplicationState {
  pelada: PeladaState
}

const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  pelada: peladaReducer
})

const store: Store<ApplicationState> = createStore(
  reducers,
  initialState
)

AsyncStorage.getItem(PeladaKey).then(peladas => {
  try {
    store.dispatch(initializePelada(JSON.parse(peladas || '[]')))
  } catch (error) {
  }
  
})


export default store