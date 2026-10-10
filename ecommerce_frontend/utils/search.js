const ALIASES = {
    men: ['men', 'man', 'mens', 'male', 'gents', 'gentlemen'],
    women: ['women', 'woman', 'womens', 'female', 'ladies', 'lady'],
    kids: ['kids', 'kid', 'child', 'children', 'boys', 'girls', 'baby', 'toddler'],
    footwear: ['footwear', 'shoes', 'shoe', 'sneakers', 'sneaker', 'boots'],
    electronics: ['electronics', 'electronic', 'gadgets', 'gadget', 'tech'],
    accessories: ['accessories', 'accessory'],
}

const TO_CATEGORY = Object.fromEntries(
    Object.entries(ALIASES).flatMap(([category, words]) => words.map((w) => [w, category]))
)

export const normalize = (s = '') =>
    String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

const tokens = (s) => normalize(s).split(' ').filter(Boolean)

const forms = (term) => {
    const list = [term]
    if (term.length > 3 && term.endsWith('es')) list.push(term.slice(0, -2))
    if (term.length > 3 && term.endsWith('s')) list.push(term.slice(0, -1))
    return list
}

function scoreProduct(product, terms) {
    const category = normalize(product.category)
    const categoryTokens = tokens(product.category)
    const nameTokens = tokens(product.name)
    const brandTokens = tokens(product.brand)
    const descTokens = tokens(product.description)

    let total = 0
    for (const term of terms) {
        let score = 0
        const aliasCategory = TO_CATEGORY[term]
        if (aliasCategory && category === aliasCategory) score = 5

        for (const form of forms(term)) {
            if (category === form) score = Math.max(score, 5)
            else if (categoryTokens.some((t) => t.startsWith(form))) score = Math.max(score, 4)
            if (nameTokens.some((t) => t.startsWith(form))) score = Math.max(score, 6)
            if (brandTokens.some((t) => t.startsWith(form))) score = Math.max(score, 3)
            if (descTokens.some((t) => t.startsWith(form))) score = Math.max(score, 1)
        }

        if (!score) return 0
        total += score
    }
    return total
}

export function searchProducts(products, query) {
    const terms = tokens(query).filter((t) => t.length >= 2)
    if (!terms.length) return products

    return products
        .map((product, index) => ({ product, index, score: scoreProduct(product, terms) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map((item) => item.product)
}