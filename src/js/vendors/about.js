let plus = document.getElementsByClassName('fas fa-plus-circle');
let minus = 'fas fa-minus-circle'
console.log(plus);

let accordion = document.getElementById('accordion');
console.log(accordion);
accordion.addEventListener('click', (e) => {
    let target = e.target 

    for(let i = 0; i < plus.length; i++) {

        if(target.className == 'btn btn-link' ) {

            console.log(plus[i].classList.contains("fa-plus-circle"))
            if(plus[i].classList.contains("fa-plus-circle")) {

                plus[i].classList.toggle("fa-minus-circle")

            }
        }
    };

});