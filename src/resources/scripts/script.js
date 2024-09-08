// Constants
const WEDDING_DATE = 'Saturday, November 23, 2024';
const WEDDING_TIME = '05:00 PM';
const RSVP_BY_DATE = 'October 1, 2024';
const BACKGROUND_MUSIC_URL = '/resources/music/bgmusic.mp3';

// Utility functions
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function generateFileName() {
    const now = new Date();
    const pad = (num, size) => num.toString().padStart(size, '0');
    const formattedDate = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}`;
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${formattedDate}-${randomChars}.json`;
}

// Vue instance
const app = new Vue({
    el: '#app',w
    data: {
        weddingDate: WEDDING_DATE,
        weddingTime: WEDDING_TIME,
        rsvpByDate: RSVP_BY_DATE,
        navLinks: [
            { text: 'Home', href: '#home' },
            { text: 'Our Story', href: '#story' },
            { text: 'Details', href: '#details' },
            { text: 'Gallery', href: '#gallery' },
            { text: 'RSVP', href: '#rsvp' },
            { text: 'Contact', href: '#contact' }
        ],
        ourStoriesImg: 'image/ourstory.jpg',
        ourStories: [
            {text:'Pada suatu ketika, di jantung kota Malaysia yang penuh kehidupan, dua jiwa dari dunia yang berbeda bertemu dengan cara yang begitu tak terduga.'},
            {text:'May, seorang wanita Vietnam yang berjiwa bebas, datang ke kota yang ramai ini mencari petualangan baru. Danny, yang berasal dari kekayaan budaya Indonesia, langsung terpikat saat mata mereka bertemu untuk pertama kalinya di sebuah pertemuan hangat bersama teman-teman dekat.'},
            {text:'Selama tiga tahun berikutnya, hubungan mereka berkembang menjadi kisah cinta yang memikat. Melalui tawa dan momen-momen indah, mereka memulai perjalanan untuk saling mengenal budaya dan tradisi masing-masing. Perbedaan mereka justru membuat ikatan semakin kuat, membentuk rangkaian kenangan yang berharga.'},
            {text:'Kemudian, di kota Bangkok yang mempesona, di bawah pandangan penuh haru dua sahabat, Danny berlutut dan melamar May, dengan hati yang penuh janji untuk selamanya. Wajah May yang berseri-seri saat ia menjawab \'ya\' menandai awal takdir baru mereka, membuka babak baru dalam kehidupan mereka.'},
            {text:'Sekarang, dengan hati yang penuh harapan, Danny dan May mengundang Anda untuk hadir dan merayakan cinta mereka. Saat mereka memulai perjalanan baru yang luar biasa ini bersama, mereka menantikan kesempatan untuk menciptakan lebih banyak kenangan indah bersama.'},
        ],
        weddingDetails: [
            { title: 'Reception', content: '05:00 PM at <a href="https://www.instagram.com/wismabentengmedan/?hl=en" target="_blank">Wisma Benteng Restaurant, Medan</a>' },
            { title: 'Dress Code', content: 'No Shorts</BR>No Slippers</BR>No White Shirt/Dress' },
            { title: 'End Time', content: 'Expected Around 10:00 PM' }
        ],
        currentYear: new Date().getFullYear(),
        galleryImages: [
              { src: 'image/L3.png', thumb: 'image/L3thumb.jpeg', alt: '' },
              { src: 'image/L9.png', thumb: 'image/L9thumb.jpeg', alt: '' },
              { src: 'image/L12.png', thumb: 'image/L12thumb.jpeg', alt: '' },
              { src: 'image/L15.png', thumb: 'image/L15thumb.jpeg', alt: '' },
              { src: 'image/L5.png', thumb: 'image/L5thumb.jpeg', alt: '' },
              { src: 'image/L18.png', thumb: 'image/L18thumb.jpeg', alt: '' },
              { src: 'image/L7.png', thumb: 'image/L7thumb.jpeg', alt: '' },
              { src: 'image/L23.png', thumb: 'image/L23thumb.jpeg', alt: '' }
        ],
        contactDetails: [
            { title: 'Groom', content: 'https://wa.me/+60173232023' },
            { title: 'Bride', content: 'https://wa.me/+60147138871' },
        ],
        lightboxOpen: false,
        currentImageIndex: 0,
        messageIndex: 0,
        messages: [],
    },
    computed: {
        countdownDays() {
            return this.calculateCountdown().days;
        },
        countdownHours() {
            return this.calculateCountdown().hours;
        },
        countdownMinutes() {
            return this.calculateCountdown().minutes;
        },
        currentImage() {
            return this.galleryImages[this.currentImageIndex];
        },
    },
    methods: {
        calculateCountdown() {
            const weddingTime = new Date(this.weddingDate + ' ' + this.weddingTime).getTime();
            const now = new Date().getTime();
            const distance = weddingTime - now;
            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            };
        },
        scrollToSection(href) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        submitRSVP() {
            console.log('RSVP submitted:', this.rsvpFields.map(field => ({ [field.id]: field.value })));
            alert('Thank you for your RSVP!');
        },
        openLightbox(index) {
            this.currentImageIndex = index;
            this.lightboxOpen = true;
        },
        closeLightbox() {
            this.lightboxOpen = false;
        },
        prevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        },
        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
        },
        writeFile(name, message) {
            const fileName = generateFileName();
            const fileContent = JSON.stringify({ name, message }, null, 2);
            fetch('writeFile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName, fileContent })
            })
            .then(response => response.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                } catch (error) {
                    console.error('Failed to parse JSON:', text);
                    alert('An error occurred while processing your request.');
                }
            });
        },
        fetchMessages() {
            fetch('readFiles.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    this.messages = data.messages;
                } else {
                    console.error('Failed to fetch messages:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
        },
        addNewMessage(name, message, currentIndex) {
            const newIndex = currentIndex + 1;
            this.messages.splice(newIndex, 0, `${name}: ${message}`);
        },
        initializeMessageContainer() {
            const messageContainer = document.getElementById('message-container');
            const showMessageButton = document.createElement('button');
            showMessageButton.id = 'show-message-button';
            showMessageButton.textContent = 'Leave a Message';
            document.body.appendChild(showMessageButton);

            showMessageButton.addEventListener('click', () => {
                messageContainer.style.display = 'block';
                showMessageButton.style.display = 'none';
            });

            messageContainer.innerHTML = `
                <div class="message-header">
                  <span class="close-button">&times;</span>
                  <h3>Leave a Message</h3>
                </div>
                <div class="message-body">
                  <input type="text" class="message-input" placeholder="Your name">
                  <textarea class="message-input" placeholder="Your message"></textarea>
                  <button class="message-submit">Send</button>
                </div>
            `;

            const closeButton = messageContainer.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                messageContainer.style.display = 'none';
                showMessageButton.style.display = 'block';
            });

            const submitButton = messageContainer.querySelector('.message-submit');
            submitButton.addEventListener('click', () => {
                const nameInput = messageContainer.querySelector('input');
                const messageInput = messageContainer.querySelector('textarea');
                const name = nameInput.value.trim();
                const message = messageInput.value.trim();

                if (name && message) {
                    this.writeFile(name, message);
                    this.addNewMessage(name, message, this.messageIndex);
                    nameInput.value = '';
                    messageInput.value = '';
                    messageContainer.style.display = 'none';
                    showMessageButton.style.display = 'block';
                    alert('Thank you for your message!');
                } else {
                    alert('Please enter both your name and a message.');
                }
            });
        },
    },
    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 60000);

        this.initializeMessageContainer();
        this.fetchMessages();
    }
});

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('loading-overlay2');
    const initialText = document.getElementById('initial-text');
    const tapText = document.getElementById('tap-text');
    const pulseCircle = document.getElementById('pulse-circle');
    const messageContainer = document.getElementById('message-popup');

    function initOverlay() {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
            });

            window.addEventListener('load', () => {
                setTimeout(() => {
                    initialText.style.transition = 'opacity 3s ease-in-out';
                    initialText.style.opacity = '0';

                    setTimeout(() => {
                        document.body.style.overflow = 'auto';
                        initialText.style.display = 'none';
                        tapText.style.display = 'block';

                        setTimeout(() => {
                            tapText.style.opacity = '1';
                            setTimeout(() => {
                                pulseCircle.style.display = 'block';
                                pulseCircle.style.opacity = '1';
                            }, 2000);
                        }, 500);
                    }, 3000);
                }, 3000);
            });

            overlay.addEventListener('click', () => {
                overlay.classList.add('loaded');
                document.body.style.overflow = 'auto';
                setTimeout(() => {
                    simulateIncomingMessage();
                }, 2000);
            });
        }
    }

    function initAOS() {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }

    function initParallax() {
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll(".section.bg-image");

        sections.forEach((section) => {
            gsap.to(section, {
                backgroundPositionY: (i, target) => {
                    if (isIOS()) {
                        var offset = 0.30 * window.innerHeight;
                        const y = (window.innerHeight * i / 2) - offset;
                        return `${y}px`;
                    } else {
                        return null;
                    }
                },
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (isIOS()) {
                            var offset = 0.30 * window.innerHeight;
                            section.style.backgroundAttachment = 'scroll';
                            const progress = self.progress;
                            const yPos = (window.innerHeight * progress / 2) - offset;
                            section.style.backgroundPosition = `center ${yPos}px`;
                        }
                    }
                }
            });
        });
    }

    function initBackgroundMusic() {
        const backgroundMusic = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.1;

        document.body.addEventListener('click', () => {
            backgroundMusic.play();
            musicToggle.innerHTML = '🔊';
        }, { once: true });

        const musicToggle = document.createElement('button');
        musicToggle.innerHTML = '🔇';
        musicToggle.style.position = 'fixed';
        musicToggle.style.bottom = '20px';
        musicToggle.style.left = '20px';
        musicToggle.style.zIndex = '1000';
        musicToggle.style.background = 'white';
        musicToggle.style.border = 'none';
        musicToggle.style.borderRadius = '50%';
        musicToggle.style.width = '40px';
        musicToggle.style.height = '40px';
        musicToggle.style.cursor = 'pointer';

        musicToggle.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicToggle.innerHTML = '🔊';
            } else {
                backgroundMusic.pause();
                musicToggle.innerHTML = '🔇';
            }
        });

        document.body.appendChild(musicToggle);
    }

    function addMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    function simulateIncomingMessage() {
        function sendNextMessage() {
            if (app.messageIndex < app.messages.length) {
                addMessage(app.messages[app.messageIndex]);
                app.messageIndex++;
            }
        }
        setInterval(sendNextMessage, Math.random() * 2000 + 1000);
    }

    // Initialize everything
    initOverlay();
    initAOS();
    initParallax();
    initBackgroundMusic();

    // Prevent scrolling while overlay is visible
    document.body.style.overflow = 'hidden';

    // Reinitialize parallax effect on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
        initParallax();
    });
});