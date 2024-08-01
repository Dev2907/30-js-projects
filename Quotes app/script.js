let response = {}

class Quote{
    async fetch_quote() {
        const url = 'https://type.fit/api/quotes';
        let res = await fetch(url);
        res = await res.json();
        let num = Math.floor(Math.random() * 10);
        return res[num]
    }
}

window.onload = ()=>{
    get_quote()
}

async function get_quote(response){
    let quoteGen = new Quote()
    response = await quoteGen.fetch_quote()
    let auth_string = `<div id="quote_auth" class="d-flex justify-content-end align-items-center"><hr class="border border-2 border-success opacity-100 rounded-pill author"></hr>&nbsp;${response['author'].split(",")[0]}</div>`
    document.getElementById('quote').innerHTML = response['text']
    document.getElementById("quote_auth").innerHTML = auth_string
}

function change_quote(){
    get_quote(response)
}

window.change_quote = change_quote
export default Quote