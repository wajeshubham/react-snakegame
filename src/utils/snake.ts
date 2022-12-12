import { CellInterface } from "../interfaces";

export class Snake {
  constructor(public head: CellInterface, public next: CellInterface | null) {}
}
