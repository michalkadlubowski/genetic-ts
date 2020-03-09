import { PointChromosome } from './PointChromosome';
import { GeneticProcedure } from './GeneticProcedure';
import { Population } from './Population';

function peakFunction(chromosome: PointChromosome) {
  const x = chromosome.x / 100;
  const y = chromosome.y / 100;

  // as for now constraints like this
  if(x > 3 || y > 3 || x < -3 || y < -3) {
    return 0;
  }

  const result = 3 * Math.pow((1 - x), 2) * Math.exp(-(Math.pow(x, 2)) - Math.pow((y + 1), 2))
  - 10 * (x / 5 - Math.pow(x, 3) - Math.pow(y, 5)) * Math.exp(-Math.pow(x, 2)
  - Math.pow(y, 2)) - 1 / 3 * Math.exp(-Math.pow((x + 1), 2) - Math.pow(y, 2));
  return result * -1;
}

function randomIntFromInterval(min: number, max:number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log(peakFunction(new PointChromosome(20, -160)));
console.log(peakFunction(new PointChromosome(-242, -58)));

let chromosomes = [];
for (let index = 0; index < 10; index++) {
  const x = randomIntFromInterval(-300, 300);
  const y = randomIntFromInterval(-300, 300);
  chromosomes[index] = new PointChromosome(x, y);
}
let population = new Population(chromosomes);

let geneticProc = new GeneticProcedure(population, 0.2, 0.3, 0.8, peakFunction);
geneticProc.evolve(1000);