const app = Vue.createApp({
    data() {
        return {
            imagesLoaded: 4,
            totalImages: 121,
            selectedImage: null,
            selectedImageIndex: null,
            imageModal: null,
            isScrolled: false,
            activeSection: 'domu',
            currentSlide: 1,
            slideInterval: null,
            activeService: null,
            isLoading: false
        }
    },
    computed: {
        allImagesLoaded() {
            return this.imagesLoaded >= this.totalImages;
        }
    },
    methods: {
        loadMore() {
            this.isLoading = true;
            setTimeout(() => {
                const nextBatch = Math.min(4, this.totalImages - this.imagesLoaded);
                this.imagesLoaded += nextBatch;
                this.isLoading = false;
            }, 800);
        },
        openImage(index) {
            this.selectedImage = `images/work/img${index}.jpg`;
            this.selectedImageIndex = index;
            this.imageModal.show();
        },
        showPrevImage() {
            if (this.selectedImageIndex > 1) {
                this.selectedImageIndex--;
                this.selectedImage = `images/work/img${this.selectedImageIndex}.jpg`;
            }
        },
        showNextImage() {
            if (this.selectedImageIndex < this.totalImages) {
                this.selectedImageIndex++;
                this.selectedImage = `images/work/img${this.selectedImageIndex}.jpg`;
            }
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                // Zde můžete přidat notifikaci o úspěšném zkopírování
                alert('Zkopírováno do schránky');
            }).catch(err => {
                console.error('Chyba při kopírování:', err);
            });
        },
        updateActiveSection() {
            const sections = ['domu', 'sluzby', 'galerie', 'kontakt'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const elementTop = element.offsetTop;
                    const elementBottom = elementTop + element.offsetHeight;
                    
                    if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                        this.activeSection = section;
                        break;
                    }
                }
            }
        },
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
            this.updateActiveSection();
        },
        startSlideshow() {
            this.slideInterval = setInterval(() => {
                this.currentSlide = this.currentSlide % 2 + 1;
            }, 5000);
        }
    },
    mounted() {
        this.imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        
        this.startSlideshow();
        
        window.addEventListener('scroll', this.handleScroll);
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll);
        
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
});

app.mount('#app');