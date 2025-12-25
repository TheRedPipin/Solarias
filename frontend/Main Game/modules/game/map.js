const locationInformation = {
    0:null,
    1:{type: 'corridor', description: `More nothing...`},
    2:{type: 'start', description:`Starting Cell\nA dim cell. Cold stone walls press in from all sides. There's barely enough light to see. A faint dripping can be heared somewhere beyond here.`},
    3:{type: 'whimpering', description:`Whimpering Chamber\nA narrow passage stretches before you. Water drips somewhere in the darkness.\n\nA hunched figure rocks back and forth in the corner, sobbing quietly.`, npc: "whimpering"},
    4:{type: 'merchant', description: `Merchant's Chamber\nA vast room. Candles flicker on a table. Behind it sits a figure in tattered robes.`, npc: "merchant"},
    5:{type: 'prisoner', description: `Prison Cell\nA cramped cell. Someone sits against the far wall, knees drawn up, staring at nothing.`, npc: "prisoner"},
    6:{type: 'puzzle', description: `Sacrificial Chamber\nA stone pedestal dominates the room. Upon it rests a weathered blade molded to the surface.`},
    7:{type: 'circle1', description: `Endless Corridor\nThe passage curves unnaturally. Your footsteps echo wrong. The walls seem to breathe.`},
    8:{type: 'circle2', description: `Endless Corridor\nThe passage twists back on itself. You feel dizzy. Something isn't right here.`},
    9:{type: 'locked_door', description: `Sealed Passage\nA heavy door blocks your path, bound with chains. Whatever lies beyond is locked away.`},
    10:{type: 'para', description: `Dead End\nThe passage stops abruptly. Stone blocks your path.\n\nYou feel off.`},
    11:{type: 'end', description: `The light burns your skin... here it is... the sun!`}
}

const dungeonMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [1, 0, 1, 0, 9, 0, 0, 0, 0, 0],
    [8, 1, 1, 10, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [7, 1, 1, 0, 1, 0, 3, 0, 1, 6],
    [1, 0, 1, 0, 1, 0, 2, 0, 9, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 5, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 11, 0, 0]
];


export function getTile(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return null;
    return locationInformation[dungeonMap[y][x]];
}

export function canMoveTo(x, y) {
    const tile = getTile(x, y);
    return tile !== null && tile !== undefined;
}

export function getNextTile(x, y, direction) {
    const dirMap = {
        north: { x: 0, y: -1 },
        south: { x: 0, y: 1 },
        east: { x: 1, y: 0 },
        west: { x: -1, y: 0 }
    };
    
    if (!dirMap[direction]) return null;
    
    const nextX = x + dirMap[direction].x;
    const nextY = y + dirMap[direction].y;
    
    if (canMoveTo(nextX, nextY)) {
        return { x: nextX, y: nextY };
    }
    return null;
}

export function generateMapDisplay(visitedTiles, playerPos) {
    const lines = [];
    const width = 21;
    
    lines.push('╔═══════════════════╗');
    lines.push('║    @!"£^!%"£"!    ║');
    lines.push('╠═══════════════════╣');
    
    if (visitedTiles.length === 0) {
        const content = '(unexplored)';
        const padding = ' '.repeat(Math.floor((width - 2 - content.length) / 2));
        lines.push('║' + padding + content + padding + ' ║');
        lines.push('╚═══════════════════╝');
        return lines.join('\n');
    }
    const visitedSet = new Set(visitedTiles);
    
    for (let y = 0; y < 10; y++) {
        const cells = [];
        for (let x = 0; x < 10; x++) {
            const coordKey = `${x},${y}`;
            const tile = getTile(x, y);
            
            if (x === playerPos.x && y === playerPos.y) {
                cells.push('@');
            } else if (visitedSet.has(coordKey)) {
                if (!tile) {
                    cells.push('?');
                } else {
                    switch (tile.type) {
                        case 'start': cells.push('S'); break;
                        case 'end': cells.push('E'); break;
                        case 'merchant': cells.push('M'); break;
                        case 'prisoner': cells.push('P'); break;
                        case 'whimpering': cells.push('W'); break;
                        case 'puzzle': cells.push('?'); break;
                        case 'locked_door': cells.push('#'); break;
                        case 'circle1':
                        case 'circle2': cells.push('O'); break;
                        case 'para': cells.push('X'); break;
                        case 'corridor': cells.push('·'); break;
                        default: cells.push('·'); break;
                    }
                }
            } else {
                cells.push(' ');
            }
        }
        const content = cells.join(' ');
        lines.push('║' + content + '║');
    }
    
    lines.push('╚═══════════════════╝');
    
    return lines.join('\n');
}


export function updateMapDisplay(visitedTiles = [], playerPos = {x: 6, y: 6}) {
    const mapContent = document.querySelector('#mapPanel .map-content');
    if (!mapContent) return;
    
    const mapText = generateMapDisplay(visitedTiles, playerPos);
    mapContent.innerHTML = `<pre class="ascii-map updating">${mapText}</pre>`;
    
    const mapElement = mapContent.querySelector('.ascii-map');
    if (mapElement) {
        setTimeout(() => mapElement.classList.remove('updating'), 400);
    }
}

export function getExits(x, y) {
    let possibleExits = [];
    for (const dir of ['north', 'south', 'east', 'west']) {
        const nextCoords = getNextTile(x, y, dir);
        console.log('Next Coords for', dir, ':', nextCoords);
        if (nextCoords) {
            possibleExits.push(dir);
        }
    }
    return possibleExits;
}