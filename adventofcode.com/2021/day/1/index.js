const fs = require('fs')
const readline = require('readline')

/**
 * @param {Array<number>} data 
 * @return {number} 
 */
function countLargerMeasurements(data) {
    // Skip the first entry of the array
    return data.slice(1).reduce((increases, currentDepth, index) => {
        if(currentDepth > data[index]) {
            increases++
        }
        return increases
    }, 0)
}

/**
 * @param {Array<number>} data 
 * @return {Array<number>}
 */
 function slidingWindow(data) {
    const sizeWindow = 3
    return data.reduce((accumulator, currentDepth, index) => {
        const UpperBound = index + sizeWindow
        if (UpperBound > data.length) {
            return accumulator
        }  
        return accumulator.concat(data.slice(index, UpperBound).reduce((acc, val) => val + acc, 0))
    }, [])
}

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

async function main() {
    const numbers = await readInput(process.argv[2])
    console.log(`part 1: ${countLargerMeasurements(numbers)}`)
    console.log(`part 2: ${countLargerMeasurements(slidingWindow(numbers))}`)
}

main()