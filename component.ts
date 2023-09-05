import { Entity, MaxEntites } from './entity';
import { switchBit } from './utils';

type Constructor<T> = new (...args: any[]) => T;

type Component = {};
export type ComponentType = number;
export const MaxComponents: ComponentType = 16;

class ComponentArray<TComponent> {
  private componentsPerEntities: TComponent[] = [];
  constructor() {
    for (let i = 0; i < MaxEntites; i++) {
      this.componentsPerEntities[i] = null;
    }
  }
  add(entity: Entity, component: TComponent) {
    this.componentsPerEntities[entity] = component;
  }
  get(entity: Entity): TComponent {
    return this.componentsPerEntities[entity];
  }
}

export class ComponentManager {
  private signatures: Map<Entity, number> = new Map();
  private ids: { [key: string]: number } = {};
  private arrays: ComponentArray<Component>[] = [];
  private pool: ComponentType[] = [];
  constructor() {
    for (let i = 0; i < MaxComponents; i++) {
      this.pool.push(i);
    }
  }
  getComponentType<TComponent>(component: Constructor<TComponent>) {
    const componentName = this.getComponentName(component);
    if (this.ids[componentName] === undefined)
      throw new Error(`Component '${componentName}' not registered`);
    return this.ids[componentName];
  }
  getComponent<TComponent>(
    entity: Entity,
    component: Constructor<TComponent>
  ): TComponent {
    const componentName = this.getComponentName(component);
    if (this.ids[componentName] === undefined)
      throw new Error(`Component '${componentName}' not registered`);
    const componentId = this.ids[componentName];
    return this.arrays[componentId].get(entity) as TComponent;
  }
  addComponent<TComponent>(entity: Entity, component: TComponent) {
    const componentName = component.constructor.name;
    if (this.ids[componentName] === undefined)
      throw new Error(`Component '${componentName}' not registered`);
    const componentId = this.ids[componentName];
    // get component array and register component
    const array = this.arrays[componentId];
    array.add(entity, component);
    // update entity signature
    if (!this.signatures.has(entity)) {
      this.signatures.set(entity, 0);
    }
    this.signatures.set(
      entity,
      switchBit(this.signatures.get(entity), componentId, 1)
    );
  }
  hasSignature(entity: Entity, signature: number): boolean {
    return (this.signatures.get(entity) ?? 0) === signature;
  }
  registerComponent<TComponent>(t: Constructor<TComponent>) {
    if (!this.pool.length)
      throw new Error('Maximum amount of components exceeded');

    const componentName = this.getComponentName(t);
    if (this.ids[componentName] !== undefined)
      throw new Error(`Component '${componentName}' already registered`);

    // get componentId and register it in map
    const componentId = this.pool.shift();
    this.ids[componentName] = componentId;

    // create new component array
    this.arrays[componentId] = new ComponentArray<TComponent>();
  }
  private getComponentName<TComponent>(t: Constructor<TComponent>): string {
    return t.name;
  }
}
