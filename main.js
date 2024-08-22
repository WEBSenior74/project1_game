// Вычисляет координаты объекта и управлеяет движением с заданной скоростью
class MovingObjects{
    constructor(element, speed){
        this.element = element;
        this.speed = speed;
        this.coordinates = this.getCoordinates(this.element);
    }
    
    getCoordinates(element){
        const matrix = window.getComputedStyle(element).transform;
        const array = matrix.split(',');
        const x = parseFloat(array[array.length - 2]) || 0;  // Получаем координату X
        const y = parseFloat(array[array.length - 1]) || 0;  // Получаем координату Y
        return { x, y };
    }
    
    Move(){
        this.coordinates.y += this.speed;
        
        // Если объект выходит за пределы экрана, возвращаем его обратно
        if(this.coordinates.y > window.innerHeight){
            this.coordinates.y = -this.element.clientHeight;  // Возвращаем на верхнюю границу
        }
        
        this.updatePosition();
    }
    
    updatePosition(){
        this.element.style.transform = `translate(${this.coordinates.x}px, ${this.coordinates.y}px)`;
    }
}
//=====================================================================================================================
// Управляет движением отдельных деревьев. Он может вычислять свои координаты и двигаться вниз по экрану.
class Tree extends MovingObjects{    

}
//=====================================================================================================================

class House extends MovingObjects{

}
//=====================================================================================================================

class Enemy extends MovingObjects{
    constructor(element, speed, width, road){
        super(element, speed);
        this.road = road;
        this.width = width;
    }
    
    Move(){
        this.coordinates.y += this.speed;
        
        // Если дерево выходит за пределы экрана, возвращаем его обратно
        if(this.coordinates.y > window.innerHeight){
            this.coordinates.y = -this.element.clientHeight - 50;  // Возвращаем на верхнюю границу
            
            const rand = parseInt(Math.random() * (4 - 1) + 1);
            document.getElementById("enemy").src=`img/auto${rand}.png`;
            
            const direction = parseInt(Math.random() * 2);
            this.coordinates.x = direction == 0 ? -90 : -20;
        }
        
        this.updatePosition();
    }
}

//=====================================================================================================================

class Police extends MovingObjects{
    constructor(element, speed){
        super(element, speed);
    }
    
    Move(){
        this.coordinates.y += this.speed;
        
        // Если дерево выходит за пределы экрана, возвращаем его обратно
        if(this.coordinates.y > window.innerHeight){
            this.coordinates.y = -this.element.clientHeight;  // Возвращаем на верхнюю границу
        }
        
        this.updatePosition();
    }
    
        updatePosition(){
        this.element.style.transform = `translate(${this.coordinates.x}px, ${this.coordinates.y}px) rotateZ(45deg)`;
    }
}

//=====================================================================================================================

class Bonus extends MovingObjects{
    constructor(element, speed){
        super(element, speed);
        this.visibleBonus = true;
    }

    Move(){
        this.coordinates.y += this.speed;
        
        // Если дерево выходит за пределы экрана, возвращаем его обратно
        if(this.coordinates.y > window.innerHeight){
            this.coordinates.y = -this.element.clientHeight;  // Возвращаем на верхнюю границу
            this.element.style.display = 'initial';
            this.visibleBonus = true;
            
            const direction = parseInt(Math.random() * 2);
            const randomXCoord = parseInt(Math.random() * (150 + 1 - this.element.clientWidth));
            this.coordinates.x = direction == 0 ? -randomXCoord : randomXCoord;
        }
        
        this.updatePosition();
    }
}

//=====================================================================================================================

class Car extends MovingObjects{
    constructor(element, speed, roadHeight, roadWidth){
        super(element, speed);
        this.speed = 10;
        this.roadHeight = roadHeight;
        this.roadWidth = roadWidth;
        this.carHeight = element.clientHeight;
        this.carWidth = element.clientWidth;
        this.move = { top: null, down: null, left: null, right: null, };
    }
    
    startMove(direction){
        switch(direction){
            case 'ArrowUp':
                if(!this.move.top) this.move.top = requestAnimationFrame(() => this.moveToTop());
                break;
            case 'ArrowDown':
                if(!this.move.down) this.move.down = requestAnimationFrame(() => this.moveToBottom());
                break;
            case 'ArrowLeft':
                if(!this.move.left) this.move.left = requestAnimationFrame(() => this.moveToLeft());
                break;
            case 'ArrowRight':
                if(!this.move.right) this.move.right = requestAnimationFrame(() => this.moveToRight());
                break;
        }
    }
    
