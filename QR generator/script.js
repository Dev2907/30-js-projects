
window.onload = function() {
    let input = document.getElementById("link");
    input.addEventListener('keypress',(event)=>{
        if(event.key == "Enter" ){
            generate_qr();
        }
    })
}

function generate_qr() {
  let url = document.getElementById("link").value;
  let qr = document.getElementById("qr");
  if (url && qr.childElementCount == 0){
    document.getElementById('QR code').innerHTML += `<i style="font-size: 10px;">click on image to copy to clipboard</i>`
    new QRCode("qr", {
        text: url,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
    }else{
        return "no link found";
    }
}

async function copy_to_clipboard(){
    let img = document.getElementById("qr");
    img = img.querySelector("img");
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d"); 
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);

    canvas.toBlob(async (blob)=>{
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]:blob,
            }),
        ]);
    })
    
    console.log("img copied to clipboard")
}