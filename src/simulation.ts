function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

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
  const newState: State = JSON.parse(JSON.stringify(state));

  const organisms: Organism[] = [];
  let genepool: Organism[] = [];
  for (const organism of newState.organisms) {
    organism.age++;

    const baseSurvivalRate =
      organism.mutation === Mutation.NONE
        ? settings.inactiveBaseSurvivalRate
        : settings.activeBaseSurvivalRate;
    const baseSurvivalRateChange =
      organism.mutation === Mutation.NONE
        ? settings.inactiveBaseSurvivalRateChange
        : settings.activeBaseSurvivalRateChange;

    const survivalRate =
      baseSurvivalRate + organism.age * baseSurvivalRateChange;
    const willSurvive = Math.random() < survivalRate;

    if (!willSurvive) {
      continue;
    }

    organisms.push(organism);

    const baseReproductionRate =
      organism.mutation === Mutation.NONE
        ? settings.inactiveBaseReproductionRate
        : settings.activeBaseReproductionRate;
    const baseReproductionRateChange =
      organism.mutation === Mutation.NONE
        ? settings.inactiveBaseReproductionRateChange
        : settings.activeBaseReproductionRateChange;

    const reproductionRate =
      baseReproductionRate + organism.age * baseReproductionRateChange;
    const willReproduce = Math.random() < reproductionRate;

    if (willReproduce) {
      genepool.push(organism);
    }
  }

  genepool = shuffleArray(genepool);

  if (genepool.length >= 2) {
    if (genepool.length % 2 === 1) {
      genepool.pop();
    }

    for (let i = 0; i < genepool.length; i += 2) {
      let mutation = Mutation.NONE;
      const firstParent = genepool[i];
      const secondParent = genepool[i + 1];

      let firstAllelMutated = false;
      let secondAllelMutated = false;

      switch (firstParent.mutation) {
        case Mutation.BOTH:
          firstAllelMutated = true;
          break;
        case Mutation.ONE:
          firstAllelMutated = Math.random() < 0.5;
          break;
      }

      switch (secondParent.mutation) {
        case Mutation.BOTH:
          secondAllelMutated = true;
          break;
        case Mutation.ONE:
          secondAllelMutated = Math.random() < 0.5;
          break;
      }

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

      organisms.push(organism);
    }
  }

  newState.organisms = organisms;
  return newState;
}
