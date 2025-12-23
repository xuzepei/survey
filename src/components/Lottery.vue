<template>
    <div class="page-bg">
        <div class="main_container">

            <!-- 🎁 Gift 背景装饰 -->
            <div class="gift-bg">
                <img v-for="(gift, index) in gifts" :key="index" :src="gift.src" class="gift-item" :class="gift.class"
                    :style="gift.style" />
            </div>

            <div class="content_card">
                <h3 class="title">🎉 Lucky Spin 🎉</h3>
                <div class="email">Participant: {{ email }}</div>

                <div class="wheel-outer-container">
                    <div class="wheel-wrapper">
                        <div class="pointer"></div>

                        <svg class="wheel" viewBox="0 0 500 500" :style="{ transform: `rotate(${rotateDeg}deg)` }">
                            <g transform="translate(250,250)">
                                <template v-for="(slice, index) in slices">
                                    <path :key="'path-' + index" :d="slice.path" :fill="slice.color" stroke="#ffffff"
                                        stroke-width="0" />
                                    <text :key="'text-' + index" :transform="slice.textTransform" fill="#fff"
                                        font-size="26" font-weight="bold" text-anchor="middle"
                                        dominant-baseline="middle">
                                        {{ slice.text }}
                                    </text>
                                </template>
                                <circle cx="0" cy="0" r="10" fill="#fff" />
                            </g>
                        </svg>
                    </div>
                </div>

                <div class="actions">

                    <!-- 🎁 gifts 相对于 actions -->
                    <img src="@/assets/images/gift_1.png" class="gift-item gift-actions-1" />
                    <img src="@/assets/images/gift_2.png" class="gift-item gift-actions-2" />


                    <button type="primary" class="submit_btn" :disabled="isSpinning || hasDrawn" @click="spin">
                        {{ hasDrawn ? 'Already Played' : isSpinning ? 'Spinning...' : 'Spin Now' }}
                    </button>
                </div>

                <transition name="pop">
                    <div v-if="result" class="result-overlay">
                        <div class="confetti-wrapper">
                            <div v-for="n in 50" :key="n" class="confetti-piece" :style="generateConfetti(n)"></div>
                        </div>

                        <div class="result_card">
                            <div class="win-banner">GOOD LUCK</div>
                            <div class="result-label">CONGRATULATIONS!</div>
                            <div class="result-text">{{ result }}</div>
                            <button class="close-btn" @click="result = ''">COLLECT NOW</button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            gifts: [
                // {
                //     src: require('@/assets/images/gift_1.png'),
                //     style: { bottom: '220px', left: '30px', width: '67px', animationDelay: '2.5s' }
                // },
                // {
                //     src: require('@/assets/images/gift_2.png'),
                //     style: { top: '530px', right: '10px', width: '85px', animationDelay: '1s' }
                // },
                {
                    src: require('@/assets/images/gift_4.png'),
                    class: 'gift-swing-only',
                    style: { top: '180px', left: '40px', width: '77px'}
                },
                {
                    src: require('@/assets/images/gift_6.png'),
                    class: 'gift-swing-2',
                    style: { top: '160px', right: '40px', width: '55px', animationDelay: '1s' }
                }
            ],
            email: '',
            rotateDeg: 0,
            isSpinning: false,
            result: '',
            hasDrawn: false,
            prizes: [
                { text: 'First Prize 🎉', percent: 10, color: '#FF6B6B' },
                { text: 'Second Prize 🎁', percent: 20, color: '#FFD93D' },
                { text: 'Third Prize 🎈', percent: 30, color: '#6BCB77' },
                { text: 'Fourth Prize 🙂', percent: 40, color: '#4D96FF' }
            ]
        }
    },

    computed: {
        slices() {
            let startAngle = 0
            const radius = 250

            return this.prizes.map(p => {
                const angle = (p.percent / 100) * 360
                const endAngle = startAngle + angle
                const largeArc = angle > 180 ? 1 : 0
                const x1 = radius * Math.cos((startAngle * Math.PI) / 180)
                const y1 = radius * Math.sin((startAngle * Math.PI) / 180)
                const x2 = radius * Math.cos((endAngle * Math.PI) / 180)
                const y2 = radius * Math.sin((endAngle * Math.PI) / 180)
                const mid = startAngle + angle / 2
                const textRadius = radius - 110

                const slice = {
                    text: p.text,
                    color: p.color,
                    start: startAngle,
                    end: endAngle,
                    path: `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
                    textTransform: `rotate(${mid}) translate(${textRadius}, 0)`
                }
                startAngle = endAngle
                return slice
            })
        }
    },

    created() {
        this.email = localStorage.getItem('survey_email') || 'Guest'
        const record = localStorage.getItem(`lottery_${this.email}`)
        if (record) {
            this.result = record
            this.hasDrawn = true
        }
    },

    methods: {
        spin() {
            if (this.isSpinning || this.hasDrawn) return
            
            this.isSpinning = true
            this.result = ''

            const rand = Math.random() * 100
            let sum = 0
            let prizeIndex = 0
            for (let i = 0; i < this.prizes.length; i++) {
                sum += this.prizes[i].percent
                if (rand <= sum) {
                    prizeIndex = i
                    break
                }
            }

            const prizeAngles = this.prizes.map(p => p.percent * 3.6)
            const angleBefore = prizeAngles.slice(0, prizeIndex).reduce((s, a) => s + a, 0)
            const prizeCenter = angleBefore + (prizeAngles[prizeIndex] / 2)

            const baseRounds = 360 * 8
            const targetAngle = baseRounds + (360 - prizeCenter) - 90
            this.rotateDeg += (targetAngle - (this.rotateDeg % 360))

            setTimeout(() => {
                this.result = this.prizes[prizeIndex].text
                this.isSpinning = false
                this.hasDrawn = true
                localStorage.setItem(`lottery_${this.email}`, this.result)
            }, 3000)
        },

        // 生成纸屑的随机样式
        generateConfetti(i) {
            const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22'];
            const left = Math.random() * 100 + 'vw';
            const delay = Math.random() * 3 + 's';
            const color = colors[Math.floor(Math.random() * colors.length)];
            return {
                left: left,
                backgroundColor: color,
                animationDelay: delay,
                opacity: Math.random() + 0.5
            };
        }
    }
}
</script>

<style scoped>

.page-bg {
    min-height: 100vh;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    /* 水平居中 main_container */
}

/* 基础背景设置 */
.main_container {
    width: 100%;          /* ⭐ 核心 */
    max-width: 600px;
    min-width: 300px;
    padding: 20px;
    background-color: transparent;

    position: relative;
    /* ⭐ 关键 */
    overflow: hidden;
    /* ⭐ 防止 gift 溢出 */
}

/* 🎁 Gift 背景层 */
.gift-bg {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;              /* ⭐ 固定设计宽度 */
    height: 100%;
    transform: translateX(-50%);

    pointer-events: none;
    z-index: 0;
}

/* 单个 gift */
.gift-item {
    position: absolute;
    opacity: 1.0;
    filter: blur(0.5px);
    animation: gift-float 6s ease-in-out infinite;
}

/* gift_4：左右摇摆，覆盖默认动画 */
.gift-swing-only {
    animation: gift-swing 3s ease-in-out infinite !important;
    transform-origin: center center; /* 像挂着一样晃 */
}

.gift-swing-2 {
    animation: gift-swing 1s ease-in-out infinite !important;
    transform-origin: center center; /* 像挂着一样晃 */
}

/* 浮动动画 */
@keyframes gift-float {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(6deg);
    }
    100% {
        transform: translateY(0) rotate(0deg);
    }
}

@keyframes gift-swing {
    0% {
        transform: rotate(-8deg);
    }
    50% {
        transform: rotate(8deg);
    }
    100% {
        transform: rotate(-8deg);
    }
}

.gift-actions-1 {
    position: absolute;
    left: -10px;
    top: -70px;
    width: 70px;
    animation: gift-float 6s ease-in-out infinite;
}

.gift-actions-2 {
    position: absolute;
    right: -25px;
    top: -70px;
    width: 80px;
    animation: gift-float 5s ease-in-out infinite;
}

.content_card {
    position: relative;
    z-index: 2;
    text-align: center;
}

.title {
    background: linear-gradient(45deg, #f39c12, #e74c3c);
    scale: 1.9;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
}

.email {
    color: black;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 100px;
}

/* 核心：响应式转盘容器 */
.wheel-outer-container {
    width: 100%;
    max-width: 500px;
    /* PC端最大尺寸 */
    aspect-ratio: 1 / 1;
    /* 保持正方形 */
    margin: 0 auto;
    position: relative;
}

.wheel-wrapper {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    border: 6px solid #ffffff;
    box-sizing: border-box;
    position: relative;
}

.wheel {
    width: 100%;
    height: 100%;
    transition: transform 3s cubic-bezier(0.15, 0, 0.15, 1);
}

.pointer {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 35px solid #e74c3c;
    filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.2));
}

/* 按钮样式 */
.actions {
    margin-top: 80px;
    text-align: center;
    position: relative; /* ⭐ 关键 */
}

.submit_btn {
    width: 100%;
    max-width: 280px;
    font-size: 20px;
    height: 54px;
    border-radius: 27px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    border: none;
    font-weight: bold;
    color: white;
}

.submit_btn:disabled {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: #ffffff;
    cursor: not-allowed;
    opacity: 0.7;
}

/* 结果卡片 */
.result_card {
    margin-top: 30px;
    padding: 15px;
    background: #fff5f5;
    border-radius: 12px;
    border: 1px solid #ffe3e3;
}

.result-label {
    font-size: 12px;
    color: #e74c3c;
    letter-spacing: 1px;
}

.result-text {
    font-size: 22px;
    font-weight: bold;
    color: #c0392b;
}

/* 移动端适配：屏幕宽度小于 600px */
@media (max-width: 600px) {
    .content_card {
        padding: 20px 15px;
        border-radius: 0;
        /* 手机端全屏感 */
        box-shadow: none;
        background: transparent;
    }

    .title {
        font-size: 24px;
    }

    .wheel-outer-container {
        max-width: 90vw;
        /* 占据屏幕宽度的90% */
    }

    .pointer {
        top: -10px;
        border-top-width: 30px;
        border-left-width: 12px;
        border-right-width: 12px;
    }
}

/* 弹出动画 */
.pop-enter-active {
    animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* 🎊 中奖遮罩层 & 五彩纸屑 */
.result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
}

.result_card {
    background: linear-gradient(135deg, #ffffff 0%, #fff8dc 100%);
    border: 6px solid #FFD700;
    padding: 50px 40px;
    border-radius: 30px;
    text-align: center;
    position: relative;
    box-shadow: 0 0 60px rgba(255, 215, 0, 0.6);
    z-index: 1001;
}

.win-banner {
    background: #E74C3C;
    color: white;
    padding: 5px 20px;
    border-radius: 5px;
    font-size: 14px;
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
}

.result-label {
    font-size: 16px;
    color: #B8860B;
    margin-bottom: 10px;
    letter-spacing: 2px;
}

.result-text {
    font-size: 32px;
    font-weight: 900;
    color: #E74C3C;
    margin-bottom: 30px;
}

.close-btn {
    background: #27AE60;
    color: white;
    border: none;
    width: 180px;
    height: 40px;
    font-weight: bold;
    border-radius: 40px;
    cursor: pointer;
    box-shadow: 0 4px 0 #1E8449;
    text-align: center;
    font-size: 14px;
}

/* 纸屑动画 */
.confetti-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
}

.confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    top: -10px;
    animation: fall 3s linear infinite;
}

@keyframes fall {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    100% {
        transform: translateY(100vh) rotate(720deg);
    }
}

.pop-enter-active {
    animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>