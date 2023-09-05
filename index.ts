import { ComponentManager } from './component';
import { Entity, EntityManager } from './entity';
import { System } from './system';

// Runtime
console.clear();

// create managers
const entityManager = new EntityManager();
const componentManager = new ComponentManager();

// register new component type
class MovementComponent {
  speed: number;
  constructor(speed: number) {
    this.speed = speed;
  }
}
componentManager.registerComponent(MovementComponent);

// create system that will work with that component (or combination of components)
class MovementSystem extends System {
  constructor() {
    super(entityManager, componentManager);
    this.addComponent(componentManager.getComponentType(MovementComponent));
  }
  protected processEntity(entity: Entity) {
    const movement = this.componentManager.getComponent(
      entity,
      MovementComponent
    );
    movement.speed += 5;
    console.log(`processing ${entity} - new speed is ${movement.speed}`);
  }
}
const movementSystem = new MovementSystem();

// create player and movement component for player
const player = entityManager.createEntity();
const playerMovementComponent = new MovementComponent(25);

// add component to player
// notice that if you remove the component, entity is no longer processed by the system because the required component is missing
componentManager.addComponent(player, playerMovementComponent);

// game loop
setInterval(() => {
  // this is messy, ideally there would be system manager that keeps track of signatures for systems and does this orchestration but.. i was lazy
  movementSystem.processFrame();
}, 1000);
