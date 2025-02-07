import { FabricObject } from "fabric";

type InsertType = "fresh" | "default" | "delete";

interface InsertValue {
  inType: InsertType;
  objs: FabricObject[];
}

class Stack<T> {
  private bin: T[] = [];

  // Inserts a value into the stack
  _insert(val: T): void {
    this.bin.push(val);
  }

  // Removes the top item from the stack
  _pushOut(): T | undefined {
    return this.bin.pop();
  }

  // Returns the current stack for debugging
  getStack(): T[] {
    return [...this.bin]; // Return a shallow copy to avoid direct modification
  }
}

class Undo extends Stack<InsertValue> {
  constructor() {
    super();
  }

  // Insert a new value into the undo stack
  insertObj(insertVal: InsertValue): void {
    this._insert(insertVal);
  }
}

class Redo extends Stack<InsertValue> {
  constructor() {
    super();
  }

  // Insert a new value into the redo stack
  insertObj(insertVal: InsertValue): void {
    this._insert(insertVal);
  }

  // Pop the most recent object from the redo stack
  popObj(): InsertValue | null {
    const o = this._pushOut();
    return o ?? null;
  }
}

export { Undo, Redo };
