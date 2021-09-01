export interface Settings {
  mutationRate: number;
  inactiveBaseSurvivalRate: number;
  activeBaseSurvivalRate: number;
  inactiveBaseSurvivalRateChange: number;
  activeBaseSurvivalRateChange: number;
  inactiveBaseReproductionRate: number;
  activeBaseReproductionRate: number;
  inactiveBaseReproductionRateChange: number;
  activeBaseReproductionRateChange: number;
}

export enum Mutation {
  NONE = 0,
  ONE = 1,
  BOTH = 2,
}

export interface Organism {
  id: number;
  mutation: Mutation;
}

export interface State {
  currentId: number;
  organisms: Organism[];
}

export function init(settings: Settings): State {
  const state: State = {
    currentId: 0,
    organisms: [],
  };

  return state;
}

export function next(state: State, settings: Settings): State {
  return state;
}
