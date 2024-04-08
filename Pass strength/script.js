window.onload = () =>{
    let input = document.getElementById("inp")
    input.addEventListener("input",check);
    input.addEventListener("propertychange",check);
}


function check(){
    console.log("1")
    let val = document.getElementById("inp").value;
    let digpattern = /\d/g;
    let cappattern = /[A-Z]/g;
    let smallpattern = /[a-z]/g;
    let spepattern = /[^A-Za-z0-9]/g
    let digflag = val.match(digpattern);
    let capflag = val.match(cappattern);
    let smallflag = val.match(smallpattern);
    let speflag = val.match(spepattern);
    let lenflag = val.length >= 8;
    digflag? change("onenum",true):change("onenum",false);
    lenflag? change("len8",true):change("len8",false);
    smallflag? change("onelower",true):change("onelower",false);
    capflag? change("oneupper",true):change("oneupper",false);
    speflag? change("onespecial",true):change("onespecial",false);
}

function change(id,val){
    let ele = document.getElementById(id)
    if (val){
        if(ele.classList.contains("fa-regular")){
            ele.classList.remove("fa-regular","fa-square")
            ele.classList.add("fa-solid", "fa-check-square")
        }
    }else{
        if(ele.classList.contains("fa-solid")){
            ele.classList.remove("fa-solid", "fa-check-square")
            ele.classList.add("fa-regular","fa-square")
        }
    }
}