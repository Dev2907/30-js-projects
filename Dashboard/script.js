import Quote from './../Quotes app/script.js'

window.onload = async() => {
    let quoteGen = new QuoteBlock()
    quoteGen.loadQuote()
}

class QuoteBlock{
    async loadQuote(){
        let quoteGen = new Quote()
        let quote = await quoteGen.fetch_quote()
        let quoteblock = document.querySelector(".quote")
        quoteblock.querySelector('.text').innerHTML = quote['text']
        quoteblock.querySelector('.author').innerHTML = "-" + quote['author'].split(",")[0]
    }    
}