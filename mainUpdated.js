const prompt = require('prompt-sync')({sigint: true});

//Grid Characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]], x, y) {
        this.field = field;
        this.X = x;
        this.Y = y;
    }
    static generateField(height, width) {
        //Creates 2d array of empty items
        const field = new Array(height).fill(0).map(arr => new Array(width));
        //Fill array with fieldCharacters and holes
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                field[y][x] = fieldCharacter;
            }
        }
        let holes = 0;
        while(holes < 20) {
            let newHoleY = Math.floor(Math.random() * height);
            let newHoleX = Math.floor(Math.random() * width);
            if(field[newHoleY][newHoleX] !== pathCharacter && field[newHoleY][newHoleX] !== hat && field[newHoleY][newHoleX] !== hole) {
                field[newHoleY][newHoleX] = hole;
            }
            holes++;
        }
        
        //Create a location for hat to somewhere random in the 2d array
        const hatLocation = {
            Y: Math.floor(Math.random() * height),
            X: Math.floor(Math.random() * width)
        }

        //Make hat not at player's starting point
        while(hatLocation.Y === this.Y && hatLocation.X === this.X) {
            hatLocation.Y = Math.floor(Math.random() * height);
            hatLocation.X = Math.floor(Math.random() * width);
        }

        //Insert hat into field
        field[hatLocation.Y][hatLocation.X] = hat;

        return field;
    }
    extraHole() {
        let extraHoleY = Math.floor(Math.random() * 10);
        let extraHoleX = Math.floor(Math.random() * 10);
        while (this.field[extraHoleY][extraHoleX] !== fieldCharacter) {
            extraHoleY = Math.floor(Math.random() * 10);
            extraHoleX = Math.floor(Math.random() * 10);
        }
        this.field[extraHoleY][extraHoleX] = hole;
    }
    getDirection() {
        const direction = prompt('Which way? ("u", "d", "l", or "r")').toUpperCase();
        switch(direction) {
            case 'U': 
                this.Y--;
                break;
            case 'D':
                this.Y++;
                this.extraHole();
                break;
            case 'L':
                this.X--;
                break;
            case 'R':
                this.X++;
                this.extraHole();
                break;
            default:
                console.log('Enter "u", "d", "l", or "r".')
                this.getDirection();
        }
    }
    foundHat() {
        return this.field[this.Y][this.X] === hat;
    }
    fallHole() {
        return this.field[this.Y][this.X] === hole;
    }
    returnPath() {
        return this.field[this.Y][this.X] === pathCharacter;
    }
    outOfBounds() {
        //Bring player out of other side if go out of bounds
        if(this.Y < 0) {
            this.Y = this.field.length - 1;
        } else if(this.Y > this.field.length) {
            this.Y = 0;
        } else if(this.X > this.field[0].length) {
            this.X = 0;
        } else if(this.X < 0) {
            this.X = this.field[0].length - 1;
        }
    }
    print() {
        const displayArray = this.field.map(row => {
            return row.join('');
        }).join('\n');
        console.log(displayArray);
    }
    
    playGame() {
        let playing = true;
        while(playing) {
            this.field[this.Y][this.X] = pathCharacter;
            this.print();
            this.getDirection();
            this.outOfBounds();
            if(this.returnPath()) {
                console.log("You died.");
                playing = false;
                break;
            } else if(this.fallHole()) {
                console.log("You fell down a hole.");
                playing = false;
                break;
            } else if(this.foundHat()) {
                console.log("You won!");
                playing = false;
                break;
            }
        }
    }
}

const playGame = new Field(Field.generateField(10, 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
playGame.playGame();