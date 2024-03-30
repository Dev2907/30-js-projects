window.onload = ()=>{
    document.getElementById("res").innerHTML = "";
}

function res_string(yr="", month="", day=""){
    return `<div class="text-white">You are <span id="year" class="text-warning">${yr}</span> years, <span id="months" class="text-warning">${month}</span> months and <span id="days" class="text-warning">${day}</span> days old</div>`
}

function calculateAge(){
    let now = new Date()
    let selected = new Date(document.getElementById("date_input").value)
    let yr = now.getFullYear() - selected.getFullYear()
    let mon = now.getMonth() - selected.getMonth()
    let day = now.getDate() - selected.getDate()
    document.getElementById("res").innerHTML = res_string(yr,mon,day)
}