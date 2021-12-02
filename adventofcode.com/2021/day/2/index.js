const fs = require('fs')
const readline = require('readline')

/**
 * @param {Array<string>} commands 
 * @return {number} 
 */
 function getSubmarinePosition(commands) {
    const result = commands.reduce((position, command) => {
        let [direction, number] = command.split(" ")
        number = Number(number)
        switch(direction) {
            case 'forward': 
                position.x += number
                position.y += position.aim * number
                break
            case 'down':
                position.aim += number
                break
            case 'up': 
                position.aim -= number
                break
        }
        return position
    }, {x: 0, y: 0, aim: 0})
    return result
}

/**
 * @param {string} filename 
 * @return {Promise<Array<string>}
 */
 async function readInput(filename) {
    const lines = []
    const readInterface = readline.createInterface({
        input: fs.createReadStream(filename)
    })
    for await (const line of readInterface) {
        lines.push(line)
    }
    return lines
}

async function main() {
    const commands = await readInput(process.argv[2])
    const p1 = getSubmarinePosition(commands)
    console.log(p1)
    console.log('part 1:', p1.x * p1.aim)
    console.log('part 2:', p1.x * p1.y)
}

main()