    stopMove(direction){
        switch(direction){
            case 'ArrowUp':
                cancelAnimationFrame(this.move.top);
                this.move.top = null;
                break;
            case 'ArrowDown':
                cancelAnimationFrame(this.move.down);
                this.move.down = null;
                break;
            case 'ArrowLeft':
                cancelAnimationFrame(this.move.left);
                this.move.left = null;
                break;
            case 'ArrowRight':
                cancelAnimationFrame(this.move.right);
                this.move.right = null;
                break;
        }
    }
    
    moveToTop(){
        const newY = this.coordinates.y - this.speed;
        if(newY < 0){
            return;
        }
        this.coordinates.y = newY;
        this.updatePosition();
        // Продолжаем движение вверх
        this.move.top = requestAnimationFrame(() => this.moveToTop());
    }
    
    moveToBottom(){
        const newY = this.coordinates.y + this.speed;
        if(newY + this.element.clientHeight > this.roadHeight){
            return;
        }
        this.coordinates.y = newY;
        this.updatePosition();
        // Продолжаем движение вверх
        this.move.down = requestAnimationFrame(() => this.moveToBottom());
    }
    
    moveToLeft(){
        const newX = this.coordinates.x - this.speed;
        if(newX < -(this.roadWidth / 2) + (this.element.clientWidth / 2)){
            return;
        }
        this.coordinates.x = newX;
        this.updatePosition();
        // Продолжаем движение вверх
        this.move.left = requestAnimationFrame(() => this.moveToLeft());
    }
    
    moveToRight(){
        const newX = this.coordinates.x + this.speed;
        if(newX > (this.roadWidth / 2) - (this.element.clientWidth / 2)){
            return;
        }

        this.coordinates.x = newX;
        this.updatePosition();
        // Продолжаем движение вверх
        this.move.right = requestAnimationFrame(() => this.moveToRight());
    }
    
    hasCollision(other){
        const CarTOP = this.coordinates.y;
        const CarBOTTOM = this.coordinates.y + this.carHeight;
        const CarLEFT = this.coordinates.x + 10;
        const CarRIGHT = this.coordinates.x - 10 + this.carWidth; 
        
        const OtherBOTTOM = other.coordinates.y - 5 + other.element.clientWidth;
        const OtherTOP = other.coordinates.y - 5;
        const OtherLEFT = other.coordinates.x + 5;
        const OtherRIGHT = other.coordinates.x - 5 + other.element.clientWidth;

        if(CarTOP > OtherBOTTOM || CarBOTTOM < OtherTOP || CarLEFT > OtherRIGHT || CarRIGHT < OtherLEFT){
            return false;
        }
        
        return true;
    }
}

//=====================================================================================================================

class Game{
    constructor(){
        this.gameLoopAnimation = null;
        this.pause = false;
        this.status = false;
        this.backGame = document.querySelector('.back_game');
        this.gameBtn = document.querySelector('.game-btn');
        this.gameScore = document.querySelector('.score');
        this.finishScore = document.querySelector('.score_finish');
        this.finishBtn = document.querySelector('.btn-5');
        this.score = 0;
        this.speed = 4;
        this.initializeRoad();
        this.roadWidth;
        this.roadHeight;
        this.car = new Car(document.querySelector('.car'), this.speed, this.roadHeight, this.roadWidth);
        
        this.trees = []; this.houses = []; this.enemys = []; this.police = []; this.bonus = [];
        
        this.enemyWidth;
        this.roadLeftWidth;
        
        this.initializeTrees();
        this.initializeHouses();
        this.initializeEnemys();
        this.initializePolice();
        this.initializeBonus();
        
        this.setupEventListener();
        this.startGameAnimation();
    }
    
    initializeRoad(){
        const road = document.querySelector('.road');
        this.roadLeftWidth = road.clientWidth / 2;      //Вычисляем левую полосу дороги
        this.roadHeight = road.clientHeight;
        this.roadWidth = road.clientWidth;
    }
    
    initializeTrees(){
        const treeElements = document.querySelectorAll('.tree');
        
        // Создаем экземпляры класса Tree для каждого элемента
        treeElements.forEach(treeElement => {
            const tree = new Tree(treeElement, this.speed);
            this.trees.push(tree);
        });
    }
    
