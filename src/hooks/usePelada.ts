import { useCallback } from "react";
import { ApplicationState } from "../store";
import { Player, Pelada } from "../types";
import { useSelector } from "react-redux";

const usePelada = (peladaId: number): Pelada | undefined => {
  const selector = useCallback((state: ApplicationState) => state.pelada[peladaId], [])
  return useSelector(selector)
}

export default usePelada