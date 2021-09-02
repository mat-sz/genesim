export interface Settings {
  startOrganismCount: number;
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
  x: number;
  y: number;
  age: number;
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

  for (let i = 0; i < settings.startOrganismCount; i++) {
    const firstAllelMutated = Math.random() < settings.mutationRate;
    const secondAllelMutated = Math.random() < settings.mutationRate;

    let mutation = Mutation.NONE;

    if (firstAllelMutated && secondAllelMutated) {
      mutation = Mutation.BOTH;
    } else if (firstAllelMutated || secondAllelMutated) {
      mutation = Mutation.ONE;
    }

    const organism: Organism = {
      id: state.currentId++,
      age: 0,
      mutation,
      x: Math.random(),
      y: Math.random(),
    };

    state.organisms.push(organism);
  }

  return state;
}

export function next(state: State, settings: Settings): State {
  return state;
}