    initializeHouses(){
        const houseElements = document.querySelectorAll('.house');
        
        // Создаем экземпляры класса Tree для каждого элемента
        houseElements.forEach(houseElement => {
            const house = new House(houseElement, this.speed);
            this.houses.push(house);
        });
    }
    
    initializeEnemys(){
        const enemyElements = document.querySelectorAll('#enemy');
        this.enemyWidth = enemyElements.clientWidth;
        const speed = 8;
        
        // Создаем экземпляры класса Tree для каждого элемента
        enemyElements.forEach(enemyElement => {
            const enemy = new Enemy(enemyElement, speed, this.enemyWidth, this.roadLeftWidth);
            this.enemys.push(enemy);
        });
    }
    
    initializePolice(){
        const policeElements = document.querySelectorAll('.police');
        
        policeElements.forEach(policeElement => {
            const police = new Police(policeElement, this.speed);
            this.police.push(police);
        });
    }
    
    initializeBonus(){
        const bonusElements = document.querySelectorAll('.bonus');
        
        bonusElements.forEach(bonusElement => {
            const bonus = new Bonus(bonusElement, this.speed);
            this.bonus.push(bonus);
        });
    }
    
    updateEnvironment(){
        this.trees.forEach(tree => tree.Move());
        this.houses.forEach(house => house.Move());
        this.enemys.forEach(enemy => {
           enemy.Move();
            if(this.car.hasCollision(enemy)){
                this.finishScore.innerText = this.score;
                this.gameScore.style.display = 'none';
                this.gameBtn.style.display = 'none';
                cancelAnimationFrame(this.gameLoopAnimation);
                this.gameLoopAnimation = null;
                this.finishGame();
                this.status = true;
            }
        });
        this.police.forEach(police => {
            police.Move();
            if(this.car.hasCollision(police)){
                this.finishScore.innerText = this.score;
                this.gameScore.style.display = 'none';
                this.gameBtn.style.display = 'none';
                cancelAnimationFrame(this.gameLoopAnimation);
                this.gameLoopAnimation = null;
                this.finishGame();
                this.status = true;
            }
        });
        this.bonus.forEach(bonus => {
            bonus.Move();
            if(bonus.visibleBonus && this.car.hasCollision(bonus)){
                bonus.element.style.display = 'none';
                bonus.visibleBonus = false;
                this.score += 10;
                this.gameScore.innerText = this.score;
            }
        });
        
        return this.status;
    }
    
    setupEventListener(){
        this.gameBtn.addEventListener('click', () => this.togglePause());
        this.finishBtn.addEventListener('click', () => window.location.reload());
        document.addEventListener('keydown', () => this.handleKeyDown(event));
        document.addEventListener('keyup', () => this.handleKeyUp(event));
    }
    
    //Нажатие клавиши
    handleKeyDown(event){
        if(this.pause) return;
        this.car.startMove(event.code);
    }
    
    handleKeyUp(event){
        if(this.pause) return;
        this.car.stopMove(event.code);
    }
    
    togglePause(){
        this.pause = !this.pause;
        if (this.pause) {
            cancelAnimationFrame(this.gameLoopAnimation);
            this.gameBtn.children[0].style.display = 'none';
            this.gameBtn.children[1].style.display = 'initial';
        } else {
            this.startGameAnimation();
            this.gameBtn.children[0].style.display = 'initial';
            this.gameBtn.children[1].style.display = 'none';
        }
    }
    
    startGameAnimation(){
        const gameLoopAnimation = () => {
            const st = this.updateEnvironment();
            if(st){
                this.finishGame();
                return;
            }
            
            this.gameLoopAnimation = requestAnimationFrame(gameLoopAnimation);
        };
        this.gameLoopAnimation = requestAnimationFrame(gameLoopAnimation);
    }
    
    finishGame(){
       cancelAnimationFrame(this.gameLoopAnimation);
       this.gameBtn.children[0].style.display = 'none';
       this.gameBtn.children[1].style.display = 'initial';
       cancelAnimationFrame(this.car.move.top);
       cancelAnimationFrame(this.car.move.down);
       cancelAnimationFrame(this.car.move.left);
       cancelAnimationFrame(this.car.move.right);
       this.backGame.style.display = 'initial';
       this.car.speed = 0;
    }
}

const startGame = new Game();