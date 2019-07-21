import { Lottery, Team } from "../types";
import { Reducer, Action, ActionCreator, compose } from "redux";
import { AsyncStorage } from "react-native";
import { randId } from "../utils/randId";
import _ from "lodash";
import pelada from "../screens/pelada";
import { AddAction, addReducer, UpdateAction, removeReducer, RemoveAction, updateReducer, ResetAction, setReducer, State } from "./crud";
import composeReducersArray from "../utils/composeReducersArray";

export const LotteryKey = 'lottery'

export type LotteryState = State<Lottery>

export type AddLotteryAction = AddAction<Lottery, '@@lottery/AddLotteryAction'>

export type UpdateLotteryAction = UpdateAction<Lottery, '@@lottery/UpdateLotteryAction'>

export type RemoveLotteryAction = RemoveAction<'@@lottery/RemoveLotteryAction'>

export type SetLotteryAction = ResetAction<LotteryState, '@@lottery/SetLotteryAction'> 

export interface GenerateLotteryAction {
  type: '@@lottery/GenerateLotteryAction',
  payload: number
}

const initialState: LotteryState = {}

const lotteryReducer: Reducer<LotteryState> = composeReducersArray(
  initialState,
  addReducer<LotteryState>('@@lottery/AddLotteryAction'),
  updateReducer<LotteryState>('@@lottery/UpdateLotteryAction'),
  removeReducer<LotteryState>('@@lottery/RemoveLotteryAction'),
  setReducer<LotteryState>('@@lottery/SetLotteryAction')
)

export const setLottery = (lotteries: LotteryState): SetLotteryAction => ({
  type: '@@lottery/SetLotteryAction',
  payload: lotteries
})

export const addLottery = (peladaId: number, teams: Team[]): AddLotteryAction => ({
  type: '@@lottery/AddLotteryAction',
  payload: {
    id: randId(),
    peladaId,
    teams
  }
})

export const updateLottery = (lottery: Lottery): UpdateLotteryAction => ({
  type: '@@lottery/UpdateLotteryAction',
  payload: lottery
})

export const removeLottery = (lotteryId: number): RemoveLotteryAction => ({
  type: '@@lottery/RemoveLotteryAction',
  payload: lotteryId
})

export const generateLottery = (peladaId: number): GenerateLotteryAction => ({
  type: '@@lottery/GenerateLotteryAction',
  payload: peladaId
})


export default lotteryReducer


