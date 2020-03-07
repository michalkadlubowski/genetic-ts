
interface IChromosome<T> {
  crossover(other: T, uniformRate: number) : T;
  mutate(probability: number) : T;
}

class Population<T> {
  private size: number;
  public population: T[];
  public generationNo: number;

  constructor(chromosomes: T[], generationNo : number = 0) {
    this.size = chromosomes.length;
    this.population = chromosomes;
    this.generationNo = generationNo;
  }

  public getRandomMostFitFromTournament(fitnessFunc: (y: T) => number, size: number){
    return this.population.map(p => p).sort(() => 0.5 - Math.random()).slice(0, size).sort(fitnessFunc)[0];
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

  public getByFitRanking(fitnessFunc: (y: T) => number, i : number) {
    return this.population.sort((a, b) => fitnessFunc(b) - fitnessFunc(a))[this.size - i - 1];
  }
}

class GenericChromosome implements IChromosome<GenericChromosome>{
  public genes: number[];

  constructor(inputGenes: number[]) {
    this.genes = inputGenes;
  }

  public crossover(other: GenericChromosome, uniformRate: number) {
    const newGenes : number[] = [];
    for (let i = 0; i < this.genes.length; i++) {
      const gene = Math.random() < uniformRate ? this.genes[i] : other.genes[i];
      newGenes[i] = gene;
    }
    return new GenericChromosome(newGenes);
  }

  public mutate(probability: number) {
    const newGenes : number[] = [];
    for (let i = 0; i < this.genes.length; i++) {
      let gene = this.genes[i];
      if (Math.random() < probability) {
        gene = gene === 1 ? 0 : 1;
      }
      newGenes[i] = gene;
    }
    return new GenericChromosome(newGenes);
  }
}

class ChromosomeConverter{

  private maxBitsPerProperty = 9;
  private getIntFromBitArray(input: number[]) {
    let result = 0;

    for(let i = 0; i < input.length; i++) {
      if(input[i] === 1) {
        result += Math.pow(2, input.length - i - 1);
      }
    }
    return result;
  }

  public convertFromBits(input: number[]){
    const firstNumBits = input.slice(1, this.maxBitsPerProperty);
    const firstSign = input[0] == 1 ? 1 : -1;
    const firstNum =  firstSign * this.getIntFromBitArray(firstNumBits);

    const secondNumBits = input.slice(this.maxBitsPerProperty + 1, this.maxBitsPerProperty * 2);
    const secongSign = input[this.maxBitsPerProperty] == 1 ? 1 : -1;
    const secondNum = secongSign * this.getIntFromBitArray(secondNumBits);

    return new PointChromosome(firstNum, secondNum);
  }

  public convertToBits(input: PointChromosome) {
    const bits : number[] = [];
    let firstBits = Math.abs(input.x).toString(2);
    let firstBitsSign = input.x >= 0? '1' : '0';

    let secondBitsSign = input.y >= 0? '1' : '0';
    let secondBits = Math.abs(input.y).toString(2);

    while(firstBits.length < this.maxBitsPerProperty - 1){
      firstBits = '0' + firstBits;
    }

    while(secondBits.length<this.maxBitsPerProperty - 1){
      secondBits = '0' + secondBits;
    }

    const allBits = firstBitsSign + firstBits + secondBitsSign + secondBits;
    for (let x = 0; x < allBits.length; x++)
    {
      const c = allBits.charAt(x);
      bits[x] = +c;
    }
    return bits;
  }
}

class PointChromosome{
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function calcFitness(chromosome: PointChromosome) {
  return Math.pow(chromosome.x, 2) + Math.pow(chromosome.y, 2);
}

function peak(chromosome: PointChromosome) {
  const x = chromosome.x/100;
  const y = chromosome.y/100;
  if(x>3 || y>3 || x<-3 || y<-3) {
    return 0;
  }

  let result = 3 * Math.pow((1-x),2) * Math.exp(-(Math.pow(x,2)) - Math.pow((y+1),2)) 
  - 10 * (x/5 - Math.pow(x,3) - Math.pow(y,5)) * Math.exp(-Math.pow(x,2) 
  - Math.pow(y,2)) - 1/3 * Math.exp(-Math.pow((x+1),2) - Math.pow(y,2));
  return result * -1;
}

class GeneticProcedure{
  private initialPopulation : Population<PointChromosome>;
  private mutationRate : number;
  private crossoverRate : number;
  private noToRemain: number;
  private converter = new ChromosomeConverter();
  private fitnessFunc: (y: PointChromosome) => number;

  constructor(
    population : Population<PointChromosome>,
    mutationRate : number,
    crossoverRate : number,
    factorToRemain : number,
    fitnessFunc: (y: PointChromosome) => number) {
    this.initialPopulation = population;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.noToRemain = factorToRemain * this.initialPopulation.population.length;
    this.fitnessFunc = fitnessFunc;
  }

  private toGenericChromosome (chromosome: PointChromosome){
    return new GenericChromosome(this.converter.convertToBits(chromosome));
  }

  public evolve(numberOfGenerations: number) {
    let population = this.initialPopulation;
    
    for(let gen = 0; gen < numberOfGenerations; gen++) {
      //Write current population stats
      const mostFit = population.getMostFit(this.fitnessFunc);
      console.log('Population ' +  population.generationNo +' Most fit ' + ' x: ' + mostFit.x + ' y:' + mostFit.y + ' '   + this.fitnessFunc(mostFit) +' avg fit: ' + population.getAvgFitness(this.fitnessFunc));

      let newPopulationChromosomes = population.population.map(p => new PointChromosome(p.x, p.y));
      let newPopulation = new Population(newPopulationChromosomes, population.generationNo + 1);
      
      newPopulation.population = newPopulation.population.sort((a,b) => this.fitnessFunc(b) - this.fitnessFunc(a));
      for(let i = this.noToRemain; i < newPopulation.population.length; i = i + 1) {
        let chromo = newPopulation.population[i];
        if(Math.random() < 0.5) {
          newPopulation.population[i] = this.createCrossOver(newPopulation);
          continue;
        }
        else{
        newPopulation.population[i] = this.converter.convertFromBits(
          this.toGenericChromosome(chromo).mutate(this.mutationRate).genes);
        }
      }
      population = newPopulation;
    }
  }

  private createCrossOver(newPopulation: Population<PointChromosome>) {
    const firstRandomTournamentWinner = newPopulation.getRandomMostFitFromTournament(this.fitnessFunc, 20);
    const secondRandomTournamentWinner = newPopulation.getRandomMostFitFromTournament(this.fitnessFunc, 20);
    const crossover = this.toGenericChromosome(firstRandomTournamentWinner)
      .crossover(this.toGenericChromosome(secondRandomTournamentWinner), this.crossoverRate);
    const crossoverChromo = this.converter.convertFromBits(crossover.genes);
    return crossoverChromo;
  }
}

function randomIntFromInterval(min: number, max:number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log(peak(new PointChromosome(20,-160)));
console.log(peak(new PointChromosome(-242,-58)));

let chromosomes = [];
for (let index = 0; index < 10; index++) {
  chromosomes[index] = new PointChromosome(randomIntFromInterval(-300,300), randomIntFromInterval(-300,300));
}
let population = new Population(chromosomes);

let geneticProc = new GeneticProcedure(population, 0.2, 0.3, 0.8, peak);
geneticProc.evolve(1000);