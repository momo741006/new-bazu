// 四時軍團特效類
class ArmyEffects {
    constructor() {
        this.isTyping = false;
    }
    
    // 打字機效果
    typewriterEffect(element, text, speed = 50) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                this.isTyping = false;
            }
        }, speed);
    }
    
    // 獲取隨機螢光色
    getRandomNeonColor() {
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff8000', '#8000ff', '#0080ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 粒子效果（簡化版）
    createParticleEffect(container) {
        // 簡化的粒子效果實現
        if (!container) return;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: ${this.getRandomNeonColor()};
                pointer-events: none;
                border-radius: 50%;
                opacity: 0.8;
            `;
            
            container.appendChild(particle);
            
            // 簡單動畫
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
}