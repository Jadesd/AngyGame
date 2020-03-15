// - Initialisation --------------------------

// des modules de Matterjs qu'on importe
let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Mouse = Matter.Mouse,
  Constraint = Matter.Constraint,
  Events = Matter.Events,
  MouseConstraint = Matter.MouseConstraint;

let elastic, bird, anchor;

let engine = Engine.create();

let world = engine.world;

let render = Render.create({
  element: game,
  engine: engine,
  options: {
    width: 800,
    height: 500,
    wireframes: false
  }
});

// 2 - Ajouter les boites --------------------
// .. votre code ici

//faire apparaître un block

function spawnBlock() {
  let x = randomNumberBetween(150, 780);
  let y = randomNumberBetween(0, 100);
  let randomWidth = randomNumberBetween(25, 100);
  let randomHeight = randomNumberBetween(25, 100);
  let boxA = Bodies.rectangle(x, y, randomWidth, randomHeight);
  World.add(engine.world, [boxA]);
}

var randomNumberBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// -------------------------------------------

// le sol
let ground = Bodies.rectangle(500, 490, 1000, 20, {
  isStatic: true
});

let ground2 = Bodies.rectangle(700, 250, 200, 40, {
  isStatic: true
});

// le fond
let background = Bodies.rectangle(400, 250, 800, 500, {
  isStatic: true,
  isSensor: true,
  render: {
    sprite: {
      texture: "img/storm.jpg"
    }
  }
});

// on ajoute tous les blocs au monde
World.add(engine.world, [background, ground, ground2]);

// 3 - L'oiseau ------------------------------

// une fonction faire apparaître un oiseau
function addBird() {
  // l'endroit d'où on tire l'oiseau
  anchor = { x: 100, y: 100 };

  // l'affichage de l'oiseau
  bird = Bodies.circle(100, 100, 25, {
    render: {
      sprite: {
        texture: "img/Fireball.png"
      }
    }
  });

  // l'effet "lance-pierre"
  elastic = Constraint.create({
    pointA: anchor,
    bodyB: bird,
    stiffness: 0.05,
    render: {
      visible: false
    }
  });

  World.add(world, [bird, elastic]);
}

// -------------------------------------------

// interaction avec la souris
let mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});

// très similaire à addEventListener
Events.on(mouseConstraint, "enddrag", fly);

// la fonction qui fait voler l'oiseau
function fly(event) {
  if (event.body != bird) return;

  setTimeout(function() {
    elastic.bodyB = null;
    addBird();
  }, 20);
}

World.add(world, mouseConstraint);

render.mouse = mouse;

// lance la scène
Engine.run(engine);
Render.run(render);

//faire apparaître l'oiseau
addBird();
