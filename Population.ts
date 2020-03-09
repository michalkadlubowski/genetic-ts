export class Population<T> {
  private size: number;
  public population: T[];
  public generationNo: number;
  constructor(chromosomes: T[], generationNo: number = 0) {
    this.size = chromosomes.length;
    this.population = chromosomes;
    this.generationNo = generationNo;
  }
  public getRandomMostFitFromTournament(fitnessFunc: (y: T) => number, size: number) {
    return this.population
    .map(p => p).sort(() => 0.5 - Math.random())
    .slice(0, size).sort(fitnessFunc)[0];
  }
  public getAvgFitness(fitnessFunc: (y: T) => number) {
    return this.population.map(fitnessFunc).reduce((a, b) => a + b, 0) / this.size;
  }
  public getMostFit(fitnessFunc: (y: T) => number) {
    return this.getByFitRanking(fitnessFunc, this.size - 1);
  }
  public getLeastFit(fitnessFunc: (y: T) => number) {
    return this.getByFitRanking(fitnessFunc, 0);
  }
  public getByFitRanking(fitnessFunc: (y: T) => number, i: number) {
    return this.population.sort((a, b) => fitnessFunc(b) - fitnessFunc(a))[this.size - i - 1];
  }
}
