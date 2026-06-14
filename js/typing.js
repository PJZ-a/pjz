// Typing effect: cycles through a list of identity labels in the hero section
const Typing = {
  el: null,
  phrases: ['大三学生', '自动化专业', '嵌入式爱好者', 'AI Agent 探索者'],
  index: 0,
  charIndex: 0,
  deleting: false,
  speed: 100,

  init(selector) {
    this.el = document.querySelector(selector);
    if (!this.el) return;
    this.type();
  },

  type() {
    const current = this.phrases[this.index];
    if (this.deleting) {
      this.el.textContent = current.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.el.textContent = current.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.deleting ? 40 : this.speed;

    if (!this.deleting && this.charIndex === current.length) {
      delay = 2000; // pause at end of phrase
      this.deleting = true;
    } else if (this.deleting && this.charIndex === 0) {
      this.deleting = false;
      this.index = (this.index + 1) % this.phrases.length;
      delay = 300;
    }

    setTimeout(() => this.type(), delay);
  }
};

document.addEventListener('DOMContentLoaded', () => Typing.init('#typing-text'));
