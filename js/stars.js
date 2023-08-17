class Stars {

    canvas = {
        domId: 'stars-canvas',
        el: null,
        context: null,
        width: 0,
        height: 0
    };

    form = {
        domId: 'stars-form',
        el: null,
        inputCount: null,
        inputSpeed: null,
        inputFrequency: null,
        buttonDestroy: null
    };

    color = {
        background: '#222'
    };

    stars = {
        go: false,
        depth: 1000,
        count: 100,
        minCount: 10,
        maxCount: 1000,
        speed: 5,
        minSpeed: 1,
        maxSpeed: 20,
        i: 0,
        list: []
    };

    words = {
        go: false,
        frequency: 0.01,
        maxFrequency: 0.1,
        minFrequency: 0.001,
        list: ['WORLD', 'LABOR', 'MAY', 'SKY', 'STARS', 'INFINITY'],
        letters: {
            'A': "00100" +
                "01010" +
                "10001" +
                "11111" +
                "10001",
            'B': "11110" +
                "10001" +
                "11110" +
                "10001" +
                "11110",
            'C': '01111' +
                '10000' +
                '10000' +
                '10000' +
                '01111',
            'D': '11110' +
                '10001' +
                '10001' +
                '10001' +
                '11110',
            'E': '11111' +
                '10000' +
                '11111' +
                '10000' +
                '11111',
            'F': '11111' +
                '10000' +
                '11110' +
                '10000' +
                '10000',
            'G': '01111' +
                '10000' +
                '10011' +
                '10001' +
                '01110',
            'H': '10001' +
                '10001' +
                '11111' +
                '10001' +
                '10001',
            'I': '01110' +
                '00100' +
                '00100' +
                '00100' +
                '01110',
            'J': '00111' +
                '00010' +
                '00010' +
                '10010' +
                '01100',
            'K': '10001' +
                '10010' +
                '11100' +
                '10010' +
                '10001',
            'L': '10000' +
                '10000' +
                '10000' +
                '10000' +
                '11111',
            'M': '10001' +
                '11011' +
                '10101' +
                '10001' +
                '10001',
            'N': '10001' +
                '11001' +
                '10101' +
                '10011' +
                '10001',
            'O': '01110' +
                '10001' +
                '10001' +
                '10001' +
                '01110',
            'P': '11110' +
                '10001' +
                '10001' +
                '11110' +
                '10000',
            'Q': '01110' +
                '10001' +
                '10001' +
                '10101' +
                '01111',
            'R': '11110' +
                '10001' +
                '11110' +
                '10010' +
                '10001',
            'S': '01111' +
                '10000' +
                '01110' +
                '00001' +
                '11110',
            'T': '11111' +
                '00100' +
                '00100' +
                '00100' +
                '00100',
            'U': '10001' +
                '10001' +
                '10001' +
                '10001' +
                '01110',
            'V': '10001' +
                '10001' +
                '10001' +
                '01010' +
                '00100',
            'W': '10001' +
                '10001' +
                '10101' +
                '10101' +
                '01010',
            'X': '10001' +
                '01010' +
                '00100' +
                '01010' +
                '10001',
            'Y': '10001' +
                '01010' +
                '00100' +
                '00100' +
                '00100',
            'Z': '11111' +
                '00010' +
                '00100' +
                '01000' +
                '11111'
        },
        letterWidthInStars: 5,
        spaceWidthInStars: 2,
        letterHeightInStars: 5,
        letterScaleK: 0.005
    };

    interval = null;
    intervalTimeout = 20;

    constructor() {
        this.createCanvas();
        this.createForm();

        this.start();
    }

    destroy() {
        this.stop();
        clearInterval(this.interval);
        this.form.el.remove();
        this.canvas.el.remove();
    }

    createCanvas() {
        let canvas = document.getElementById(this.canvas.domId);
        if (canvas) {
            return;
        }
        canvas = document.createElement('canvas');
        canvas.id = this.canvas.domId;
        canvas.className = 'stars-canvas';
        document.body.appendChild(canvas);
        this.canvas.el = canvas;
        this.canvas.context = canvas.getContext('2d');

        this.setCanvasSize();
        this.onWindowResize();

        this.clearCanvas();
    }

    createForm() {
        let form = document.getElementById(this.form.domId);
        if (form) {
            return;
        }

        form = document.createElement('div');
        form.id = this.form.domId;
        form.className = 'stars-form';
        document.body.appendChild(form);
        this.form.el = form;

        this.form.inputCount = document.createElement('input');
        this.form.inputCount.type = 'number';
        this.form.inputCount.value = this.stars.count;
        this.form.inputCount.min = this.stars.minCount;
        this.form.inputCount.max = this.stars.maxCount;
        this.form.inputSpeed = document.createElement('input');
        this.form.inputSpeed.type = 'number';
        this.form.inputSpeed.value = this.stars.speed;
        this.form.inputSpeed.min = this.stars.minSpeed;
        this.form.inputSpeed.max = this.stars.maxSpeed;
        this.form.inputFrequency = document.createElement('input');
        this.form.inputFrequency.type = 'number';
        this.form.inputFrequency.value = this.words.frequency;
        this.form.inputFrequency.min = this.words.minFrequency;
        this.form.inputFrequency.max = this.words.maxFrequency;
        this.form.inputFrequency.step = this.words.minFrequency;
        this.form.buttonDestroy = document.createElement('button');
        this.form.buttonDestroy.innerHTML = 'OK';

        form.innerHTML = '<div class="count">Количество (' + this.stars.minCount + ' - ' + this.stars.maxCount + '):<br></div>' +
            '<div class="speed">Скорость (' + this.stars.minSpeed + ' - ' + this.stars.maxSpeed + '):<br></div>' +
            '<div class="frequency">Частота слов (' + this.words.minFrequency + ' - ' + this.words.maxFrequency + '):<br></div>' +
            '<div class="destroy">Уничтожить:<br></div>';
        form.querySelector('.count').appendChild(this.form.inputCount);
        form.querySelector('.speed').appendChild(this.form.inputSpeed);
        form.querySelector('.frequency').appendChild(this.form.inputFrequency);
        form.querySelector('.destroy').appendChild(this.form.buttonDestroy);

        this.listenFormInputs();
    }

    start() {
        this.stars.go = true;
        this.words.go = true;
        if (this.interval === null) {
            this.setInterval();
        }
    }

    stop() {
        this.stars.go = false;
        this.words.go = false;
    }

    step() {
        if (this.stars.go) {
            this.createNewStars();
        }
        if (this.words.go) {
            this.createNewWords();
        }

        this.moveStars();
    }

    createNewStars() {
        let threshold = Math.abs(this.stars.depth / this.stars.speed / this.stars.count);

        this.stars.i++;
        while (this.stars.i > threshold) {
            this.stars.i -= threshold;
            this.createStar();
        }
    }

    createNewWords() {
        if (Math.random() >= this.words.frequency) {
            return;
        }

        this.putWord(this.getWordIndexRandom());
    }

    moveStars() {
        let starsList = [];

        this.clearCanvas();

        for (let i = this.stars.list.length - 1; i >= 0; i--) {
            let star = this.stars.list[i];
            star[2] -= this.stars.speed;
            if (star[2] > 0) {
                let position = this.calculateStarPosition(star);
                let x = position[0];
                let y = position[1];
                let z = position[2];
                if (x >= 0 && y >= 0 && x <= this.canvas.width && y <= this.canvas.height) {
                    this.drawStar(x, y, z, star[3]);
                    starsList.unshift(star);
                }
            }
        }
        this.stars.list = starsList;
    }

    listenFormInputs() {
        this.form.inputCount.addEventListener('input', (inputEvent) => {
            this.onInputCount(inputEvent);
        });
        this.form.inputSpeed.addEventListener('input', (inputEvent) => {
            this.onInputSpeed(inputEvent);
        });
        this.form.inputFrequency.addEventListener('input', (inputEvent) => {
            this.onInputFrequency(inputEvent);
        });
        this.form.buttonDestroy.addEventListener('click', () => {
            this.onClickDestroy();
        });
    }

    onInputCount(inputEvent) {
        let value = parseInt(inputEvent.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        if (value < this.stars.minCount) {
            value = this.stars.minCount;
        }
        if (value > this.stars.maxCount) {
            value = this.stars.maxCount;
        }
        this.stars.count = value;
    }

    onInputSpeed(inputEvent) {
        let value = parseInt(inputEvent.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        if (value < this.stars.minSpeed) {
            value = this.stars.minSpeed;
        }
        if (value > this.stars.maxSpeed) {
            value = this.stars.maxSpeed;
        }
        this.stars.speed = value;
    }

    onInputFrequency(inputEvent) {
        let value = parseFloat(inputEvent.target.value);
        if (isNaN(value)) {
            return;
        }
        if (value < this.words.minFrequency) {
            value = this.words.minFrequency;
        }
        if (value > this.words.maxFrequency) {
            value = this.words.maxFrequency;
        }
        this.words.frequency = value;
    }

    onClickDestroy() {
        this.destroy();
    }

    setCanvasSize() {
        this.canvas.width = this.canvas.el.width = document.body.clientWidth;
        this.canvas.height = this.canvas.el.height = document.body.clientHeight;
    }

    onWindowResize() {
        window.addEventListener('resize', () => {
            this.setCanvasSize();
        });
    }

    clearCanvas() {
        this.canvas.context.fillStyle = this.color.background;
        this.canvas.context.fillRect(0, 0, this.canvas.el.width, this.canvas.el.height);
    }

    setInterval() {
        this.interval = setInterval(() => {
            window.requestAnimationFrame(() => {
                this.step();
            });
        }, this.intervalTimeout);
    }

    createStar(offsetX = Stars.getXYOffsetRandom(), offsetY = Stars.getXYOffsetRandom(), color = Stars.getStarColorRandom()) {
        let star = [
            offsetX,
            offsetY,
            this.stars.depth,
            color
        ];
        this.stars.list.push(star);
    }

    static getXYOffsetRandom() {
        return Math.random() * 2 - 1
    }

    static getStarColorRandom() {
        return 'rgb(' + Math.round(128 + Math.random() * 128 - 0.5) + ', ' + Math.round(128 + Math.random() * 128 - 0.5) + ', ' + Math.round(128 + Math.random() * 128 - 0.5) + ')';
    }

    calculateStarPosition(star) {
        let halfWidth = this.canvas.width / 2;
        let halfHeight = this.canvas.height / 2;
        let halfMin = Math.min(halfWidth, halfHeight);
        let z = this.stars.depth / star[2];
        let x = halfWidth + star[0] * halfMin * z;
        let y = halfHeight + star[1] * halfMin * z;
        return [x, y, z];
    }

    drawStar(x, y, z, color) {
        this.canvas.context.fillStyle = color;
        this.canvas.context.beginPath();
        this.canvas.context.arc(x, y, z / 2, 0, 2 * Math.PI);
        this.canvas.context.fill();
    }

    getWordIndexRandom() {
        let wordsCount = this.words.list.length;
        return Math.round(Math.random() * wordsCount - 0.5);
    }

    putWord(wordIndex) {
        let wordLetters = this.words.list[wordIndex];
        if (!wordLetters) {
            return;
        }
        let offsetX = Stars.getXYOffsetRandom();
        let offsetY = Stars.getXYOffsetRandom();
        let wordColor = Stars.getStarColorRandom();

        let starFieldWidth = (this.words.letterWidthInStars + this.words.spaceWidthInStars) * wordLetters.length;
        for (let letterIndex = 0; letterIndex < wordLetters.length; letterIndex++) {
            let wordLetter = wordLetters[letterIndex];
            this.putLetter(
                wordLetter,
                (-starFieldWidth / 2 + letterIndex * (this.words.letterWidthInStars + this.words.spaceWidthInStars)) * this.words.letterScaleK + offsetX,
                (-this.words.letterHeightInStars / 2) * this.words.letterScaleK + offsetY,
                wordColor
            );
        }
    }

    putLetter(letterName, offsetX, offsetY, wordColor) {
        let letterData = this.words.letters[letterName];
        if (!letterData) {
            return;
        }
        for (let i = 0; i < letterData.length; i++) {
            if (letterData[i] === '1') {
                let x = i % this.words.letterWidthInStars;
                let y = Math.floor(i / this.words.letterWidthInStars);
                this.createStar(
                    offsetX + x * this.words.letterScaleK,
                    offsetY + y * this.words.letterScaleK,
                    wordColor
                );
            }
        }
    }

}
