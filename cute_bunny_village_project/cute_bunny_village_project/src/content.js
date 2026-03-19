(() => {
  function seededValue(seed) {
    const x = Math.sin(seed * 97.13) * 10000;
    return x - Math.floor(x);
  }

  function seededShuffle(items, seed) {
    const list = items.slice();
    for (let index = list.length - 1; index > 0; index -= 1) {
      const pick = Math.floor(seededValue(seed + index * 17) * (index + 1));
      [list[index], list[pick]] = [list[pick], list[index]];
    }
    return list;
  }

  function makeNumberChoices(answer, seed) {
    const choices = new Set([answer]);
    const offsets = [1, 2, 3, 4, 5, 10];
    let cursor = 0;
    while (choices.size < 4) {
      const diff = offsets[(seed + cursor) % offsets.length];
      const candidate = answer + (cursor % 2 === 0 ? diff : -diff);
      if (candidate > 0) choices.add(candidate);
      cursor += 1;
    }
    return seededShuffle([...choices].map(String), seed);
  }

  function mathQuestion(id, prompt, answer, seed, hint, celebrate) {
    const choices = makeNumberChoices(answer, seed);
    return {
      id,
      kind: 'math',
      prompt,
      choices,
      answer: choices.indexOf(String(answer)),
      hint,
      celebrate: celebrate || 'That answer powers another lantern spark.'
    };
  }

  function readingQuestion(id, passage, prompt, choices, answer, hint, celebrate) {
    return {
      id,
      kind: 'reading',
      passageTitle: passage.title,
      passageLines: passage.lines,
      prompt,
      choices,
      answer,
      hint,
      celebrate: celebrate || 'Great noticing. You used the story clues well.'
    };
  }

  const readingPassages = {
    pondPicnic: {
      title: 'Pond Picnic',
      lines: [
        'Mia packed cheese sandwiches and a red cup.',
        'She sat under the biggest tree near the pond.',
        'A duck splashed water on her shoes before lunch.'
      ],
      questions: [
        ['What colour was Mia\'s cup?', ['Red', 'Blue', 'Green', 'Yellow'], 0, 'Look at the first sentence.'],
        ['Where did Mia sit?', ['Under the biggest tree', 'On the bridge', 'Inside the shop', 'Next to the bus'], 0, 'The second sentence tells where she sat.']
      ]
    },
    kiteHill: {
      title: 'Kite Hill',
      lines: [
        'Noah and Ava walked up Kite Hill after school.',
        'Their blue kite flew high because the wind was strong.',
        'When the wind slowed down, they rolled up the string and went home.'
      ],
      questions: [
        ['Why did the kite fly high?', ['The wind was strong', 'The hill was tiny', 'The string was red', 'It was night time'], 0, 'The reason is in the second sentence.'],
        ['What did Noah and Ava do when the wind slowed down?', ['Rolled up the string and went home', 'Went swimming', 'Bought a sandwich', 'Built a snowman'], 0, 'Check the last sentence.']
      ]
    },
    libraryClub: {
      title: 'Library Club',
      lines: [
        'Jade visited the library club every Tuesday.',
        'She borrowed a book about rainforests and read it on a yellow beanbag.',
        'Before she left, Jade put the book back on the return trolley.'
      ],
      questions: [
        ['Which day did Jade visit the club?', ['Tuesday', 'Friday', 'Sunday', 'Monday'], 0, 'The first sentence names the day.'],
        ['Where did Jade put the book before leaving?', ['On the return trolley', 'Under the beanbag', 'In her lunchbox', 'By the river'], 0, 'The last sentence explains this.']
      ]
    },
    farmMorning: {
      title: 'Farm Morning',
      lines: [
        'At sunrise, Ben fed the chickens with a silver scoop.',
        'Then he filled the goat\'s water bucket beside the red gate.',
        'After breakfast, Ben picked three pumpkins with Grandma June.'
      ],
      questions: [
        ['What did Ben use to feed the chickens?', ['A silver scoop', 'A wooden spoon', 'A blue plate', 'A paper bag'], 0, 'Look at the first sentence.'],
        ['Who helped Ben pick pumpkins?', ['Grandma June', 'The librarian', 'Ava', 'The bus driver'], 0, 'The helper is named in the last sentence.']
      ]
    },
    rainyParade: {
      title: 'Rainy Parade',
      lines: [
        'The school parade started just as light rain began to fall.',
        'Luca opened a striped umbrella and held it over the drum.',
        'The band kept marching until the clouds drifted away.'
      ],
      questions: [
        ['Why did Luca open the umbrella?', ['To cover the drum', 'To hide his shoes', 'To carry apples', 'To wave at the mayor'], 0, 'The second sentence gives the reason.'],
        ['When did the band stop needing the umbrella?', ['When the clouds drifted away', 'Before the parade started', 'At breakfast', 'After bedtime'], 0, 'The answer is in the last sentence.']
      ]
    },
    busStop: {
      title: 'Bus Stop',
      lines: [
        'Ella waited at the bus stop with her green backpack.',
        'She counted seven magpies on the fence while the bus was late.',
        'When the bus arrived, she sat beside her friend Omar.'
      ],
      questions: [
        ['What colour was Ella\'s backpack?', ['Green', 'Red', 'Orange', 'Purple'], 0, 'The first sentence says it clearly.'],
        ['Who sat beside Ella on the bus?', ['Omar', 'The mayor', 'A duck', 'Grandma June'], 0, 'The final sentence names the friend.']
      ]
    },
    gardenHelpers: {
      title: 'Garden Helpers',
      lines: [
        'Priya planted bean seeds in four neat rows.',
        'Her brother carried a yellow watering can from the shed.',
        'By sunset, tiny labels marked every row in the garden.'
      ],
      questions: [
        ['What did Priya plant?', ['Bean seeds', 'Books', 'Kites', 'Crayons'], 0, 'The first sentence tells what she planted.'],
        ['What colour was the watering can?', ['Yellow', 'Blue', 'Brown', 'Pink'], 0, 'The second sentence gives the colour.']
      ]
    },
    moonCamp: {
      title: 'Moon Camp',
      lines: [
        'At moon camp, the children built a fire circle with smooth stones.',
        'Nina read the map while Theo carried the lantern.',
        'They sang one song before crawling into their tents.'
      ],
      questions: [
        ['Who carried the lantern?', ['Theo', 'Nina', 'Omar', 'Luca'], 0, 'The second sentence answers this.'],
        ['What did the children build with smooth stones?', ['A fire circle', 'A bridge', 'A book shelf', 'A snow cave'], 0, 'Look back to the first sentence.']
      ]
    },
    lanternTrain: {
      title: 'Lantern Train',
      lines: [
        'The lantern train delivered books to each village after dark.',
        'Engineer Sol checked the brass wheels and polished the front light.',
        'When the whistle blew, everyone waved from the platform.'
      ],
      questions: [
        ['What did Engineer Sol polish?', ['The front light', 'A pair of boots', 'The ticket bag', 'The school desk'], 0, 'The second sentence says what Sol polished.'],
        ['When did people wave from the platform?', ['When the whistle blew', 'At sunrise', 'Before dinner', 'During lunch'], 0, 'The answer is in the last sentence.']
      ]
    },
    festivalBand: {
      title: 'Festival Band',
      lines: [
        'The festival band practised beside the fountain every afternoon.',
        'Mara played the trumpet while Kai shook a silver tambourine.',
        'They smiled when the mayor gave them star-shaped biscuits.'
      ],
      questions: [
        ['Which instrument did Kai play?', ['A silver tambourine', 'A trumpet', 'A piano', 'A guitar'], 0, 'The second sentence tells this.'],
        ['What shape were the biscuits?', ['Star-shaped', 'Square', 'Round', 'Triangle'], 0, 'The last sentence describes them.']
      ]
    },
    riverBridge: {
      title: 'River Bridge',
      lines: [
        'Sana stopped on the river bridge to watch three ducks below.',
        'She wrote the number in her notebook before crossing to the bakery.',
        'At the bakery, Sana bought one warm roll for her dad.'
      ],
      questions: [
        ['How many ducks did Sana watch?', ['Three', 'One', 'Five', 'Seven'], 0, 'The number is in the first sentence.'],
        ['What did Sana buy at the bakery?', ['One warm roll', 'A kite', 'A lantern', 'A storybook'], 0, 'Read the last sentence carefully.']
      ]
    },
    observatoryNight: {
      title: 'Observatory Night',
      lines: [
        'The class climbed the observatory steps after sunset.',
        'Mr. Glow pointed the telescope toward a bright planet in the east.',
        'Each child drew the planet in a notebook with silver stars on the cover.'
      ],
      questions: [
        ['What did Mr. Glow point toward?', ['A bright planet', 'A red bus', 'A tall tree', 'A kite'], 0, 'The second sentence names it.'],
        ['Where did the class draw the planet?', ['In a notebook', 'On the bridge', 'On the telescope', 'Inside a lunchbox'], 0, 'The final sentence explains where they drew it.']
      ]
    }
  };

  function passageQuestions(ids) {
    return ids.flatMap((id, passageIndex) => {
      const passage = readingPassages[id];
      return passage.questions.map((question, questionIndex) => readingQuestion(
        `${id}-${questionIndex}`,
        passage,
        question[0],
        question[1],
        question[2],
        question[3],
        'Wonderful reading. You spotted the important detail.'
      ));
    });
  }

  function additionQuest() {
    const pairs = [
      [7, 5], [9, 6], [11, 4], [8, 7], [13, 5],
      [14, 3], [6, 8], [12, 6], [15, 4], [10, 9]
    ];
    const prompts = [
      ({ a, b }) => `Lily bunny packed ${a} crayons and found ${b} more. How many crayons does she have now?`,
      ({ a, b }) => `There are ${a} apples in a basket and ${b} more are added. How many apples are there altogether?`,
      ({ a, b }) => `A class read ${a} pages in the morning and ${b} pages after lunch. How many pages did they read?`,
      ({ a, b }) => `${a} ducklings were swimming and ${b} ducklings joined them. How many ducklings are in the pond now?`,
      ({ a, b }) => `A toy train has ${a} blue blocks and ${b} red blocks. How many blocks are on the train?`
    ];
    return {
      id: 'academy-pack',
      title: 'Sun Stamp Lesson',
      kicker: 'Redleaf Academy',
      reward: 'Sun Stamp',
      intro: [
        'Ms. Maple smiles. "Let\'s warm up the first lantern by adding numbers carefully."',
        'Answer all ten questions to earn the Sun Stamp.'
      ],
      outro: [
        'Ms. Maple taps a bright gold stamp into your journal.',
        '"Take this Sun Stamp to Ranger Reed on Sunny Route. He loves careful counting too."'
      ],
      questions: pairs.map(([a, b], index) => mathQuestion(
        `academy-${index}`,
        prompts[index % prompts.length]({ a, b }),
        a + b,
        index + 1,
        'Count on from the bigger number to find the total.',
        'Great adding. The classroom lantern glows brighter.'
      ))
    };
  }

  function subtractionQuest() {
    const pairs = [
      [14, 5], [17, 8], [19, 6], [16, 7], [18, 9],
      [15, 4], [13, 5], [20, 8], [12, 3], [11, 6]
    ];
    const prompts = [
      ({ a, b }) => `Ranger Reed packed ${a} trail snacks and shared ${b}. How many snacks are left?`,
      ({ a, b }) => `There were ${a} pebbles on the bridge. ${b} pebbles rolled into the water. How many stayed on the bridge?`,
      ({ a, b }) => `A bus had ${a} children on it. ${b} children got off at the library. How many are still on the bus?`,
      ({ a, b }) => `The garden had ${a} flowers. ${b} flowers were picked for the festival. How many flowers are still growing?`
    ];
    return {
      id: 'route-pack',
      title: 'Trail Stamp Lesson',
      kicker: 'Sunny Route',
      reward: 'Trail Stamp',
      intro: [
        'Ranger Reed points at the stepping stones. "Subtraction helps us see what is left after sharing or using things."',
        'Finish ten careful subtraction problems to cross the bright bridge.'
      ],
      outro: [
        'Reed clips a trail stamp into your journal.',
        '"The library in River Town is waiting for sharp readers like you."'
      ],
      questions: pairs.map(([a, b], index) => mathQuestion(
        `route-${index}`,
        prompts[index % prompts.length]({ a, b }),
        a - b,
        30 + index,
        'Start with the bigger number and count backward.'
      ))
    };
  }

  function multiplicationQuest() {
    const sets = [
      [2, 4], [3, 5], [4, 3], [5, 2], [2, 6],
      [3, 4], [5, 3], [4, 4], [2, 7], [5, 4]
    ];
    const prompts = [
      ({ groups, size }) => `Merchant Milo packs ${groups} baskets with ${size} pears in each basket. How many pears are there altogether?`,
      ({ groups, size }) => `There are ${groups} tables with ${size} muffins on each table. How many muffins are ready to sell?`,
      ({ groups, size }) => `${groups} rows of lanterns have ${size} lanterns in each row. How many lanterns are hanging?`,
      ({ groups, size }) => `A farmer plants ${groups} rows with ${size} seeds in each row. How many seeds were planted?`
    ];
    return {
      id: 'market-pack',
      title: 'Market Stamp Lesson',
      kicker: 'Market Meadow',
      reward: 'Market Stamp',
      intro: [
        'Merchant Milo says, "Groups make counting faster. Let\'s multiply by thinking about equal rows and baskets."',
        'Solve ten group problems to earn the Market Stamp.'
      ],
      outro: [
        'Milo hands over a stamp shaped like a market awning.',
        '"Gardener Fern can use your clever thinking in the greenhouse path."'
      ],
      questions: sets.map(([groups, size], index) => mathQuestion(
        `market-${index}`,
        prompts[index % prompts.length]({ groups, size }),
        groups * size,
        70 + index,
        'Think of multiplication as equal groups added together.',
        'Excellent grouping. The market stalls sparkle.'
      ))
    };
  }

  function mixedGardenQuest() {
    const raw = [
      mathQuestion('garden-0', 'Fern plants 8 carrot seeds in one row and 6 in another. How many seeds did Fern plant?', 14, 101, 'Add the two rows together.'),
      mathQuestion('garden-1', 'There were 15 tomatoes. 4 were picked for soup. How many tomatoes are left?', 11, 102, 'Count back 4 from 15.'),
      mathQuestion('garden-2', 'Three trays hold 4 seedlings each. How many seedlings are there?', 12, 103, 'Add 4 + 4 + 4.'),
      mathQuestion('garden-3', 'A watering team fills 9 cans in the morning and 5 more later. How many cans are filled?', 14, 104, 'Put both groups together.'),
      mathQuestion('garden-4', 'A row had 13 sunflowers. 6 were tied with ribbons. How many were not tied yet?', 7, 105, 'Subtract 6 from 13.'),
      mathQuestion('garden-5', 'Four pots have 3 bean plants in each pot. How many bean plants are there?', 12, 106, 'Count the equal groups.'),
      ...passageQuestions(['gardenHelpers', 'farmMorning']).slice(0, 4)
    ];
    return {
      id: 'garden-pack',
      title: 'Garden Stamp Lesson',
      kicker: 'Greenhouse Path',
      reward: 'Garden Stamp',
      intro: [
        'Gardener Fern waves you closer. "Real gardeners use adding, taking away, grouping, and reading signs all day long."',
        'Complete the mixed greenhouse challenge to earn the Garden Stamp.'
      ],
      outro: [
        'Fern presses a leafy stamp into your journal.',
        '"The woods owl loves story clues. Follow the lantern path east."'
      ],
      questions: raw
    };
  }

  function workshopQuest() {
    const questions = [
      mathQuestion('workshop-0', 'Nova needs 12 brass screws. She already has 7. How many more screws does she need?', 5, 130, 'Think about the missing part from 7 up to 12.'),
      mathQuestion('workshop-1', 'Two lantern cars each need 6 windows. How many windows are needed?', 12, 131, 'This is 2 groups of 6.'),
      mathQuestion('workshop-2', 'A tool box held 18 cogs. Nova used 9 cogs. How many cogs are left?', 9, 132, 'Take away 9 from 18.'),
      mathQuestion('workshop-3', 'There are 4 signal poles with 5 lights on each pole. How many lights are there?', 20, 133, 'Multiply 4 by 5.'),
      mathQuestion('workshop-4', 'Pip carries 6 copper rings and then finds 8 more. How many rings does Pip carry?', 14, 134, 'Add the two amounts.'),
      mathQuestion('workshop-5', 'A crate had 16 tickets. 7 tickets were handed out. How many tickets stay in the crate?', 9, 135, 'Count backwards from 16.'),
      mathQuestion('workshop-6', 'Five shelves hold 2 lantern jars on each shelf. How many jars are there?', 10, 136, 'Think of 5 groups of 2.'),
      mathQuestion('workshop-7', 'The train team painted 11 stars in the morning and 7 more at night. How many stars were painted?', 18, 137, 'Put the two parts together.'),
      ...passageQuestions(['moonCamp', 'lanternTrain']).slice(0, 4)
    ];
    return {
      id: 'workshop-pack',
      title: 'Gear Stamp Lesson',
      kicker: 'Moonrise Workshop',
      reward: 'Gear Stamp',
      intro: [
        'Inventor Nova lifts a blueprint. "If we repair the lantern train, the festival can reach every village."',
        'Finish this mixed workshop challenge to earn the Gear Stamp.'
      ],
      outro: [
        'Nova stamps your journal with a silver gear.',
        '"Now climb to Star Summit. Headmaster Glow is waiting for the final test."'
      ],
      questions
    };
  }

  function observatoryQuest() {
    const questions = [
      mathQuestion('observatory-0', 'The observatory has 9 moon charts and receives 8 more. How many charts are there now?', 17, 160, 'Add the new charts to the old charts.'),
      mathQuestion('observatory-1', 'A star board shows 15 stars. 6 fade behind clouds. How many stars can you still see?', 9, 161, 'Subtract the hidden stars.'),
      mathQuestion('observatory-2', 'Three telescopes each have 4 silver knobs. How many knobs are there altogether?', 12, 162, 'Count 3 groups of 4.'),
      mathQuestion('observatory-3', 'Mr. Glow gives 13 notebooks to the class and 5 more arrive. How many notebooks are there?', 18, 163, 'Add the two parts.'),
      mathQuestion('observatory-4', 'The class had 20 glow beads. 7 were used for one lantern. How many beads are left?', 13, 164, 'Take away 7 from 20.'),
      mathQuestion('observatory-5', 'Four shelves each hold 5 star maps. How many star maps are there?', 20, 165, 'Multiply 4 by 5.'),
      mathQuestion('observatory-6', 'A comet trail shows 10 bright dots and 6 dim dots. How many dots are on the trail?', 16, 166, 'Add bright and dim dots together.'),
      mathQuestion('observatory-7', 'The mayor baked 14 biscuits. 8 were already shared. How many biscuits remain?', 6, 167, 'Subtract the shared biscuits.'),
      ...passageQuestions(['festivalBand', 'observatoryNight', 'rainyParade']).slice(0, 6)
    ];
    return {
      id: 'observatory-pack',
      title: 'Star Stamp Final',
      kicker: 'Star Observatory',
      reward: 'Star Stamp',
      intro: [
        'Headmaster Glow folds his hands. "This final stamp checks everything: adding, subtracting, grouping, and reading for meaning."',
        'Complete the observatory challenge to light the Great Reading Lantern.'
      ],
      outro: [
        'Headmaster Glow places the shining Star Stamp beside your other rewards.',
        '"Return to Mayor Clover outside. The festival is ready because of you."'
      ],
      questions
    };
  }

  function practicePack(id, title, reward, questions, intro, outro) {
    return { id, title, reward, questions, intro, outro, kicker: 'Friendly Practice' };
  }

  function makeGrid(width, height, fill) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
  }

  function fillRect(grid, x, y, width, height, value) {
    for (let yy = y; yy < y + height; yy += 1) {
      for (let xx = x; xx < x + width; xx += 1) {
        if (grid[yy] && grid[yy][xx] !== undefined) grid[yy][xx] = value;
      }
    }
  }

  function lineH(grid, y, x1, x2, value) {
    for (let xx = x1; xx <= x2; xx += 1) {
      if (grid[y] && grid[y][xx] !== undefined) grid[y][xx] = value;
    }
  }

  function lineV(grid, x, y1, y2, value) {
    for (let yy = y1; yy <= y2; yy += 1) {
      if (grid[yy] && grid[yy][x] !== undefined) grid[yy][x] = value;
    }
  }

  function addTrees(list, x, y, width, height) {
    for (let yy = y; yy < y + height; yy += 2) {
      for (let xx = x; xx < x + width; xx += 2) {
        list.push({ type: 'tree', x: xx, y: yy, solid: true });
      }
    }
  }

  function addFlowers(list, x, y, width, height) {
    for (let yy = y; yy < y + height; yy += 1) {
      for (let xx = x; xx < x + width; xx += 2) {
        list.push({ type: 'flowers', x: xx, y: yy });
      }
    }
  }

  function addFence(list, x, y, width, horizontal) {
    for (let step = 0; step < width; step += 1) {
      list.push({ type: 'fence', x: horizontal ? x + step : x, y: horizontal ? y : y + step, solid: true });
    }
  }

  function addShelves(list, x, y, width) {
    for (let step = 0; step < width; step += 1) {
      list.push({ type: 'shelf', x: x + step, y, solid: true });
    }
  }

  function createMaps() {
    const maps = {};

    const redbudTown = {
      id: 'redbudTown',
      name: 'Redbud Town',
      width: 36,
      height: 24,
      theme: 'town',
      tiles: makeGrid(36, 24, 'grass'),
      decorations: [],
      buildings: [
        { id: 'home-redbud', sprite: 'home', x: 4, y: 4, w: 3, h: 3 },
        { id: 'academy-redbud', sprite: 'academy', x: 13, y: 3, w: 4, h: 3, door: { x: 15, y: 5, targetMap: 'academyRoom', targetX: 10, targetY: 13 } },
        { id: 'market-redbud', sprite: 'market', x: 25, y: 4, w: 4, h: 3 }
      ],
      warps: [{ x: 35, y: 17, w: 1, h: 2, targetMap: 'sunnyRoute', targetX: 1, targetY: 12, label: 'Sunny Route' }],
      signs: [
        { x: 12, y: 6, text: 'Redleaf Academy: Add your ideas and your numbers.' },
        { x: 17, y: 20, text: 'Redbud Town: Start here, then follow the lantern roads.' }
      ],
      start: { x: 17, y: 19 }
    };
    lineH(redbudTown.tiles, 18, 0, 35, 'path');
    lineH(redbudTown.tiles, 17, 0, 35, 'path');
    lineV(redbudTown.tiles, 15, 5, 18, 'path');
    lineV(redbudTown.tiles, 6, 7, 18, 'path');
    lineV(redbudTown.tiles, 27, 7, 18, 'path');
    fillRect(redbudTown.tiles, 29, 14, 5, 4, 'water');
    fillRect(redbudTown.tiles, 14, 6, 3, 2, 'path');
    addTrees(redbudTown.decorations, 0, 0, 36, 2);
    addTrees(redbudTown.decorations, 0, 22, 36, 2);
    addTrees(redbudTown.decorations, 0, 2, 2, 20);
    addTrees(redbudTown.decorations, 34, 2, 2, 20);
    addFlowers(redbudTown.decorations, 2, 20, 4, 2);
    addFlowers(redbudTown.decorations, 22, 10, 4, 2);
    redbudTown.decorations.push({ type: 'lamp', x: 10, y: 17 }, { type: 'lamp', x: 20, y: 17 });
    maps.redbudTown = redbudTown;

    const academyRoom = {
      id: 'academyRoom',
      name: 'Redleaf Academy',
      width: 20,
      height: 16,
      theme: 'indoor',
      tiles: makeGrid(20, 16, 'floor'),
      decorations: [],
      buildings: [],
      warps: [{ x: 10, y: 14, w: 1, h: 1, targetMap: 'redbudTown', targetX: 15, targetY: 6, label: 'Redbud Town' }],
      signs: [{ x: 4, y: 2, text: 'Class Rule: Count carefully and take your time.' }],
      start: { x: 10, y: 13 }
    };
    fillRect(academyRoom.tiles, 0, 0, 20, 1, 'wall');
    fillRect(academyRoom.tiles, 0, 15, 20, 1, 'wall');
    fillRect(academyRoom.tiles, 0, 0, 1, 16, 'wall');
    fillRect(academyRoom.tiles, 19, 0, 1, 16, 'wall');
    fillRect(academyRoom.tiles, 7, 5, 6, 2, 'rug');
    addShelves(academyRoom.decorations, 2, 2, 5);
    addShelves(academyRoom.decorations, 13, 2, 5);
    academyRoom.decorations.push(
      { type: 'desk', x: 6, y: 9, solid: true },
      { type: 'desk', x: 9, y: 9, solid: true },
      { type: 'desk', x: 12, y: 9, solid: true },
      { type: 'banner', x: 9, y: 2 }
    );
    maps.academyRoom = academyRoom;

    const sunnyRoute = {
      id: 'sunnyRoute',
      name: 'Sunny Route',
      width: 40,
      height: 24,
      theme: 'route',
      tiles: makeGrid(40, 24, 'meadow'),
      decorations: [],
      buildings: [],
      warps: [
        { x: 0, y: 11, w: 1, h: 2, targetMap: 'redbudTown', targetX: 34, targetY: 18, label: 'Redbud Town' },
        { x: 39, y: 10, w: 1, h: 2, targetMap: 'riverTown', targetX: 1, targetY: 17, label: 'River Town' }
      ],
      signs: [
        { x: 4, y: 10, text: 'Sunny Route: Cross the bridge and follow the reading breeze.' },
        { x: 23, y: 12, text: 'Bridge Tip: Subtraction helps you see what is left.' }
      ],
      start: { x: 2, y: 12 }
    };
    lineH(sunnyRoute.tiles, 12, 0, 17, 'path');
    lineV(sunnyRoute.tiles, 18, 9, 14, 'path');
    lineH(sunnyRoute.tiles, 14, 18, 28, 'bridge');
    lineH(sunnyRoute.tiles, 15, 18, 28, 'bridge');
    lineH(sunnyRoute.tiles, 11, 28, 39, 'path');
    lineH(sunnyRoute.tiles, 12, 28, 39, 'path');
    fillRect(sunnyRoute.tiles, 16, 13, 15, 6, 'water');
    addTrees(sunnyRoute.decorations, 0, 0, 40, 2);
    addTrees(sunnyRoute.decorations, 0, 22, 40, 2);
    addFlowers(sunnyRoute.decorations, 6, 16, 5, 2);
    addFlowers(sunnyRoute.decorations, 30, 6, 4, 2);
    sunnyRoute.decorations.push({ type: 'lamp', x: 21, y: 13 }, { type: 'lamp', x: 25, y: 13 });
    maps.sunnyRoute = sunnyRoute;

    const riverTown = {
      id: 'riverTown',
      name: 'River Town',
      width: 36,
      height: 24,
      theme: 'town',
      tiles: makeGrid(36, 24, 'grass'),
      decorations: [],
      buildings: [
        { id: 'library-river', sprite: 'library', x: 14, y: 4, w: 4, h: 3, door: { x: 16, y: 6, targetMap: 'libraryRoom', targetX: 10, targetY: 13 } },
        { id: 'hall-river', sprite: 'hall', x: 4, y: 4, w: 4, h: 3 }
      ],
      warps: [
        { x: 0, y: 17, w: 1, h: 2, targetMap: 'sunnyRoute', targetX: 38, targetY: 11, label: 'Sunny Route' },
        { x: 35, y: 17, w: 1, h: 2, targetMap: 'marketMeadow', targetX: 1, targetY: 17, label: 'Market Meadow' }
      ],
      signs: [
        { x: 16, y: 7, text: 'River Library: Read closely. Answers hide in the story.' },
        { x: 24, y: 18, text: 'River Town: The market road lies to the east.' }
      ],
      start: { x: 2, y: 18 }
    };
    lineH(riverTown.tiles, 18, 0, 35, 'path');
    lineV(riverTown.tiles, 16, 7, 18, 'path');
    fillRect(riverTown.tiles, 0, 20, 36, 4, 'water');
    addTrees(riverTown.decorations, 0, 0, 36, 2);
    addTrees(riverTown.decorations, 0, 2, 2, 18);
    addTrees(riverTown.decorations, 34, 2, 2, 18);
    addFlowers(riverTown.decorations, 9, 12, 4, 2);
    riverTown.decorations.push({ type: 'lamp', x: 11, y: 17 }, { type: 'lamp', x: 21, y: 17 }, { type: 'fountain', x: 27, y: 17 });
    maps.riverTown = riverTown;

    const libraryRoom = {
      id: 'libraryRoom',
      name: 'River Library',
      width: 20,
      height: 16,
      theme: 'library',
      tiles: makeGrid(20, 16, 'floor'),
      decorations: [],
      buildings: [],
      warps: [{ x: 10, y: 14, w: 1, h: 1, targetMap: 'riverTown', targetX: 16, targetY: 7, label: 'River Town' }],
      signs: [{ x: 3, y: 2, text: 'Quiet Reading Zone: Find the clue in each sentence.' }],
      start: { x: 10, y: 13 }
    };
    fillRect(libraryRoom.tiles, 0, 0, 20, 1, 'wall');
    fillRect(libraryRoom.tiles, 0, 15, 20, 1, 'wall');
    fillRect(libraryRoom.tiles, 0, 0, 1, 16, 'wall');
    fillRect(libraryRoom.tiles, 19, 0, 1, 16, 'wall');
    fillRect(libraryRoom.tiles, 6, 5, 8, 3, 'rug');
    addShelves(libraryRoom.decorations, 2, 2, 5);
    addShelves(libraryRoom.decorations, 13, 2, 5);
    addShelves(libraryRoom.decorations, 2, 11, 4);
    addShelves(libraryRoom.decorations, 14, 11, 4);
    libraryRoom.decorations.push(
      { type: 'desk', x: 8, y: 10, solid: true },
      { type: 'desk', x: 11, y: 10, solid: true },
      { type: 'banner', x: 9, y: 2 }
    );
    maps.libraryRoom = libraryRoom;

    const marketMeadow = {
      id: 'marketMeadow',
      name: 'Market Meadow',
      width: 38,
      height: 24,
      theme: 'market',
      tiles: makeGrid(38, 24, 'grass'),
      decorations: [],
      buildings: [
        { id: 'market-main', sprite: 'market', x: 4, y: 4, w: 4, h: 3 },
        { id: 'greenhouse-main', sprite: 'greenhouse', x: 26, y: 4, w: 4, h: 3 }
      ],
      warps: [
        { x: 0, y: 17, w: 1, h: 2, targetMap: 'riverTown', targetX: 34, targetY: 18, label: 'River Town' },
        { x: 37, y: 16, w: 1, h: 2, targetMap: 'storybookWoods', targetX: 1, targetY: 15, label: 'Storybook Woods' }
      ],
      signs: [{ x: 18, y: 17, text: 'Market Meadow: Equal groups help busy traders count quickly.' }],
      start: { x: 2, y: 18 }
    };
    lineH(marketMeadow.tiles, 17, 0, 37, 'path');
    lineH(marketMeadow.tiles, 18, 0, 37, 'path');
    lineV(marketMeadow.tiles, 17, 6, 18, 'path');
    lineV(marketMeadow.tiles, 28, 6, 18, 'path');
    fillRect(marketMeadow.tiles, 14, 11, 10, 3, 'plaza');
    addTrees(marketMeadow.decorations, 0, 0, 38, 2);
    addTrees(marketMeadow.decorations, 0, 22, 38, 2);
    addFlowers(marketMeadow.decorations, 10, 6, 4, 2);
    addFlowers(marketMeadow.decorations, 30, 8, 4, 2);
    addFence(marketMeadow.decorations, 25, 11, 5, true);
    addFence(marketMeadow.decorations, 25, 14, 5, true);
    marketMeadow.decorations.push({ type: 'crate', x: 8, y: 14, solid: true }, { type: 'crate', x: 29, y: 14, solid: true });
    maps.marketMeadow = marketMeadow;

    const storybookWoods = {
      id: 'storybookWoods',
      name: 'Storybook Woods',
      width: 40,
      height: 24,
      theme: 'woods',
      tiles: makeGrid(40, 24, 'meadow'),
      decorations: [],
      buildings: [],
      warps: [
        { x: 0, y: 15, w: 1, h: 2, targetMap: 'marketMeadow', targetX: 36, targetY: 17, label: 'Market Meadow' },
        { x: 39, y: 10, w: 1, h: 2, targetMap: 'moonriseWorkshop', targetX: 1, targetY: 16, label: 'Moonrise Workshop' }
      ],
      signs: [
        { x: 16, y: 16, text: 'Storybook Woods: Read the sign, then follow the glowing trail.' },
        { x: 26, y: 11, text: 'Lantern Path: Keep your eyes on the clues, not just the pictures.' }
      ],
      start: { x: 2, y: 16 }
    };
    lineH(storybookWoods.tiles, 16, 0, 15, 'path');
    lineV(storybookWoods.tiles, 16, 11, 16, 'path');
    lineH(storybookWoods.tiles, 11, 16, 39, 'path');
    fillRect(storybookWoods.tiles, 7, 6, 5, 4, 'water');
    fillRect(storybookWoods.tiles, 28, 15, 6, 4, 'water');
    addTrees(storybookWoods.decorations, 0, 0, 40, 2);
    addTrees(storybookWoods.decorations, 0, 22, 40, 2);
    addTrees(storybookWoods.decorations, 2, 4, 6, 12);
    addTrees(storybookWoods.decorations, 32, 4, 6, 12);
    addFlowers(storybookWoods.decorations, 18, 18, 5, 2);
    storybookWoods.decorations.push({ type: 'lamp', x: 16, y: 15 }, { type: 'lamp', x: 22, y: 10 }, { type: 'lamp', x: 29, y: 10 });
    maps.storybookWoods = storybookWoods;

    const moonriseWorkshop = {
      id: 'moonriseWorkshop',
      name: 'Moonrise Workshop',
      width: 36,
      height: 24,
      theme: 'harbour',
      tiles: makeGrid(36, 24, 'grass'),
      decorations: [],
      buildings: [{ id: 'workshop-main', sprite: 'workshop', x: 13, y: 4, w: 4, h: 3 }],
      warps: [
        { x: 0, y: 16, w: 1, h: 2, targetMap: 'storybookWoods', targetX: 38, targetY: 11, label: 'Storybook Woods' },
        { x: 15, y: 0, w: 2, h: 1, targetMap: 'starSummit', targetX: 15, targetY: 20, label: 'Star Summit' }
      ],
      signs: [{ x: 14, y: 7, text: 'Moonrise Workshop: Build with care. Read the notes. Check the numbers.' }],
      start: { x: 2, y: 17 }
    };
    lineH(moonriseWorkshop.tiles, 17, 0, 35, 'path');
    lineV(moonriseWorkshop.tiles, 15, 0, 17, 'path');
    fillRect(moonriseWorkshop.tiles, 0, 19, 36, 5, 'water');
    fillRect(moonriseWorkshop.tiles, 10, 18, 16, 2, 'boardwalk');
    addTrees(moonriseWorkshop.decorations, 0, 0, 36, 2);
    addFlowers(moonriseWorkshop.decorations, 4, 12, 4, 2);
    moonriseWorkshop.decorations.push(
      { type: 'crate', x: 11, y: 16, solid: true },
      { type: 'crate', x: 20, y: 16, solid: true },
      { type: 'lamp', x: 13, y: 17 },
      { type: 'lamp', x: 22, y: 17 }
    );
    maps.moonriseWorkshop = moonriseWorkshop;

    const starSummit = {
      id: 'starSummit',
      name: 'Star Summit',
      width: 36,
      height: 24,
      theme: 'summit',
      tiles: makeGrid(36, 24, 'grass'),
      decorations: [],
      buildings: [
        { id: 'observatory-main', sprite: 'observatory', x: 13, y: 3, w: 4, h: 3, door: { x: 15, y: 5, targetMap: 'observatoryRoom', targetX: 11, targetY: 13 } },
        { id: 'hall-main', sprite: 'hall', x: 25, y: 4, w: 4, h: 3 },
        { id: 'cottage-main', sprite: 'home', x: 4, y: 4, w: 3, h: 3 }
      ],
      warps: [{ x: 15, y: 23, w: 2, h: 1, targetMap: 'moonriseWorkshop', targetX: 15, targetY: 1, label: 'Moonrise Workshop' }],
      signs: [{ x: 24, y: 8, text: 'Festival Hall: Come back after earning every learning stamp.' }],
      start: { x: 15, y: 20 }
    };
    lineH(starSummit.tiles, 18, 0, 35, 'path');
    lineV(starSummit.tiles, 15, 5, 18, 'path');
    lineV(starSummit.tiles, 27, 7, 18, 'path');
    fillRect(starSummit.tiles, 8, 11, 16, 4, 'plaza');
    addTrees(starSummit.decorations, 0, 0, 36, 2);
    addTrees(starSummit.decorations, 0, 22, 36, 2);
    addFlowers(starSummit.decorations, 8, 6, 3, 2);
    addFlowers(starSummit.decorations, 20, 9, 3, 2);
    starSummit.decorations.push({ type: 'fountain', x: 17, y: 17 }, { type: 'lamp', x: 11, y: 17 }, { type: 'lamp', x: 23, y: 17 });
    maps.starSummit = starSummit;

    const observatoryRoom = {
      id: 'observatoryRoom',
      name: 'Star Observatory',
      width: 22,
      height: 16,
      theme: 'observatory',
      tiles: makeGrid(22, 16, 'floor'),
      decorations: [],
      buildings: [],
      warps: [{ x: 11, y: 14, w: 1, h: 1, targetMap: 'starSummit', targetX: 15, targetY: 6, label: 'Star Summit' }],
      signs: [{ x: 4, y: 2, text: 'Observatory Rule: Look carefully, think slowly, answer bravely.' }],
      start: { x: 11, y: 13 }
    };
    fillRect(observatoryRoom.tiles, 0, 0, 22, 1, 'wall');
    fillRect(observatoryRoom.tiles, 0, 15, 22, 1, 'wall');
    fillRect(observatoryRoom.tiles, 0, 0, 1, 16, 'wall');
    fillRect(observatoryRoom.tiles, 21, 0, 1, 16, 'wall');
    fillRect(observatoryRoom.tiles, 7, 5, 8, 3, 'rug');
    addShelves(observatoryRoom.decorations, 3, 2, 4);
    addShelves(observatoryRoom.decorations, 15, 2, 4);
    observatoryRoom.decorations.push(
      { type: 'telescope', x: 10, y: 3, solid: true },
      { type: 'desk', x: 8, y: 10, solid: true },
      { type: 'desk', x: 13, y: 10, solid: true },
      { type: 'banner', x: 10, y: 2 }
    );
    maps.observatoryRoom = observatoryRoom;

    return maps;
  }

  const actors = {
    mayorClover: { id: 'mayorClover', name: 'Mayor Clover', mapId: 'redbudTown', x: 17, y: 17, sprite: 'mentor', direction: 'down' },
    scoutTessa: { id: 'scoutTessa', name: 'Scout Tessa', mapId: 'redbudTown', x: 8, y: 17, sprite: 'teacher', direction: 'left', practice: 'townPractice' },
    msMaple: { id: 'msMaple', name: 'Ms. Maple', mapId: 'academyRoom', x: 10, y: 7, sprite: 'teacher', direction: 'down' },
    rangerReed: { id: 'rangerReed', name: 'Ranger Reed', mapId: 'sunnyRoute', x: 23, y: 13, sprite: 'gardener', direction: 'down' },
    coachDot: { id: 'coachDot', name: 'Coach Dot', mapId: 'sunnyRoute', x: 9, y: 10, sprite: 'player', direction: 'right', practice: 'routePractice' },
    samReader: { id: 'samReader', name: 'Sam Reader', mapId: 'riverTown', x: 22, y: 17, sprite: 'reader', direction: 'left', practice: 'libraryPractice' },
    librarianIris: { id: 'librarianIris', name: 'Librarian Iris', mapId: 'libraryRoom', x: 10, y: 7, sprite: 'reader', direction: 'down' },
    merchantMilo: { id: 'merchantMilo', name: 'Merchant Milo', mapId: 'marketMeadow', x: 9, y: 17, sprite: 'mentor', direction: 'right' },
    bakerBea: { id: 'bakerBea', name: 'Baker Bea', mapId: 'marketMeadow', x: 18, y: 13, sprite: 'teacher', direction: 'down', practice: 'marketPractice' },
    gardenerFern: { id: 'gardenerFern', name: 'Gardener Fern', mapId: 'marketMeadow', x: 28, y: 17, sprite: 'gardener', direction: 'left' },
    owlOllie: { id: 'owlOllie', name: 'Owl Ollie', mapId: 'storybookWoods', x: 20, y: 10, sprite: 'owl', direction: 'down' },
    camperKit: { id: 'camperKit', name: 'Camper Kit', mapId: 'storybookWoods', x: 10, y: 16, sprite: 'reader', direction: 'right', practice: 'woodsPractice' },
    inventorNova: { id: 'inventorNova', name: 'Inventor Nova', mapId: 'moonriseWorkshop', x: 15, y: 17, sprite: 'inventor', direction: 'down' },
    helperPip: { id: 'helperPip', name: 'Helper Pip', mapId: 'moonriseWorkshop', x: 8, y: 15, sprite: 'teacher', direction: 'right', practice: 'harbourPractice' },
    headmasterGlow: { id: 'headmasterGlow', name: 'Headmaster Glow', mapId: 'observatoryRoom', x: 11, y: 7, sprite: 'headmaster', direction: 'down' },
    helperJoy: { id: 'helperJoy', name: 'Helper Joy', mapId: 'starSummit', x: 24, y: 17, sprite: 'gardener', direction: 'left', practice: 'summitPractice' },
    festivalMayor: { id: 'festivalMayor', name: 'Mayor Clover', mapId: 'starSummit', x: 10, y: 17, sprite: 'mentor', direction: 'down' }
  };

  const questLine = [
    { id: 'meetMayor', flag: 'metMayor', title: 'Meet Mayor Clover', location: 'Redbud Town', summary: 'Talk to Mayor Clover in Redbud Town to begin the lantern-festival adventure.' },
    { id: 'academyLesson', flag: 'academyComplete', title: 'Earn the Sun Stamp', location: 'Redleaf Academy', summary: 'Visit Ms. Maple inside the academy and finish the addition lesson.' },
    { id: 'routeLesson', flag: 'routeComplete', title: 'Earn the Trail Stamp', location: 'Sunny Route', summary: 'Help Ranger Reed with subtraction at the bright bridge on Sunny Route.' },
    { id: 'libraryLesson', flag: 'libraryComplete', title: 'Earn the Book Stamp', location: 'River Library', summary: 'Read story clues with Librarian Iris and answer comprehension questions.' },
    { id: 'marketLesson', flag: 'marketComplete', title: 'Earn the Market Stamp', location: 'Market Meadow', summary: 'Solve grouping and multiplication questions for Merchant Milo.' },
    { id: 'gardenLesson', flag: 'gardenComplete', title: 'Earn the Garden Stamp', location: 'Greenhouse Path', summary: 'Complete Fern\'s mixed garden maths and reading challenge.' },
    { id: 'woodsLesson', flag: 'woodsComplete', title: 'Earn the Lantern Stamp', location: 'Storybook Woods', summary: 'Follow Owl Ollie\'s story clues through the woods.' },
    { id: 'workshopLesson', flag: 'workshopComplete', title: 'Earn the Gear Stamp', location: 'Moonrise Workshop', summary: 'Repair the lantern train with Inventor Nova using mixed questions.' },
    { id: 'observatoryLesson', flag: 'observatoryComplete', title: 'Earn the Star Stamp', location: 'Star Observatory', summary: 'Pass Headmaster Glow\'s final mixed challenge in the observatory.' },
    { id: 'festivalFinish', flag: 'festivalComplete', title: 'Light the Great Reading Lantern', location: 'Star Summit', summary: 'Return to Mayor Clover at Star Summit to finish the story and celebrate.' }
  ];

  const stampOrder = ['Sun Stamp', 'Trail Stamp', 'Book Stamp', 'Market Stamp', 'Garden Stamp', 'Lantern Stamp', 'Gear Stamp', 'Star Stamp'];

  const mainPackFactories = {
    academyPack: additionQuest,
    routePack: subtractionQuest,
    libraryPack: () => ({
      id: 'library-pack',
      title: 'Book Stamp Lesson',
      kicker: 'River Library',
      reward: 'Book Stamp',
      intro: [
        'Librarian Iris whispers, "Readers look for who, what, where, and why."',
        'Read each short passage carefully and answer the questions to earn the Book Stamp.'
      ],
      outro: [
        'Iris slides a book-shaped stamp into your journal.',
        '"The market folk are waiting for someone who can count groups just as well as they can read."'
      ],
      questions: passageQuestions(['pondPicnic', 'kiteHill', 'libraryClub', 'busStop', 'riverBridge', 'festivalBand'])
    }),
    marketPack: multiplicationQuest,
    gardenPack: mixedGardenQuest,
    woodsPack: () => ({
      id: 'woods-pack',
      title: 'Lantern Stamp Lesson',
      kicker: 'Storybook Woods',
      reward: 'Lantern Stamp',
      intro: [
        'Owl Ollie blinks slowly. "These woods are full of clues. Read carefully to keep the lantern path glowing."',
        'Finish the story clues to earn the Lantern Stamp.'
      ],
      outro: [
        'A small lantern stamp glows warm in your journal.',
        '"Inventor Nova is waiting by the harbour workshop with one more big job."'
      ],
      questions: passageQuestions(['gardenHelpers', 'moonCamp', 'lanternTrain', 'farmMorning', 'observatoryNight', 'rainyParade'])
    }),
    workshopPack: workshopQuest,
    observatoryPack: observatoryQuest
  };

  const practicePackFactories = {
    townPractice: () => practicePack('town-practice', 'Scout Tessa\'s Warm-Up', 'Helper Ribbon', [
      mathQuestion('tp-0', 'Tessa counted 6 flags and then 4 more. How many flags did Tessa count?', 10, 201, 'Add 6 and 4.'),
      mathQuestion('tp-1', 'There were 12 apples. 5 were given away. How many apples stayed?', 7, 202, 'Subtract 5 from 12.'),
      readingQuestion('tp-2', readingPassages.riverBridge, 'Where did Sana stop to watch the ducks?', ['On the river bridge', 'Inside the bakery', 'By the market cart', 'At the observatory'], 0, 'The first sentence tells where she stopped.')
    ], ['Scout Tessa grins. "Let\'s do a tiny warm-up battle with numbers and clues."'], ['Tessa ties a helper ribbon onto your journal. "You are ready for the big quest!"']),
    routePractice: () => practicePack('route-practice', 'Coach Dot\'s Trail Drill', 'Trail Ribbon', [
      mathQuestion('rp-0', 'Coach Dot packed 9 cones and 7 more arrived. How many cones are there?', 16, 211, 'Add the two groups.'),
      mathQuestion('rp-1', 'A hiker had 15 berries and ate 6. How many berries are left?', 9, 212, 'Count backward 6 from 15.'),
      mathQuestion('rp-2', 'Two picnic rugs each hold 5 sandwiches. How many sandwiches are there?', 10, 213, 'This is 2 groups of 5.')
    ], ['Coach Dot says, "Practice drills make heroes fast and careful."'], ['Coach Dot salutes. "Neat work. Your steps are as steady as your answers."']),
    libraryPractice: () => practicePack('library-practice', 'Sam\'s Story Search', 'Book Ribbon', passageQuestions(['libraryClub', 'pondPicnic']).slice(0, 3), ['Sam Reader opens a tiny book. "Can you spot the clues before I do?"'], ['Sam claps. "You read like a real clue catcher."']),
    marketPractice: () => practicePack('market-practice', 'Baker Bea\'s Muffin Maths', 'Market Ribbon', [
      mathQuestion('mp-0', 'Bea baked 11 muffins and then 5 more. How many muffins are there?', 16, 221, 'Add 11 and 5.'),
      mathQuestion('mp-1', 'There were 18 berries. 8 went into jam. How many berries remain?', 10, 222, 'Take away 8 from 18.'),
      mathQuestion('mp-2', 'Three trays hold 3 buns each. How many buns are ready?', 9, 223, 'Count 3 groups of 3.')
    ], ['Baker Bea says, "Quick kitchen maths keeps the ovens happy."'], ['Bea hands you a warm practice ribbon and a smile.']),
    woodsPractice: () => practicePack('woods-practice', 'Camper Kit\'s Camp Clues', 'Lantern Ribbon', passageQuestions(['moonCamp', 'kiteHill']).slice(0, 3), ['Camper Kit asks, "Can you solve these camp clues before the lantern goes out?"'], ['Kit laughs. "The campfire crackled because you read so carefully!"']),
    harbourPractice: () => practicePack('harbour-practice', 'Helper Pip\'s Gear Quiz', 'Gear Ribbon', [
      mathQuestion('hp-0', 'Pip sorts 4 boxes with 2 gears in each box. How many gears are there?', 8, 231, 'Multiply 4 by 2.'),
      mathQuestion('hp-1', 'A shelf held 13 tickets. 4 tickets were used. How many tickets stay on the shelf?', 9, 232, 'Subtract 4 from 13.'),
      readingQuestion('hp-2', readingPassages.lanternTrain, 'What happened when the whistle blew?', ['Everyone waved from the platform', 'The train went to sleep', 'A kite flew away', 'The bakery opened'], 0, 'The last sentence tells what everyone did.')
    ], ['Pip spins a tiny cog. "Let\'s do a fast workshop quiz."'], ['Pip beams. "The train likes your careful thinking."']),
    summitPractice: () => practicePack('summit-practice', 'Joy\'s Festival Review', 'Star Ribbon', [
      mathQuestion('sp-0', 'Joy hangs 8 stars and then 8 more. How many stars are hanging?', 16, 241, 'Add both groups of stars.'),
      mathQuestion('sp-1', 'There were 17 lanterns. 9 were already lit. How many lanterns are not lit yet?', 8, 242, 'Subtract 9 from 17.'),
      readingQuestion('sp-2', readingPassages.festivalBand, 'Where did the band practise?', ['Beside the fountain', 'Inside the cave', 'At the bus stop', 'On the mountain bridge'], 0, 'The first sentence gives the place.')
    ], ['Joy smiles. "One last friendly review before the big lantern shines."'], ['Joy waves a ribbon. "You are ready for the celebration!"'])
  };

  window.RedleafData = {
    meta: {
      title: 'Redleaf Learning Quest',
      subtitle: 'A classic pocket-adventure inspired classroom quest'
    },
    assets: {
      sprites: {
        player: 'assets/characters/player_redleaf.svg',
        mentor: 'assets/characters/mentor_redleaf.svg',
        teacher: 'assets/characters/teacher_redleaf.svg',
        reader: 'assets/characters/reader_redleaf.svg',
        gardener: 'assets/characters/gardener_redleaf.svg',
        inventor: 'assets/characters/inventor_redleaf.svg',
        owl: 'assets/characters/owl_redleaf.svg',
        headmaster: 'assets/characters/headmaster_redleaf.svg'
      },
      buildings: {
        home: 'assets/buildings/home_redleaf.svg',
        academy: 'assets/buildings/academy_redleaf.svg',
        library: 'assets/buildings/library_redleaf.svg',
        market: 'assets/buildings/market_redleaf.svg',
        greenhouse: 'assets/buildings/greenhouse_redleaf.svg',
        workshop: 'assets/buildings/workshop_redleaf.svg',
        observatory: 'assets/buildings/observatory_redleaf.svg',
        hall: 'assets/buildings/hall_redleaf.svg'
      }
    },
    maps: createMaps(),
    actors,
    questLine,
    stampOrder,
    mainPackFactories,
    practicePackFactories,
    qaTargets: {
      storyQuestionGoal: 90,
      practiceQuestionGoal: 18,
      areaGoal: 8
    }
  };
})();
