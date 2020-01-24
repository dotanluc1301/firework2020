const WIDTH = window.innerWidth-20 ;
const HEIGHT = window.innerHeight-20;
const NUMBER_OF_PARTICLES = 15;
const PARTICLE_SIZE = 7;
const PARTICLE_CHANGE_SIZE_SPEED  = 0.05;
const PARTICLE_CHANGE_SPEED  = 0.5;
const PARTICLE_MIN_SPEED  =6;
const GRAVITY = 0.15;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;

class Particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.deg = deg;
        this.ctx = this.bullet.ctx;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 10 + PARTICLE_MIN_SPEED;
        this.color = this.bullet.color;
        this.speedX = 0;
        this.speedY = -10;
        this.fallSpeed = 0;

        this.dots = []
    }

    update() {
        //thay đổi kích thước của hạt nếu kích thước của hạt > PARTICLE_CHANGE_SIZE_SPEED
        if (this.size > PARTICLE_CHANGE_SIZE_SPEED )
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        // tạo ra đuôi của hạt nếu size của hạt > 0
        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 0.6,
                size: this.size
            });
        }
        //thay đổi tốc độ các hạt con
        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });
        //lọc ra các đuôi nào có kích thước lớn hơn 0
        this.dots = this.dots.filter(dot => dot.size > 0 );

        if (this.dots.length == 0 ) {
            this.remove();
        }
        //thay đổi tốc dộ của particle mỗi lần di chuyển
        if (this.speed > PARTICLE_CHANGE_SPEED) {
            this.speed -= PARTICLE_CHANGE_SPEED;
        }
        //thay đổi tốc độ của hạt, =0 nếu <0
        if (this.speed < 0) {
            this.speed = 0;
        }
        //thay đổi tốc độ khi rơi
        this.fallSpeed += GRAVITY;
        //thay đổi tốc độ theo x và y tại vị trí bullet nổ
        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;
        //cập nhật lại vị trí của hạt khi bay
        this.x += this.speedX;
        this.y += this.speedY;
    }
    //vẽ ra các hạt con
    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = `rgba(${this.color}, ${dot.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();            
        });
    }
    //xóa bản thân hạt trong mảng tại vị trí hiện tại ,số lượng là 1
    remove() {
        this.bullet.particles.splice( this.bullet.particles.indexOf(this), 1);
    }
}

class Bullet{
    constructor(firework) {
        this.firework = firework;
        this.ctx = firework.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT * 3/4;
        this.color =  Math.floor(Math.random() * 155)+100 + ',' + Math.floor(Math.random() * 155)+100 + ',' + Math.floor(Math.random() * 155)+100;
        
        this.particles = [];

        const deg = 2 * Math.PI / NUMBER_OF_PARTICLES;
        for (let index = 0; index < NUMBER_OF_PARTICLES; index++) {
            this.particles.push(new Particle(this, deg * index));
        }
    }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }
    //xóa bản thân bullet trong mảng hiện tại, số lượng là 1
    remove() {
        this.firework.bullets.splice(this.firework.bullets.indexOf(this), 1);
    }
}

class firework {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);
        this.bullets = [];
        this.textX = 0;
        this.textY = 50;
        this.direction = 1;
        // tăng/giảm thông số thứ 2 để tăng/giảm tốc độ tạo hạt
        setInterval(() => {
            this.bullets.push(new Bullet(this));
        }, 500);

        this.loop();
    }

    loop() {
        this.bullets.forEach( bullet => bullet.update());
        this.textX += 2 * this.direction;
        if (this.textX > WIDTH - 300) {
            this.direction = -1;
        } else if (this.textX <= 10) {
            this.direction = 1
        } else {
        }
        
        
        this.draw();
        setTimeout( () => this.loop(), 20);
    }

    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0,0,WIDTH, HEIGHT);
    }

    draw() {
        this.clearScreen();
        //this.ctx.fillStyle = "#FFF";
        // Create gradient
        var grd = this.ctx.createLinearGradient(0,0,WIDTH,0);
        grd.addColorStop(0,"red");
        grd.addColorStop(0.5,"yellow");
        grd.addColorStop(1,"green");
        this.ctx.fillStyle = grd;
        this.ctx.font = "25px Arial";
        this.ctx.fillText("HAPPY NEW YEAR",WIDTH/12, HEIGHT/2);
        //this.ctx.fillText("NEW",WIDTH/6, HEIGHT/2);
        //this.ctx.fillText("YEAR",WIDTH/6, HEIGHT/2);
        this.bullets.forEach(bullet => bullet.draw());
    }
}

var f = new firework();