const pass_string_small = "abcdefghijklmnopqrstuvwxyz"
const pass_string_capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" 
const pass_string_special = "!@#$%^&*()_+{}|:<>?"
const pass_string_numerical = "0123456789"

function genrate_pass(){
    let capital = document.getElementById("only_small")
    let numerical = document.getElementById("num")
    let special = document.getElementById("special")
    let len = Number(document.getElementById("len").value)
    let pass = pass_string_small
    if(! capital.checked){
        pass += pass_string_capital
    }
    if (numerical.checked){
        pass += pass_string_numerical
    }
    if(special.checked){
        pass += pass_string_special
    }

    let pass_len = pass.length;
    let ran_val = new Uint32Array(pass_len);
    window.crypto.getRandomValues(ran_val);
    let password = ""

    for(let i = 0; i < len; i++){
        password += pass[ran_val[i] % pass_len]
    }
    document.getElementById("password").value = password
}

function copy_to_clipboard(){
    let pass = document.getElementById("password").value;
    navigator.clipboard.writeText(pass)
}