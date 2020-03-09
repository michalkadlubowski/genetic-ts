import { PointChromosome } from './PointChromosome';
import { Population } from './Population';
import { BitChromosomeConverter } from './BitChromosomeConverter';
import { GenericBitChromosome } from './GenericBitChromosome';

export class GeneticProcedure {
  private initialPopulation: Population<PointChromosome>;
  private mutationRate: number;
  private crossoverRate: number;
  private noToRemain: number;
  private converter = new BitChromosomeConverter();
  private fitnessFunc: (y: PointChromosome) => number;
  constructor(
      population: Population<PointChromosome>,
      mutationRate: number,
      crossoverRate: number,
      factorToRemain: number,
      fitnessFunc: (y: PointChromosome) => number) {
    this.initialPopulation = population;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.noToRemain = factorToRemain * this.initialPopulation.population.length;
    this.fitnessFunc = fitnessFunc;
  }
  private toGenericChromosome(chromosome: PointChromosome) {
    return new GenericBitChromosome(this.converter.convertToBits(chromosome));
  }
  public evolve(numberOfGenerations: number) {
    let population = this.initialPopulation;
    for (let gen = 0; gen < numberOfGenerations; gen++) {
      // Write current population stats
      this.printStats(population);
      const newPopulationChromosomes = population.population.map(p => new PointChromosome(p.x, p.y));
      const newPopulation = new Population(newPopulationChromosomes, population.generationNo + 1);
      newPopulation.population = newPopulation.population.sort((a, b) => this.fitnessFunc(b) - this.fitnessFunc(a));
      for (let i = this.noToRemain; i < newPopulation.population.length; i = i + 1) {
        const chromo = newPopulation.population[i];
        if (Math.random() < 0.2) {
          newPopulation.population[i] = this.createCrossOver(newPopulation);
          continue;
        }
        else {
          const mutatedGenes = this.toGenericChromosome(chromo).mutate(this.mutationRate).genes;
          newPopulation.population[i] = this.converter.convertFromBits(mutatedGenes);
        }
      }
      population = newPopulation;
    }
  }

  private printStats(population: Population<PointChromosome>) {
    const mostFit = population.getMostFit(this.fitnessFunc);
    console.log(`Population ${population.generationNo}
     Most fit  x: ${mostFit.x} y: ${mostFit.y} score: ${this.fitnessFunc(mostFit)}
     avg fit:  ${population.getAvgFitness(this.fitnessFunc)}`);
  }

  private createCrossOver(newPopulation: Population<PointChromosome>) {
    const firstToCrossover = newPopulation.getRandomMostFitFromTournament(this.fitnessFunc, 20);
    const secondToCrossover = newPopulation.getRandomMostFitFromTournament(this.fitnessFunc, 20);
    const crossover = this.toGenericChromosome(firstToCrossover)
      .crossover(this.toGenericChromosome(secondToCrossover), this.crossoverRate);
    const crossoverChromo = this.converter.convertFromBits(crossover.genes);
    return crossoverChromo;
  }
}
