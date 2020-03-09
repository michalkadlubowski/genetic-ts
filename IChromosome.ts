interface IChromosome<T> {
  crossover(other: T, uniformRate: number): T;
  mutate(probability: number): T;
}
