export class PopulationStats<T>{
  constructor(
        public populationNo: number,
        public maxScore: number,
        public avgScore: number,
        public bestSpecimen: T) {}
}
