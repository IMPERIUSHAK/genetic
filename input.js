let block = document.getElementById('plank');
let ctx = block.getContext('2d');
let arr = [];
let bestPath = [];
let size_of_population = parseInt(population.value);
let dots;
let quantity_of_gen = 5;
let mutation_procent = 20;