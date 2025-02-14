const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let cluesFound = 0;
const totalClues = 12; // Increased number of clues
let intro = true;
let room = false;
let currentRoom = 0;
let timer = 60; // 60 seconds time limit

const rooms = [
    {
        name: 'Living Room',
        clues: [
            { x: 100, y: 150, found: false, hidden: false },
            { x: 500, y: 300, found: false, hidden: false },
            { x: 400, y: 400, found: false, hidden: true, condition: 'checkBookshelf' },
        ],
        objects: [
            { x: 400, y: 450, width: 50, height: 50, description: 'A suspicious bookshelf.', action: 'checkBookshelf' },
        ],
    },
    {
        name: 'Kitchen',
        clues: [
            { x: 200, y: 200, found: false, hidden: false },
            { x: 600, y: 450, found: false, hidden: false },
            { x: 300, y: 350, found: false, hidden: true, condition: 'examineKnife' },
        ],
        objects: [
            { x: 350, y: 400, width: 50, height: 50, description: 'A shiny knife on the counter.', action: 'examineKnife' },
        ],
    },
    {
        name: 'Bedroom',
        clues: [
            { x: 300, y: 100, found: false, hidden: false },
            { x: 700, y: 400, found: false, hidden: false },
            { x: 500, y: 350, found: false, hidden: true, condition: 'readDiary' },
        ],
        objects: [
            { x: 450, y: 350, width: 50, height: 50, description: 'A diary with a torn page.', action: 'readDiary' },
        ],
    },
];

function revealClues(action) {
    const room = rooms[currentRoom];
    for (const clue of room.clues) {
        if (clue.hidden && clue.condition === action) {
            clue.hidden = false;
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (intro) {
            intro = false;
            room = true;
            document.getElementById('intro-text').style.display = 'none';
            startTimer();
        }
    }
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    checkClick(x, y);
});

function drawText(text, x, y) {
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText(text, x, y);
}

function drawClues() {
    const room = rooms[currentRoom];
    for (const clue of room.clues) {
        if (!clue.found && !clue.hidden) {
            ctx.fillStyle = 'red';
            ctx.fillRect(clue.x, clue.y, 20, 20);
        }
    }
}

function drawObjects() {
    const room = rooms[currentRoom];
    for (const obj of room.objects) {
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function checkClick(x, y) {
    const room = rooms[currentRoom];
    for (const clue of room.clues) {
        if (
            !clue.found &&
            x >= clue.x &&
            x <= clue.x + 20 &&
            y >= clue.y &&
            y <= clue.y + 20
        ) {
            clue.found = true;
            cluesFound += 1;
            break;
        }
    }
    for (const obj of room.objects) {
        if (
            x >= obj.x &&
            x <= obj.x + obj.width &&
            y >= obj.y &&
            y <= obj.y + obj.height
        ) {
            alert(obj.description);
            revealClues(obj.action);
        }
    }
}

function startTimer() {
    const interval = setInterval(() => {
        if (timer > 0 && cluesFound < totalClues) {
            timer -= 1;
        } else {
            clearInterval(interval);
            if (cluesFound < totalClues) {
                alert('Time is up! You failed to find all the clues.');
                room = false;
                intro = true;
                cluesFound = 0;
                timer = 60;
                currentRoom = 0;
                resetClues();
                document.getElementById('intro-text').style.display = 'block';
            }
        }
    }, 1000);
}

function resetClues() {
    for (const room of rooms) {
        for (const clue of room.clues) {
            clue.found = false;
            if (clue.hidden) clue.hidden = true;
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (intro) {
        drawText('Welcome to the 8-Bit Murder Mystery Game!', 50, 100);
        drawText('Press SPACE to start your investigation.', 50, 150);
    } else if (room) {
        drawText(`Clues found: ${cluesFound}/${totalClues}`, 10, 20);
        drawText(`Time left: ${timer}s`, 10, 50);
        drawText(`Current Room: ${rooms[currentRoom].name}`, 10, 80);
        drawText('Investigate the room and find clues!', 50, 100);
        drawClues();
        drawObjects();
        if (cluesFound === totalClues) {
            drawText("You've found all the clues! Solve the mystery!", 50, 200);
        } else if (currentRoom < rooms.length - 1 && cluesFound >= (currentRoom + 1) * 4) { // Increase difficulty with more clues per room
            currentRoom += 1;
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

