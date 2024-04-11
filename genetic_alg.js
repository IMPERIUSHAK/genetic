function generate_circle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.fillStyle = "rgb(204, 204, 172)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
    ctx.shadowBlur = 5; 
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2; 
    ctx.fill();
}

function generate_line(x,y,x1,y1,r,g,b){
    ctx.lineWidth = 5;
    ctx.beginPath(); // Начинаем новый путь
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = 'rgb('+r+','+g+','+b+')'; // Задаем цвет линии
    ctx.stroke(); // Рисуем линию
}

function update_circles(){
    for(let i = 0; i < bestPath.length-1; ++i){
        let x = arr[bestPath[i]][0];
        let y = arr[bestPath[i]][1];
        let x1 = arr[bestPath[i+1]][0];
        let y1 = arr[bestPath[i+1]][1];
        generate_circle(x, y); // Рисуем круги сначала
        generate_circle(x1, y1);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, block.width, block.height);
}

function connect_gens(r,g,b){

    clearCanvas();

    for(let i = 0; i < bestPath.length-1; ++i){
        let x = arr[bestPath[i]][0];
        let y = arr[bestPath[i]][1];
        let x1 = arr[bestPath[i+1]][0]; // Corrected from [1] to [0]
        let y1 = arr[bestPath[i+1]][1]; // Corrected from [0] to [1]
        generate_line(x, y, x1, y1,r,g,b);
    }
    x = arr[bestPath[0]][0];
    y = arr[bestPath[0]][1];
    x1 = arr[bestPath[bestPath.length-1]][0];
    y1 = arr[bestPath[bestPath.length-1]][1];
    generate_line(x, y, x1, y1,r,g,b);

    update_circles();

}
class Genetic_Algor {
    constructor(size_of_population, quantity_of_gen, mutation_procent, arr_of_points) {
        this.size_of_population = size_of_population; //кол-во строк при генерации популяции
        this.quantity_of_gen = quantity_of_gen; //поколения
        this.mutation_procent = mutation_procent; //процент мутации
        this.arr_of_points = arr_of_points; //координаты точек
        this.path = new Array(size_of_population).fill().map(() => new Array(arr_of_points.length).fill(0));
        this.distances = new Array(size_of_population);
        this.rand_arr1 = [];//выбор  радомной строки из матрицы
        this.rand_arr2 = [];//выбор  радомной строки из матрицы
        this.crossed_arr1;//1 скрещенный массив
        this.crossed_arr2;//2 скрещенный массив
        this.distances_for_crossed =[2];
    }

