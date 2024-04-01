let response = {}

window.onload = async function() {
    
    await fetch_quote()
    get_quote(response)
}

async function fetch_quote() {
    const url = 'https://type.fit/api/quotes';
    let res = await fetch(url);
    response = await res.json();
}

async function get_quote(response){
    let num = Math.floor(Math.random() * 10);
    let auth_string = `<div id="quote_auth" class="d-flex justify-content-end align-items-center"><hr class="border border-2 border-success opacity-100 rounded-pill author"></hr>&nbsp;${response[num]['author'].split(",")[0]}</div>`

    document.getElementById('quote').innerHTML = response[num]['text']
    document.getElementById("quote_auth").innerHTML = auth_string
}

function change_quote(){
    get_quote(response)
}