import { ComponentManager, ComponentType } from './component';
import { Entity, EntityManager } from './entity';
import { switchBit } from './utils';

export abstract class System {
  protected entityManager: EntityManager;
  protected componentManager: ComponentManager;
  protected signature: number = 0;
  constructor(
    entityManager: EntityManager,
    componentManager: ComponentManager
  ) {
    this.entityManager = entityManager;
    this.componentManager = componentManager;
  }
  processFrame() {
    this.entityManager.each((entity: Entity) => {
      if (this.componentManager.hasSignature(entity, this.signature)) {
        this.processEntity(entity);
      }
    });
  }
  protected abstract processEntity(entity: Entity): void;
  protected addComponent(component: ComponentType) {
    this.signature = switchBit(this.signature, component, 1);
  }
}
