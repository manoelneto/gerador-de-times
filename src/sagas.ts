import { takeEvery, call, put } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { PeladaKey, setPelada } from './redux/pelada';
import { setPlayer, PlayerKey } from "./redux/player";

const asyncGet = async (key: string) => await AsyncStorage.getItem(key)

function * initPelada() {
  const peladas = yield call(asyncGet, PeladaKey)
    console.log(JSON.parse(peladas))
    yield put(setPelada(JSON.parse(peladas)))
}

function * initPlayers () {
  const players = yield call(asyncGet, PlayerKey)
  console.log(JSON.parse(players))
  yield put(setPlayer(JSON.parse(players)))
}

function * sagas() {
  yield call(initPelada)
  yield call(initPlayers)
}

export default sagas