    //рандомное число в заданом диапaзоне
    rand_num(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //расстояние между двумя точками
    find_coord(x,y,x1,y1){
        return Math.sqrt(Math.pow(x-x1,2) + Math.pow(y-y1,2));   
    }
   
    //расстония между всеми точками
    find_dist(path,city,arr_of_points){
   
        let sum = 0;
        let x,y,x1,y1;
        
        for(let i = 0; i < path[city].length - 1; ++i){
        
           let j = i+1;
           x = arr_of_points[path[city][i]][0];
           y = arr_of_points[path[city][i]][1];
           x1 = arr_of_points[path[city][j]][0];
           y1 = arr_of_points[path[city][j]][1];

           sum += this.find_coord(x,y,x1,y1);
        }

        x = arr_of_points[path[city][0]][0];
        y = arr_of_points[path[city][0]][1];
        x1 = arr_of_points[path[city][path[city].length - 1]][0];
        y1 = arr_of_points[path[city][path[city].length - 1]][1];

        sum += this.find_coord(x,y,x1,y1);

        return sum;
    }

     //cкрещивание
    find_crossing(arr){

        let sum = 0;
        let x,y,x1,y1;
        
        for(let i = 0; i < arr.length-1; ++i){

            x = this.arr_of_points[arr[i]][0];
            y = this.arr_of_points[arr[i]][1];
            x1 = this.arr_of_points[arr[i+1]][0];
            y1 = this.arr_of_points[arr[i+1]][1];

            sum += this.find_coord(x,y,x1,y1);
        }
        return sum;
    }

    crossing(arr1,arr2){

        let length = arr1.length;
        let result = new Array(length).fill(0);
        let result2 = new Array(length);
        let visited = new Array(this.arr_of_points.length).fill(false);
        let visited2 = new Array(this.arr_of_points.length).fill(false);
        
        for(let i = 0; i < Math.floor(length/2); ++i){

            visited[arr1[i]] = true; 
            result[i] = arr1[i];
            
            result2[i] = arr2[i];
            visited2[arr2[i]] = true;
        }


        let key = Math.floor(length/2);
        let key2 =  Math.floor(length/2);

        for(let i = Math.floor(length/2); i < length; ++i){

            if(!visited[arr2[i]]){
                result[key] = arr2[i];
                key++;
                visited[arr2[i]] = true;
            }
        
            if(!visited2[arr1[i]]){
                result2[key2] = arr1[i];
                key2++;
                visited2[arr1[i]] = true;
            }
        
        }
        for(let i =  Math.floor(length/2); i < length; ++i){

            if(!visited[arr1[i]]){
                result[key] = arr1[i];
                key++;
                visited[arr2[i]] = true;
                
            }
            if(!visited2[arr2[i]]){
                result2[key2] = arr2[i];
                key2++;
                visited2[arr1[i]] = true;
                
            }

        }
        
        return [result,result2];
    }
    //мутация
    mutation(arr1){
        let mutated = arr1;

        let mutation_rand = this.rand_num(0,100);

        if(mutation_rand > mutation_procent){
            let gen1, gen2;
            do {
                gen1 = this.rand_num(1, arr1.length - 1); // Исправлено
                gen2 = this.rand_num(1, arr1.length - 1); // Исправлено
            } while (gen1 == gen2);

            let gen3 = mutated[gen1];
            mutated[gen1] = mutated[gen2];
            mutated[gen2] = gen3;
        }

        return mutated;
    }

    add_new_kids(){

        this.path.push(this.crossed_arr1);
        this.path.push(this.crossed_arr2);
        this.distances.push(this.distances_for_crossed[0]);
        this.distances.push(this.distances_for_crossed[1]);

    }
    sort_kids() {
        for (let i = 0; i < this.distances.length; ++i) {
            for (let j = 0; j < this.distances.length - 1; ++j) {
                if (this.distances[j] > this.distances[j + 1]) {
                    let dist = this.distances[j];
                    this.distances[j] = this.distances[j + 1];
                    this.distances[j + 1] = dist;
                    
                    // Сохраняем путь до того, как менять
                    let tempPath = this.path[j].slice();
                    this.path[j] = this.path[j + 1].slice();
                    this.path[j + 1] = tempPath;
                }
            }
        }
    }
    
    delete_worst_individ() {
        // Проверка наличия элементов перед удалением
        if (this.distances.length >= 2 && this.path.length >= 2) {
            this.distances.splice(-2);
            this.path.splice(-2);
        }
    }

    generate_chromo(){
        for (let i = 0; i < this.size_of_population; ++i) {
            this.path[i][0] = 0;
            let visited = new Array(this.arr_of_points.length).fill(false);
            visited[0] = true; // Первая вершина всегда 0

            for (let j = 1; j < this.arr_of_points.length; ++j) {
                let rnd;
                do {
                    rnd = this.rand_num(0, this.arr_of_points.length - 1);
                } while (visited[rnd]); // проверка на длину массива
                this.path[i][j] = rnd;
                visited[rnd] = true;
            }
            this.distances[i] = this.find_dist(this.path, i, this.arr_of_points);
        }

    }
    run() {
        // берем 2 рандомные массивы 
        let rnd, rnd2;
        rnd = this.rand_num(0, this.size_of_population - 1);
        rnd2 = this.rand_num(0, this.size_of_population - 1);
        this.rand_arr1 = this.path[rnd].slice();
        this.rand_arr2 = this.path[rnd2].slice();

        let result = this.crossing(this.rand_arr1, this.rand_arr2);

        this.crossed_arr1 = result[0];
        this.crossed_arr2 = result[1];
        this.distances_for_crossed[0] = this.find_crossing(this.crossed_arr1);
        this.distances_for_crossed[1] = this.find_crossing(this.crossed_arr2);

        if (this.path[0].length >= 2) {

            if (this.distances_for_crossed[0] > this.distances_for_crossed[1]) {
                this.crossed_arr1 = this.mutation(this.crossed_arr1);
                this.distances_for_crossed[0] = this.find_crossing(this.crossed_arr1);
            } else {
                this.crossed_arr2 = this.mutation(this.crossed_arr2);
                this.distances_for_crossed[1] = this.find_crossing(this.crossed_arr2);
            }

        }

        this.add_new_kids();
        this.sort_kids();
        this.delete_worst_individ();
    }
    async mutation_counter(){
        let key = 0;
        while(key < this.quantity_of_gen){
            this.run();
            bestPath = this.path[0];

            let r = this.rand_num(0,255);
            let g = this.rand_num(0,255);
            let b = this.rand_num(0,255);

            await sleep(200);
            connect_gens(r,g,b);
            key++;
        }
        alert("Работа алгоритма завершена!");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}