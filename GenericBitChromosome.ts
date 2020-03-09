export class GenericBitChromosome implements IChromosome<GenericBitChromosome> {
  public genes: number[];
  constructor(inputGenes: number[]) {
    this.genes = inputGenes;
  }
  public crossover(other: GenericBitChromosome, uniformRate: number) {
    const newGenes: number[] = [];
    for (let i = 0; i < this.genes.length; i++) {
      const gene = Math.random() < uniformRate ? this.genes[i] : other.genes[i];
      newGenes[i] = gene;
    }
    return new GenericBitChromosome(newGenes);
  }
  public mutate(probability: number) {
    const newGenes: number[] = [];
    for (let i = 0; i < this.genes.length; i++) {
      let gene = this.genes[i];
      if (Math.random() < probability) {
        gene = gene === 1 ? 0 : 1;
      }
      newGenes[i] = gene;
    }
    return new GenericBitChromosome(newGenes);
  }
}
