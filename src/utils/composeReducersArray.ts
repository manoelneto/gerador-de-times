import { Reducer } from "redux";
import { State, Idable } from "../redux/crud";


const composeReducersArray = <S>(initialState: S, ...reducers: Reducer[]): Reducer => (state = initialState, action): S => {
  return reducers.reduce(
    (state, reducer): S => reducer(state, action),
  state)
}

export default composeReducersArray