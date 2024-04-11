//population slider
let set_population = document.getElementById('set_population');
let population = document.getElementById('population');
set_population.innerHTML = population.value;
population.addEventListener('input', function() {
    set_population.innerHTML = population.value;
});

//gens
let gen_count = document.getElementById('gen');
let set_gen = document.getElementById('set_gen');
set_gen.innerHTML = gen_count.value;
gen.addEventListener('input', function() {
    set_gen.innerHTML = gen_count.value;
});


//mutation procent
let procent = document.getElementById('mutation');
let set_procent = document.getElementById('set_mutation');
set_procent.innerHTML = procent.value;
procent.addEventListener('input', function() {
    set_procent.innerHTML = procent.value;
});


//sumbit button
let submit = document.getElementById('submt');
submit.addEventListener('click',function(event){
   
    run_generic_algor(size_of_population, quantity_of_gen, mutation_procent, arr);
});


function mouseMove(event) {
    let rect = block.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    arr.push([x, y]);
    generate_circle(x, y);
}

block.addEventListener('click', function(event) {
    if (event.target === block) {
        mouseMove(event);
    }
});