'use strict'

/**
 * Contains essential informations related to income taxes.
 * @typedef {object} IncomeTaxes
 * @property {number} income Income
 * @property {number} parts Number of parts
 * @property {number[]} taxesPerSlice Amount of tax to pay per slice
 * @property {number} taxes Sum of taxes per slice
 * @property {number} toPay Rounded value of {@link taxes} property 
 */ 

/** @typedef {object} Slice
 * @property {number} min Lower boundary
 * @property {number} max Upper boundary
 * @property {number} tax Tax rate
 */

/** 
 * @const {Slice[]}
 */
const SLICES = [
    { min: 0, max: 10_064, rate: 0 },
    { min: 10_065, max: 25_659, rate: .11 },
    { min: 25_660, max: 73_369, rate: .3 },
    { min: 73_370, max: 157_806, rate: .41 },
    { min: 15_7807, max: Number.POSITIVE_INFINITY, rate: .45 }
]

/**
 * Calculates the number of parts based on the family situation and the number of children.
 * @param {boolean} isMarried true if the person is married
 * @param {number} numberOfChildren must be positive or zero
 * @return {number} greater than 0.
 */
function calculateParts(isMarried, numberOfChildren) {
    numberOfChildren = Math.max(0, numberOfChildren) || 0
    return (isMarried ? 2 : 1) + (Math.min(numberOfChildren, 2) / 2) + Math.max(0, numberOfChildren - 2)
}

/**
 * Calculates the amount of taxes a person must pay.
 * @param {number} income the total income
 * @param {number} parts Number of parts based on the person's situation
 * @return {IncomeTaxes}
 */
function calculateTaxes(income, parts) {
    // Prevent from negative and NaN values
    income = Math.max(0, income) || 0
    parts = Math.max(parts, 1)
    // prevent values between two slices, 10064.54 for instance
    const tempIncome = Math.ceil(income / parts)
    const taxesPerSlice = []
    // For each slice...
    for(const slice of SLICES) {
        let taxable = Math.min(slice.max, tempIncome) - (slice.min - 1)
        taxesPerSlice.push(taxable * slice.rate)
        // the income is in the current slice, we exit
        if(tempIncome <= slice.max) {
            break
        }
    }
    // We sum the tax of each slice to get the amount to pay
    const taxes = taxesPerSlice.reduce((total, t) => total + t, 0) * parts;
    return {
        income,
        taxesPerSlice,
        taxes: taxes,
        parts,
        toPay: Math.round(taxes)
    }
}

/**
 * 
 * @param {number} saving The amount of money you would like to save after taxes
 * @param {number} parts Number of parts based on the person's situation
 * @return {IncomeTaxes} See the key 'property' to know how much you need to make.
 */
function reverseCalculation(saving, parts) {
    // Prevent from negative and NaN values
    saving = Math.max(0, saving) || 0
    parts = Math.max(parts, 1)
    const taxesPerSlice = []
    let income = 0
    let cumuledTaxes = 0
    for (const slice of SLICES) {
        let theoricalIncome = slice.max
        const theoricalTax = (theoricalIncome - (slice.min - 1)) * slice.rate
        const temp = theoricalIncome * parts - (theoricalTax + cumuledTaxes) * parts
        if(temp > saving || slice.max === Number.POSITIVE_INFINITY) {
            income = (saving - (parts * (slice.min - 1) * slice.rate) + (parts * cumuledTaxes))/(parts - parts * slice.rate)
            const tax = Math.max(0, (income - (slice.min - 1)) * slice.rate)
            taxesPerSlice.push(tax)
            cumuledTaxes += tax
            break
        }
        taxesPerSlice.push(theoricalTax)
        cumuledTaxes += theoricalTax
    }
    const taxes = cumuledTaxes * parts
    const toPay = Math.round(taxes)
    return {
        income: saving + toPay,
        taxesPerSlice,
        parts,
        toPay,
        taxes
    }
}

/**
 * Renders a table with details.
 * @param {IncomeTaxes} results
 * @param {HTMLTableElement} table
 */
function showBySlices(results, table) {
    const tbody = table.querySelector('tbody')
    const footer = table.querySelector('tfoot') 
    const numberFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    tbody.innerHTML = ''
    footer.innerHTML = ''
    for (const [index, slice] of SLICES.entries()) {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td> ${
        slice.max === Number.POSITIVE_INFINITY ? `Au dessus de ${numberFormat.format(slice.min)}` : 
        `Entre ${numberFormat.format(slice.min)} et ${numberFormat.format(slice.max)}`}
        </td><td>${new Intl.NumberFormat('fr-FR', { style: 'percent' }).format(slice.rate)}</td>
        <td>${numberFormat.format(results.taxesPerSlice[index] || 0)}</td>`
        tbody.appendChild(tr)
    }
    const data = [
        ['Impôt pour 1 part fiscale', numberFormat.format(results.taxes / results.parts)],
        ['Parts fiscales', results.parts],
        ['Total', numberFormat.format(results.taxes)],
        ['<b>Impôt net à payer en 2020</b>', `<b>${numberFormat.format(results.toPay)}</b>`],
    ]
    for(const d of data) {
        const row = document.createElement('tr')
        row.innerHTML = `<td colspan="2" scope="colgroup">${d[0]}</td><td>${d[1]}</td>`
        footer.appendChild(row)
    }
}

const incomeField = document.getElementById('income')
const taxesField = document.getElementById('taxes')
const afterTaxesField = document.getElementById('after')
const marriedField = document.getElementById('married')
const childrenField = document.getElementById('children')
const table = document.querySelector('table')
function perform(e) {
    const parts = calculateParts(marriedField.checked, childrenField.valueAsNumber)
    let results = { taxesPerSlice: [], income: 0, taxes: 0, toPay: 0 }
    if(e.target === afterTaxesField) {
        results = reverseCalculation(afterTaxesField.valueAsNumber, parts)
        incomeField.value = results.income.toFixed(2)
    } else {
        results = calculateTaxes(incomeField.valueAsNumber, parts)
        taxesField.value = results.toPay
        afterTaxesField.value = results.income - results.toPay
    }
    showBySlices(results, table)
}

document.querySelector('form').addEventListener('input', perform)
showBySlices({income: 0, taxesPerSlice: [], taxes: 0, toPay: 0, 
    parts: calculateParts(marriedField.checked, childrenField.valueAsNumber),
}, table)