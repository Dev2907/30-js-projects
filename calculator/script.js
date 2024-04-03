window.onload = function(){
    let out = document.querySelector(".out");
    out.innerHTML = "";
    let buttons = document.querySelectorAll(".but")
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (event)=> {
            switch(event.target.textContent){
                case "AC":
                    out.innerHTML = "";
                    break;
                case "DE":
                    if (out.innerHTML[out.innerHTML.length-1] != ";"){
                        out.innerHTML = out.innerHTML.substring(0, out.innerHTML.length-1);
                    }else{
                        out.innerHTML = out.innerHTML.substring(0, out.innerHTML.length-13);
                    }
                    break;
                case "/":
                case "X":
                case "+":
                case "-":
                    out.innerHTML += `&nbsp;${event.target.textContent}&nbsp;`;
                    break;
                case "=":
                    out.innerHTML = eval(out.innerHTML);
                    break;
                case "00":
                    break;
                default:
                    out.innerHTML += event.target.textContent;
                    break;
            }
        })
    }
}

function applyOp(opr,b,a){
    if (opr == "+"){
        return a+b;
    }else if(opr == "-"){
        return a-b;
    }else if(opr == "/"){
        if(b == 0){
            return false;
        }else{
            return a/b;
        }
    }else if(opr == "X"){
        return a*b;
    }
}
function hasprecedence(op1,op2){
    if(op1 == "(" || op2 == ")"){
        return false;
    }else if((op1 == "+" || op1 == "-") && (op2 == "X" || op2 == "/")){
        return false;
    }else if(op1 == "("){
        return false;
    }else{
        return true;
    }
}

function check_op(op){
    let ops = ["+","X","-","/"]
    for (let i = 0; i < ops.length; i+=1){
        if (op == ops[i]){
            return true;
        }
    }
    return false;
}

function eval(query){
    let value = [];
    let op = [];
    let tempop;
    displayStr = query.split("&nbsp;");
    for(let i=0; i<displayStr.length; i++){
        if (!check_op(displayStr[i]) ){
            displayStr[i] = parseFloat(displayStr[i]);
        }
    } 

    for (let i = 0; i < displayStr.length; i++){
        if(!check_op(displayStr[i])){
            value.push(displayStr[i]);
        }else if(check_op(displayStr[i])){
            while(op.length != 0 && hasprecedence(op[op.length-1], displayStr[i]) ){
                tempop = op.pop();
                let sol = applyOp(tempop,value.pop(),value.pop())
                if(sol){
                    value.push(sol);
                }else{
                    return "cannot divide by 0"
                }
            }
            op.push(displayStr[i]);
        }
    }
    while(op.length !== 0){
        let sol = applyOp(op.pop(),value.pop(),value.pop())
        if(sol){
            value.push(sol);
        }else{
            return "cannot divide by 0"
        }
    }

    return value[0];
}