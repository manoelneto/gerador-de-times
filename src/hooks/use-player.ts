import { useCallback } from "react";
import { ApplicationState } from "../store";
import { Player } from "../types";
import { useSelector } from "react-redux";

const usePlayer = (playerId: number): Player | undefined => {
  const selector = useCallback((state: ApplicationState) => state.player[playerId] , [])
  return useSelector(selector)
}

export default usePlayer