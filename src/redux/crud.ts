import { Action, Reducer } from "redux";
import _ from "lodash";
import { string } from "prop-types";

export interface Idable {
  id: number
}

export interface State<T extends Idable> {
  [key: number]: T
}

export interface AddAction<T extends Idable, Type = any> extends Action<Type> {
  payload: T
}

export interface UpdateAction<T extends Idable, Type = any> extends Action<Type> {
  payload: T
}

export interface RemoveAction<Type = any> extends Action<Type> {
  payload: number
}

export interface ResetAction<S extends State<Idable>, Type = any> extends Action<Type> {
  payload: S
}

export const addReducer = <S extends State<Idable>> (type: string): Reducer<S> => 
  (state, action): S => {
    // console.log(state, action, 1)
    if (action.type === type) {
      const payload = (action as AddAction<Idable>).payload
      return {
        ...state!,
        [payload.id]: payload
      }
    }

    return state!
  }

export const updateReducer = <S extends State<Idable>> (type: string): Reducer<S> =>
  (state, action): S => {
    // console.log(state, action, 2)
    if (action.type === type) {
      const payload = (action as UpdateAction<Idable>).payload

      return {
        ...state!,
        [payload.id]: payload
      }
    }

    return state!
  }

export const removeReducer = <S extends State<Idable>> (type: string): Reducer<S> => 
  (state, action): S => {
    // console.log(state, action, 3)
    if (action.type === type) {
      const payload = (action as RemoveAction).payload
      const newState = {...state!}
      delete newState[payload]
      return newState
    }

    return state!
  }

export const setReducer = <S extends State<Idable>> (type: string): Reducer<S> =>
  (state, action): S => {
    // console.log(state, action, 4)
    if (action.type === type) {
      return (action as ResetAction<S>).payload
    }

    return state!
  }