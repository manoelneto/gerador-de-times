import { takeEvery, call, put, select } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { PeladaKey, setPelada } from './redux/pelada';
import { setPlayer, PlayerKey } from "./redux/player";

const asyncGet = async (key: string) => await AsyncStorage.getItem(key)
const asyncSet = async (key: string, value: string) => await AsyncStorage.setItem(key, value)

function * initPelada() {
  const peladas = yield call(asyncGet, PeladaKey)
  yield put(setPelada(JSON.parse(peladas)))
}

function * initPlayers () {
  const players = yield call(asyncGet, PlayerKey)
  yield put(setPlayer(JSON.parse(players)))
}

function * syncWithStorage() {
  yield takeEvery('*', function * () {
    const {
      pelada,
      player
    } = yield select()

    yield call(asyncSet, PeladaKey, JSON.stringify(pelada))
    yield call(asyncSet, PlayerKey, JSON.stringify(player))
  })
}

function * sagas() {
  yield call(initPelada)
  yield call(initPlayers)
  yield call(syncWithStorage)
}

export default sagas