let is_paused = true;
let log = []

function main(){
    let t = window.setInterval(() => {
        let cursec = document.getElementById("sec").innerHTML;
        cursec = parseInt(cursec) + 1
        let curmin = document.getElementById("min");
        let curhr = document.getElementById("hour");
        if(! is_paused){
             document.getElementById("sec").innerHTML = cursec;
        }
        if(cursec > 60){
            curmin.innerHTML = parseInt(curmin.innerHTML)+1
            document.getElementById("sec").innerHTML = 0;
        }
        if(parseInt(curmin.innerHTML) > 60){
            curhr.innerHTML = parseInt(curhr.innerHTML) + 1;
            curmin.innerHTML = 0
        }

    }, 100);
}

function pause(){

    is_paused = is_paused? false : true;
    document.getElementById("playbtn").innerHTML = is_paused? "Play":"Pause"
}

function lap(){
    if(! is_paused){
        let cursec = parseInt(document.getElementById("sec").innerHTML);
        let curmin = parseInt(document.getElementById("min").innerHTML);
        let curhr = parseInt(document.getElementById("hour").innerHTML);
        log.push({
            sec:cursec,
            min:curmin,
            hr:curhr
        })
        let secpassed = 0
        let minpassed = 0
        let hrpassed = 0
        if (log.length>1){
            if (log[log.length-2]["min"] < curmin){
                secpassed = cursec + (60 - log[log.length-2]["sec"]);
            }else{
                secpassed = cursec - log[log.length-2]["sec"] ;
            }
            if(log[log.length-2]["hr"] < curhr){
                minpassed = curmin + (60 - log[log.length-2]["min"]);
            }else{
                minpassed = curmin - log[log.length-2]["min"];
            }
            hrpassed = curhr - log[log.length-2]["hr"];
            if(secpassed > 60){
                minpassed += 1
                secpassed -= 60
            }
            if(minpassed > 60){
                minpassed -= 60
                hrpassed += 1
            }
        }
        let lap_time = log.length >1? `${hrpassed}:${minpassed}:${secpassed}`:`${curhr}:${curmin}:${cursec}`
        const thead = `
        <tr class="border-bottom border-white" id="laps">
            <th>Lap</th>
            <th>Lap Time</th>
            <th>Overall Time</th>
        </tr>`
        const trow = `
        <tr>
            <th>${log.length-1}</th>
            <td>${lap_time}</td>
            <td>${curhr}:${curmin}:${cursec}</td>
        </tr>`

        let lap = document.getElementById("laps");
        if(log.length == 1){
            lap.innerHTML += thead
        }
        lap.innerHTML+=trow;
    }
}

function reset(){
    document.getElementById("sec").innerHTML = 0
    document.getElementById("min").innerHTML = 0
    document.getElementById('hour').innerHTML = 0
    document.getElementById("laps").innerHTML = ""
    log = []
    is_paused = true;
}

main()

