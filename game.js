var app = new Vue({
  el: '#app',
  data: {
    hitTimeStart: NaN,
    hitCell: NaN,
    hitScore: 0,
    hitInterval: null,
    isPaused: false,
    startVisible: true,
    gameVisible: false,
    messageVisible: false,
    oink: null,
    frames: [],
    shareTwitterHref: '',
    isSharing: true,
  },

  methods: {
    startGame() {
      this.startVisible = false;
      this.gameVisible = true;
      this.hitTimeStart = 24;
      this.hitScore = 0;

      this.imageNormis();
      this.hitTimer();
    },

    imageNormis() {
      this.frames = [];
      const count = 24;
      for (let index = 0; index < count; index++) {

        this.frames.push({
          isNormis: false,
          isSlapped: false,
        })
      }
      this.setHitCell();

      if (!this.isPaused) {
        this.hitInterval = setInterval(() => {
          this.setHitCell()
        }, 1500);
      }
    },

    hit(frame) {

      if (frame.isNormis) {
        this.hitScore++;
        frame.isSlapped = true;

        this.oink.play();

        setTimeout(() => {
          this.setHitCell();
        }, 500);

      } else {
        this.setHitCell();
      }
    },

    // highlight random grid cell
    setHitCell() {
      const min = 0;
      const max = 23;
      const value = Math.floor(Math.random() * (max - min)) + min;

      if (!isNaN(this.hitCell)) {
        this.frames[this.hitCell].isNormis = false
        this.frames[this.hitCell].isSlapped = false
      }
      this.hitCell = value;
      this.frames[value].isNormis = true;
    },
    //set countdown
    hitTimer() {
      if (this.isPaused) return;

      if (this.hitTimeStart > 0) {
        setTimeout(() => {
          this.hitTimeStart -= 1
          this.hitTimer()
        }, 1000)
      } else {
        clearInterval(this.hitInterval);
        this.showSuccess();
      }
    },
    showSuccess() {
      this.gameVisible = false;
      this.messageVisible = true;

      this.generateShareText();
    },
    restartGame() {
      this.messageVisible = false;
      this.startGame()
    },
    generateShareText() {
      const text = `Šodien palīdzēju noķert veselas ${this.hitScore} reizes Ruksi Normi! Tas gan ir viens reāls sivēns! `;

      this.shareTwitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent("about:blank")}&text=${encodeURIComponent(text)}&hashtags=Lauki,Ruksisnormis`;
    }
  },
  mounted: function () {
    this.oink = new Audio("assets/pig-oink.mp3");
  }
})