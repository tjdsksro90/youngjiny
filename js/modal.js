

let modal = document.querySelector("modal");
let modal_bg = document.querySelector(".modal_bg");
let modal_box = document.querySelector(".modal_box");
let modal_text = document.querySelector(".modal_text");
let modal_btn = document.querySelector(".modal_btn");


// 모달창 닫기 기능
modal_btn.addEventListener("click", modalClose)
modal_bg.addEventListener("click", modalClose)



// 모달창 닫기 기능
function modalClose (e) {
    modal.style.visibility = "hidden";
    modal_box.style.opacity = "0"
    modal_bg.style.opacity = "0"
}

function modalOpen (value) {
    let arrText = value;    
    modal.style.visibility = "visible";
    modal_box.style.opacity = "100%"
    modal_bg.style.opacity = "5%"
    modal_text.innerHTML = arrText
}















