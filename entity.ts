// Types
export type Entity = number;

// Constants
export const MaxEntites: Entity = 32;

// Managers
export class EntityManager {
  private readonly pool: Entity[] = [];
  constructor() {
    for (let i = 0; i < MaxEntites; i++) {
      this.pool.push(i);
    }
  }
  createEntity(): Entity {
    if (!this.pool.length) throw new Error('Maximum entities exceeded');
    return this.pool.shift();
  }
  each(callback: (entity: Entity) => void) {
    for (let i: Entity = 0; i < MaxEntites; i++) {
      if (this.pool.includes(i)) return;
      callback(i);
    }
  }
}
