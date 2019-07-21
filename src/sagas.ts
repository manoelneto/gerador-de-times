import { takeEvery, call, put, select, fork } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { PeladaKey, setPelada, addPelada } from './redux/pelada';
import { setPlayer, PlayerKey, addPlayer } from "./redux/player";
import { GenerateLotteryAction, addLottery, LotteryKey, setLottery, updateLottery } from './redux/lottery';
import { Pelada, Player, Team, playerStars } from './types';
import { generateTeams } from './utils/generateTeams';
import { ApplicationState } from './store';
import _ from 'lodash';


interface LegacyPlayer {
  name: string,
  type: "goleiro" | "jogador"
  ableToTeam: boolean
  peso: 1 | 2 | 3 | 4 | 5
}

interface LegacyState {
  players: LegacyPlayer[]
  playersOnLine: string
}

const asyncGet = async (key: string) => await AsyncStorage.getItem(key)
const asyncSet = async (key: string, value: string) => await AsyncStorage.setItem(key, value)

function * migrateLegacyApp() {
  const legacyStateAux: string = yield call(asyncGet, 'state')
  const legacyState: LegacyState = legacyStateAux && JSON.parse(legacyStateAux)
  const migrated: string = yield call(asyncGet, 'migrated')

  if (migrated !== "1" && legacyState && legacyState.players) {
    const pelada: Pelada = {
      name: "Pelada Padrão",
      player_ids: [],
      teamPlayersCount: legacyState.playersOnLine ? parseInt(legacyState.playersOnLine) : 5,
      id: 1
    }

    yield put(setPelada({
      1: pelada
    }))

    for (let i = 0; i < legacyState.players.length; i++) {
      const legacyPlayer = legacyState.players[i];
      
      yield put(
        addPlayer(
          1, 
          legacyPlayer.name, 
          legacyPlayer.type === 'goleiro' ? "goalkeeper" : "defender",
          parseInt(legacyPlayer.peso.toString()) as playerStars,
          legacyPlayer.ableToTeam
        )
      )
    }

    yield call(asyncSet, "migrated", "1")
  }
}

function * initPelada() {
  const peladas = yield call(asyncGet, PeladaKey)
  yield put(setPelada(JSON.parse(peladas)))
}

function * initPlayers () {
  const players = yield call(asyncGet, PlayerKey)
  yield put(setPlayer(JSON.parse(players)))
}

function * initLottery () {
  const lottery = yield call(asyncGet, LotteryKey)
  yield put(setLottery(JSON.parse(lottery)))
}

function * syncWithStorage() {
  yield takeEvery('*', function * () {
    const {
      pelada,
      player,
      lottery
    } = yield select()

    yield call(asyncSet, LotteryKey, JSON.stringify(lottery))
    yield call(asyncSet, PeladaKey, JSON.stringify(pelada))
    yield call(asyncSet, PlayerKey, JSON.stringify(player))
  })
}

function * generateLottery() {
  yield takeEvery('@@lottery/GenerateLotteryAction', function * (action: GenerateLotteryAction) {
    const peladaId = action.payload
    
    const state: ApplicationState = yield select()

    const pelada: Pelada = state.pelada[peladaId]

    if (pelada) {
      const players: Player[] = pelada.player_ids.map(playerId => state.player[playerId]).filter(p => !!p)
      const teams: Team[] = generateTeams(players, pelada)
      const prevLottery = _.values(state.lottery).find(l => l.peladaId === peladaId)

      if (prevLottery) {
        yield put(updateLottery({
          ...prevLottery,
          teams
        }))
      } else {
        yield put(addLottery(peladaId, teams))
      }

    }
  })
}

function * sagas() {
  yield fork(syncWithStorage)
  yield call(migrateLegacyApp)
  yield call(initPelada)
  yield call(initPlayers)
  yield call(initLottery)
  yield fork(generateLottery)
}

export default sagas