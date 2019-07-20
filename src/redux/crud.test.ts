import { addReducer, Idable, State, AddAction, UpdateAction, RemoveAction, updateReducer, removeReducer, setReducer, ResetAction } from "./crud";
import { randId } from "../utils/randId";
import { AnyAction } from "redux";
import { string } from "prop-types";
import { Reducer } from "react";

interface Foo extends Idable {
  anyField: string
}

type FooState = State<Foo>

type FooAddAction = AddAction<Foo, 'add'>
type FooUpdateAction = UpdateAction<Foo, 'update'>
type FooRemoveAction = RemoveAction<'remove'>
type FooResetAction = ResetAction<FooState, 'reset'>

let foo: Foo
let initialState: FooState
let reducer: Reducer<FooState, AnyAction>

beforeEach(() => {
  foo = {
    id: randId(),
    anyField: 'bar'
  }

  initialState = {}
})

describe(addReducer, () => {
  beforeEach(() => {
    reducer = addReducer<FooState>("add")
  })

  test("should return state with object", () => {
    const action: FooAddAction = {
      type: 'add',
      payload: foo
    }

    expect(reducer(initialState, action)).toStrictEqual({
      [foo.id]: foo
    })
  })

  test("should return same state", () => {
    const action = {
      type: 'foo'
    }

    expect(reducer(initialState, action)).toBe(initialState)
  })
})

describe(updateReducer, () => {
  beforeEach(() => {
    reducer = updateReducer<FooState>("update")
  })

  test("should return state with object", () => {
    const action: FooUpdateAction = {
      type: 'update',
      payload: foo
    }

    expect(reducer(initialState, action)).toStrictEqual({
      [foo.id]: foo
    })
  })

  test("should return same state", () => {
    const action = {
      type: 'foo'
    }

    expect(reducer(initialState, action)).toBe(initialState)
  })
})

describe(removeReducer, () => {
  let state: FooState
  beforeEach(() => {
    reducer = removeReducer<FooState>("remove")
    state = {
      [foo.id]: foo,
      2: foo
    }
  })

  test("should remove object from state", () => {
    const action: FooRemoveAction = {
      type: 'remove',
      payload: foo.id
    }

    expect(reducer(state, action)).toStrictEqual({2: foo})
  })

  test("should return same state", () => {
    const action = {
      type: 'foo'
    }

    expect(reducer(state, action)).toBe(state)
  })
})

describe(setReducer, () => {
  beforeEach(() => {
    reducer = setReducer('reset')
  })

  test("should return state", () => {
    const newState: FooState = {
      1: foo,
      [foo.id]: foo
    }

    const action: FooResetAction = {
      type: 'reset',
      payload: newState
    } 

    expect(reducer({2: foo}, action)).toBe(newState)
  })
})

export default null