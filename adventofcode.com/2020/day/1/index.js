const fs = require('fs')
const readline = require('readline')

/**
 * @param {string} filename 
 * @return {Promise<Array<number>}
 */
async function readInput(filename) {
    const numbers = []
    const readInterface = readline.createInterface({
        input: fs.createReadStream(filename)
    })
    for await (const line of readInterface) {
        numbers.push(Number(line))
    }
    return numbers
}

/**
 * @param {Array<number>} numbers
 * @param {number} expected
 * @return {Array<number>}
 */
function findTwoNumbers(numbers, expected) {
    // Dichotomy-based search
    length = numbers.length - 1
    for (const [i, value] of numbers.entries()) {
        let min = i
        let max = length
        while (min < max) {
            let index = min + Math.max(1, Math.floor((max - min) / 2))
            const result = expected - (value + numbers[index])
            if(result == 0) {
                return [value, numbers[index]]
            }
            if(result < 0) {
                max = index - 1
            }
            if(result > 0) {
                min = index + 1
            }
        }
    }
    return []
}

/**
 * @param {Array<number>} numbers
 * @param {number} expected
 * @return {Array<number>}
 */
function findThreeNumbers(numbers, expected) {
    for (const [i, value] of numbers.entries()) {
        result = findTwoNumbers(numbers, expected - value)
        if(result.length == 2) {
            return [...result, value]
        }
    }
}

async function main() {
    let numbers = await readInput(process.argv[2])
    numbers = numbers.sort((a, b) => a - b)
    const result = findThreeNumbers(numbers, 2020)
    console.log(`${result.join(' * ')} = ${result.reduce((acc,v) => acc * v, 1)}`)
}

main()