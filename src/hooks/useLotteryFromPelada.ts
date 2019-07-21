import { useCallback } from "react";
import { ApplicationState } from "../store";
import { Player, Pelada, Lottery } from "../types";
import { useSelector } from "react-redux";
import _ from "lodash";

const useLotteryFromPelada = (peladaId: number): Lottery | undefined => {
  const selector = useCallback((state: ApplicationState) => {
    return _.values(state.lottery).find((l: Lottery) => l.peladaId === peladaId)
  }, [peladaId])

  return useSelector(selector)
}

export default useLotteryFromPelada