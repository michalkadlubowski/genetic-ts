import { PointChromosome } from "./PointChromosome";

export class BitChromosomeConverter {
  private maxBitsPerProperty = 9;
  private getIntFromBitArray(input: number[]) {
    let result = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === 1) {
        result += Math.pow(2, input.length - i - 1);
      }
    }
    return result;
  }
  public convertFromBits(input: number[]) {
    const firstNumBits = input.slice(1, this.maxBitsPerProperty);
    const firstSign = input[0] == 1 ? 1 : -1;
    const firstNum = firstSign * this.getIntFromBitArray(firstNumBits);
    const secondNumBits = input.slice(this.maxBitsPerProperty + 1, this.maxBitsPerProperty * 2);
    const secongSign = input[this.maxBitsPerProperty] === 1 ? 1 : -1;
    const secondNum = secongSign * this.getIntFromBitArray(secondNumBits);
    return new PointChromosome(firstNum, secondNum);
  }
  public convertToBits(input: PointChromosome) {
    const bits: number[] = [];
    let firstBits = Math.abs(input.x).toString(2);
    let firstBitsSign = input.x >= 0 ? '1' : '0';
    let secondBitsSign = input.y >= 0 ? '1' : '0';
    let secondBits = Math.abs(input.y).toString(2);
    while (firstBits.length < this.maxBitsPerProperty - 1) {
      firstBits = `0${firstBits}`;
    }
    while (secondBits.length < this.maxBitsPerProperty - 1) {
      secondBits = `0${secondBits}`;
    }
    const allBits = firstBitsSign + firstBits + secondBitsSign + secondBits;
    for (let x = 0; x < allBits.length; x++) {
      const c = allBits.charAt(x);
      bits[x] = +c;
    }
    return bits;
  }
}
