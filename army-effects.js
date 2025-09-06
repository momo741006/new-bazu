/**
 * 軍團特效系統 - Army Effects System
 * 負責處理軍團相關的視覺特效和動畫
 */
class ArmyEffects {
    constructor() {
        this.isTyping = false;
    }

    /**
     * 打字機效果 - 逐字顯示文本
     * @param {HTMLElement} element - 目標元素
     * @param {string} text - 要顯示的文本
     * @param {number} speed - 打字速度 (毫秒)
     */
    typewriterEffect(element, text, speed = 50) {
        if (!element || !text) return;
        
        // 清空元素內容
        element.textContent = '';
        element.style.opacity = '1';
        
        let index = 0;
        this.isTyping = true;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                
                // 添加閃爍游標效果
                if (!element.classList.contains('typing')) {
                    element.classList.add('typing');
                }
            } else {
                // 打字完成
                clearInterval(typeInterval);
                this.isTyping = false;
                element.classList.remove('typing');
            }
        }, speed);
        
        return typeInterval;
    }

    /**
     * 軍團卡片進入動畫
     * @param {HTMLElement} card - 軍團卡片元素
     * @param {number} delay - 延遲時間
     */
    animateArmyCard(card, delay = 0) {
        if (!card) return;
        
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, delay);
    }

    /**
     * 粒子爆炸效果
     * @param {HTMLElement} element - 觸發元素
     */
    createParticleExplosion(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${centerX}px;
                top: ${centerY}px;
                opacity: 1;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i * 360 / 12) * Math.PI / 180;
            const distance = 80 + Math.random() * 40;
            const duration = 800 + Math.random() * 400;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    /**
     * 螢光脈衝效果
     * @param {HTMLElement} element - 目標元素
     * @param {string} color - 螢光顏色
     */
    glowPulse(element, color = '#00ffff') {
        if (!element) return;
        
        element.style.animation = 'none';
        element.offsetHeight; // 觸發重排
        element.style.animation = `glow-pulse 2s ease-in-out infinite`;
        element.style.setProperty('--glow-color', color);
    }

    /**
     * 停止所有正在進行的動畫
     */
    stopAllAnimations() {
        this.isTyping = false;
        
        // 移除所有爆炸粒子
        const particles = document.querySelectorAll('.explosion-particle');
        particles.forEach(particle => particle.remove());
        
        // 停止打字機效果
        const typingElements = document.querySelectorAll('.typing');
        typingElements.forEach(element => element.classList.remove('typing'));
    }
}

// 添加必要的 CSS 樣式
if (!document.getElementById('army-effects-styles')) {
    const style = document.createElement('style');
    style.id = 'army-effects-styles';
    style.textContent = `
        .typing::after {
            content: '|';
            animation: blink 1s infinite;
            color: #00ffff;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        @keyframes glow-pulse {
            0%, 100% {
                box-shadow: 0 0 5px var(--glow-color, #00ffff),
                            0 0 10px var(--glow-color, #00ffff),
                            0 0 15px var(--glow-color, #00ffff);
            }
            50% {
                box-shadow: 0 0 10px var(--glow-color, #00ffff),
                            0 0 20px var(--glow-color, #00ffff),
                            0 0 30px var(--glow-color, #00ffff);
            }
        }
        
        .explosion-particle {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);
}