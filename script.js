// Vue aplikace
const { createApp, ref, onMounted, onBeforeUnmount, computed } = Vue;

const app = createApp({
    setup() {
        // Stav scrollování pro header
        const isScrolled = ref(false);
        const activeSection = ref('');
        
        // Mobilní menu
        const mobileMenuActive = ref(false);
        
        // Galerie
        const galleryActive = ref(false);
        const totalImages = 121; // Celkový počet obrázků
        
        // Univerzální modální okno
        const modalActive = ref(false);
        const modalData = ref({
            type: null,
            title: '',
            subtitle: '',
            description: '',
            icon: '',
            // Další vlastnosti budou přidány podle typu modálu
        });
        const currentModalImageIndex = ref(0);
        

        // Projekty
        const projects = ref([
            {
                id: 1,
                title: "Rekonstrukce koupelny",
                client: "Rodina Novákových",
                location: "Praha 5",
                date: "Duben 2023",
                mainImage: "images/work/img1.jpg",
                images: ["images/work/img1.jpg", "images/work/img2.jpg", "images/work/img3.jpg", "images/work/img4.jpg"],
                description: "Kompletní rekonstrukce koupelny v bytovém domě včetně výměny všech rozvodů, instalace nové vany, sprchového koutu a toalety. Celý prostor byl nově obložen designovými obklady a dlažbou.",
                scope: [
                    "Demontáž původního vybavení",
                    "Nové rozvody vody a odpadu",
                    "Pokládka obkladů a dlažby",
                    "Instalace nové sanitární keramiky",
                    "Realizace podhledu s LED osvětlením"
                ]
            },
            {
                id: 2,
                title: "Stavba příčky s posuvnými dveřmi",
                client: "Firma XYZ",
                location: "Brno",
                date: "Leden 2023",
                mainImage: "images/work/img5.jpg",
                images: ["images/work/img5.jpg", "images/work/img6.jpg", "images/work/img7.jpg"],
                description: "Realizace sádrokartonové příčky s posuvnými dveřmi v kancelářských prostorách. Součástí projektu bylo řešení akustiky a vedení elektroinstalace uvnitř konstrukce.",
                scope: [
                    "Vyměření a příprava konstrukce",
                    "Montáž kovových profilů",
                    "Příprava pro posuvné dveře",
                    "Instalace sádrokartonových desek",
                    "Finální úprava povrchu"
                ]
            },
            {
                id: 3,
                title: "Opěrná zeď na zahradě",
                client: "Pan Svoboda",
                location: "Liberec",
                date: "Červen 2023",
                mainImage: "images/work/img8.jpg",
                images: ["images/work/img8.jpg", "images/work/img9.jpg", "images/work/img10.jpg"],
                description: "Výstavba opěrné zdi ze ztraceného bednění na svažitém pozemku. Zeď byla navržena tak, aby vytvořila rovnou plochu pro budoucí terasu a zároveň zabránila erozi půdy.",
                scope: [
                    "Příprava základů",
                    "Realizace ztraceného bednění",
                    "Vyztužení a betonáž",
                    "Odvodnění pomocí drenáže",
                    "Úprava terénu v okolí zdi"
                ]
            },
            {
                id: 4,
                title: "Renovace kuchyně",
                client: "Rodina Dvořákových",
                location: "Plzeň",
                date: "Srpen 2023",
                mainImage: "images/work/img11.jpg",
                images: ["images/work/img11.jpg", "images/work/img12.jpg", "images/work/img13.jpg"],
                description: "Kompletní renovace kuchyňského prostoru včetně výměny obkladů, podlahy a instalace nové kuchyňské linky. Projekt zahrnoval i úpravu rozvodů pro nové spotřebiče.",
                scope: [
                    "Odstranění původních obkladů",
                    "Úprava elektroinstalace a vodovodu",
                    "Pokládka nové dlažby",
                    "Instalace obkladů za kuchyňskou linkou",
                    "Finální dokončovací práce"
                ]
            },
            {
                id: 5,
                title: "Podkrovní podhled",
                client: "Manželé Kratochvílovi",
                location: "Olomouc",
                date: "Květen 2023",
                mainImage: "images/work/img14.jpg",
                images: ["images/work/img14.jpg", "images/work/img15.jpg", "images/work/img16.jpg"],
                description: "Realizace sádrokartonového podhledu v podkrovním prostoru rodinného domu. Součástí bylo zateplení, instalace parozábrany a příprava pro vestavěná svítidla.",
                scope: [
                    "Zaměření prostoru",
                    "Montáž kovové konstrukce",
                    "Instalace izolace a parozábrany",
                    "Montáž sádrokartonových desek",
                    "Příprava pro osvětlení",
                    "Finální úprava povrchu"
                ]
            },
            {
                id: 6,
                title: "Venkovní terasa s dlažbou",
                client: "Rodina Králových",
                location: "České Budějovice",
                date: "Červenec 2023",
                mainImage: "images/work/img17.jpg",
                images: ["images/work/img17.jpg", "images/work/img18.jpg", "images/work/img19.jpg"],
                description: "Výstavba venkovní terasy včetně přípravy podloží, betonového základu a pokládky mrazuvzdorné dlažby. Projekt zahrnoval i řešení odvodnění a napojení na vstup do domu.",
                scope: [
                    "Příprava terénu a podloží",
                    "Betonáž základové desky",
                    "Hydroizolace",
                    "Pokládka dlažby se spádováním",
                    "Realizace schodů a zábradlí"
                ]
            }
        ]);

        // Stránkování projektů
        const currentProjectsPage = ref(0);
        const projectsPerPage = computed(() => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 992) return 2;
            return 3;
        });

        // Celkový počet stránek
        const totalProjectsPages = computed(() => {
            return Math.ceil(projects.value.length / projectsPerPage.value);
        });

        // Maximální index pro stránkování
        const maxProjectsPages = computed(() => {
            return totalProjectsPages.value - 1;
        });

        // Proměnné pro touch swipe
        const touchStartX = ref(0);
        const touchEndX = ref(0);
        
        // ===== EVENT LISTENERY A LIFECYCLE HOOKS =====
        
        onMounted(() => {
            // Inicializace scrollování
            handleScroll();
            window.addEventListener('scroll', handleScroll);
            
            // Přidání event listeneru pro klávesové zkratky
            window.addEventListener('keydown', handleKeyPress);
            
            // Zahájení animací po načtení
            document.body.classList.add('loaded');
            
            // Inicializace lazy loadingu obrázků
            initLazyLoading();
            
            // Inicializace plynulého scrollování pro odkazy
            initSmoothScrolling();

            initAnimations();
        });
        
        onBeforeUnmount(() => {
            // Odstranění event listenerů při zničení komponenty
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyPress);
        });
        
        // ===== HLAVNÍ FUNKCE =====

        // Funkce pro inicializaci animačního systému
        const initAnimations = () => {
            // Výběr všech prvků s třídou .animate
            const animatedElements = document.querySelectorAll('.animate, .animate-sequence');
            
            // Konfigurační objekt pro IntersectionObserver
            const observerOptions = {
                root: null, // viewport je root
                rootMargin: '0px', // bez dodatečného marginu
                threshold: 0.15 // animace se spustí, když je alespoň 15 % prvku viditelných
            };
            
            // Vytvoření IntersectionObserver instance
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Pokud je prvek viditelný
                    if (entry.isIntersecting) {
                        // Přidáme třídu .in-view pro spuštění animace
                        entry.target.classList.add('in-view');
                        
                        // Pokud je to sekvence, zpracujeme děti postupně
                        if (entry.target.classList.contains('animate-sequence')) {
                            const children = entry.target.children;
                            Array.from(children).forEach((child, index) => {
                                // Přidáme zpoždění na základě indexu
                                setTimeout(() => {
                                    child.classList.add('in-view');
                                }, 100 * index);
                            });
                        }
                        
                        // Pro animace, které se mají přehrát jen jednou, přestaneme prvek sledovat
                        const isRepeat = entry.target.classList.contains('animate-repeat');
                        if (!isRepeat) {
                            observer.unobserve(entry.target);
                        }
                    } else {
                        // Pro opakující se animace odstraníme třídu .in-view, když prvek opustí viewport
                        if (entry.target.classList.contains('animate-repeat')) {
                            entry.target.classList.remove('in-view');
                            
                            if (entry.target.classList.contains('animate-sequence')) {
                                const children = entry.target.children;
                                Array.from(children).forEach(child => {
                                    child.classList.remove('in-view');
                                });
                            }
                        }
                    }
                });
            }, observerOptions);
            
            // Začneme sledovat všechny animované prvky
            animatedElements.forEach(element => {
                observer.observe(element);
            });
            
            // Navíc umožníme přehrát animace, když se stránka načte, pokud jsou již ve viewportu
            setTimeout(() => {
                // Získáme aktuální viewport výšku
                const viewportHeight = window.innerHeight;
                
                animatedElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    
                    // Pokud je prvek již ve viewportu při načtení stránky
                    if (rect.top < viewportHeight * 0.85) {
                        element.classList.add('in-view');
                        
                        // Pro sekvence zpracujeme děti
                        if (element.classList.contains('animate-sequence')) {
                            const children = element.children;
                            Array.from(children).forEach((child, index) => {
                                setTimeout(() => {
                                    child.classList.add('in-view');
                                }, 100 * index);
                            });
                        }
                    }
                });
            }, 300); // Malé zpoždění pro zajištění, že DOM je připraven
        };
        
        // Sledování scrollování pro header a aktivní sekce
        const handleScroll = () => {
            // Změna stavu headeru při scrollování
            const wasScrolled = isScrolled.value;
            isScrolled.value = window.scrollY > 50;
            
            const header = document.querySelector('header');
            
            // Pokud je menu aktivní, vždy necháme mobile-menu-active třídu
            if (mobileMenuActive.value) {
                header.classList.add('mobile-menu-active');
            } 
            // Pokud menu není aktivní a došlo ke změně stavu scrollování
            else if (wasScrolled !== isScrolled.value) {
                if (!isScrolled.value) {
                    header.classList.remove('mobile-menu-active');
                }
            }
            
            // Zjištění aktivní sekce pro navigaci
            const sections = document.querySelectorAll('section[id]');
            let currentActive = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentActive = section.getAttribute('id');
                }
            });
            
            activeSection.value = currentActive;
            
            // Přidání třídy 'active' pro animaci sekcí při scrollování
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight * 0.75) {
                    section.classList.add('active');
                }
            });
        };
        
        // Inicializace lazy loadingu obrázků
        const initLazyLoading = () => {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const src = img.getAttribute('data-src');
                            
                            if (src) {
                                img.src = src;
                                img.removeAttribute('data-src');
                            }
                            
                            observer.unobserve(img);
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback pro prohlížeče, které nepodporují IntersectionObserver
                document.querySelectorAll('img[data-src]').forEach(img => {
                    img.src = img.getAttribute('data-src');
                });
            }
        };
        
        // Inicializace plynulého scrollování pro odkazy
        const initSmoothScrolling = () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    
                    // Ignorujeme prázdné odkazy nebo odkazy s #
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Zavřeme mobilní menu, pokud je otevřené
                        if (mobileMenuActive.value) {
                            closeMobileMenu();
                        }
                    }
                });
            });
        };
        
        // ===== FUNKCE PRO MOBILNÍ MENU =====
        
        // Otevře/zavře mobilní menu
        const toggleMobileMenu = () => {
            mobileMenuActive.value = !mobileMenuActive.value;
            
            // Přidání/odebrání třídy mobile-menu-active na header
            const header = document.querySelector('header');
            
            if (mobileMenuActive.value) {
                // Pokud otevíráme menu
                document.body.style.overflow = 'hidden'; // Zamezení scrollování stránky
                header.classList.add('mobile-menu-active');
            } else {
                // Pokud zavíráme menu
                document.body.style.overflow = 'auto'; // Povolení scrollování
                
                // Pokud jsme nescrollovali, odstraníme třídu mobile-menu-active
                if (!isScrolled.value) {
                    header.classList.remove('mobile-menu-active');
                }
            }
        };
        
        // Zavře mobilní menu
        const closeMobileMenu = () => {
            mobileMenuActive.value = false;
            document.body.style.overflow = 'auto';
            
            // Pokud jsme nescrollovali, odstraníme třídu mobile-menu-active
            const header = document.querySelector('header');
            if (!isScrolled.value) {
                header.classList.remove('mobile-menu-active');
            }
        };
        
        // ===== FUNKCE PRO UNIVERZÁLNÍ MODÁLNÍ OKNO =====
        
        // Metoda pro otevření modálního okna se službou
        const openServiceModal = (serviceId) => {
            let serviceData = {};
            let serviceImages = [];
            
            if (serviceId === 'obkladacske') {
                serviceData = {
                    title: 'Obkladačské a zednické práce',
                    description: 'Specializujeme se na kompletní realizaci obkladačských a zednických prací. Nabízíme profesionální a čisté zpracování s důrazem na kvalitu použitých materiálů.',
                    icon: 'fa-home',
                    features: [
                        'Pokládka obkladů a dlažeb',
                        'Kompletní rekonstrukce koupelen',
                        'Zdění příček a nosných zdí',
                        'Venkovní dlažby a chodníky'
                    ]
                };
                
                // Pro každý obrázek explicitně definujeme cestu - bezpečnější přístup
                for (let i = 1; i <= 8; i++) {
                    serviceImages.push(`images/work/img${i}.jpg`);
                }
            } else if (serviceId === 'sdk') {
                serviceData = {
                    title: 'SDK konstrukce',
                    description: 'Sádrokartonové konstrukce nabízí rychlé a flexibilní řešení pro váš interiér. Realizujeme podhledy, příčky a další konstrukce včetně designových prvků.',
                    icon: 'fa-layer-group',
                    features: [
                        'Sádrokartonové podhledy',
                        'Příčky a předstěny',
                        'Designové prvky ze SDK',
                        'Akustické řešení prostor'
                    ]
                };
                
                // Pro každý obrázek explicitně definujeme cestu
                for (let i = 9; i <= 16; i++) {
                    serviceImages.push(`images/work/img${i}.jpg`);
                }
            } else if (serviceId === 'ztracene') {
                serviceData = {
                    title: 'Ztracené bednění',
                    description: 'Ztracené bednění je ideální řešení pro opěrné zdi, podezdívky a základy staveb. Vyniká vysokou pevností, rychlou realizací a skvělou odolností.',
                    icon: 'fa-border-all',
                    features: [
                        'Výstavbu opěrných zdí',
                        'Realizace podezdívek',
                        'Základy pro ploty',
                        'Základové pasy'
                    ]
                };
                
                // Pro každý obrázek explicitně definujeme cestu
                for (let i = 17; i <= 24; i++) {
                    serviceImages.push(`images/work/img${i}.jpg`);
                }
            }
            
            // Nastavíme data a otevřeme modální okno
            modalData.value = {
                type: 'service',
                ...serviceData,
                images: serviceImages
            };
            
            // Vždy začneme od prvního obrázku
            currentModalImageIndex.value = 0;
            modalActive.value = true;
            document.body.style.overflow = 'hidden';
        };

        // Metoda pro otevření modálního okna s projektem
        const openProjectModal = (projectId) => {
            const project = projects.value.find(p => p.id === projectId);
            
            if (project) {
                modalData.value = {
                    type: 'project',
                    title: project.title,
                    client: project.client,
                    location: project.location,
                    date: project.date,
                    description: project.description,
                    images: project.images,
                    scope: project.scope,
                    icon: 'fa-briefcase'
                };
                
                currentModalImageIndex.value = 0;
                modalActive.value = true;
                document.body.style.overflow = 'hidden';
            }
        };

        // Zavře modální okno
        const closeModal = () => {
            modalActive.value = false;
            document.body.style.overflow = 'auto';
        };

        // Přepnutí na předchozí obrázek v modálním okně
        const prevModalImage = () => {
            if (!modalData.value || !modalData.value.images) return;
            
            if (currentModalImageIndex.value > 0) {
                currentModalImageIndex.value--;
            } else {
                currentModalImageIndex.value = modalData.value.images.length - 1;
            }
        };

        // Přepnutí na další obrázek v modálním okně
        const nextModalImage = () => {
            if (!modalData.value || !modalData.value.images) return;
            
            if (currentModalImageIndex.value < modalData.value.images.length - 1) {
                currentModalImageIndex.value++;
            } else {
                currentModalImageIndex.value = 0;
            }
        };

        // Nastaví konkrétní obrázek v modálním okně
        const setModalImage = (index) => {
            if (!modalData.value || !modalData.value.images) return;
            
            if (index >= 0 && index < modalData.value.images.length) {
                currentModalImageIndex.value = index;
            }
        };
        
        // ===== FUNKCE PRO GALERII STRÁNKY =====
        
        // Otevře galerii na konkrétním obrázku
        const openGallery = (index) => {
            currentModalImageIndex.value = index;
            galleryActive.value = true;
            // Zamezení scrollování při otevřené galerii
            document.body.style.overflow = 'hidden';
        };
        
        // Zavře galerii
        const closeGallery = () => {
            galleryActive.value = false;
            document.body.style.overflow = 'auto';
        };
        
        // Zobrazí předchozí obrázek
        const prevImage = () => {
            currentModalImageIndex.value = currentModalImageIndex.value === 1 ? totalImages : currentModalImageIndex.value - 1;
        };
        
        // Zobrazí další obrázek
        const nextImage = () => {
            currentModalImageIndex.value = currentModalImageIndex.value === totalImages ? 1 : currentModalImageIndex.value + 1;
        };
        
        // ===== FUNKCE PRO PROJEKTY =====

        // Přejde na předchozí stránku projektů
        const prevProjectsSlide = () => {
            if (currentProjectsPage.value > 0) {
                currentProjectsPage.value--;
            }
        };

        // Přejde na další stránku projektů
        const nextProjectsSlide = () => {
            if (currentProjectsPage.value < maxProjectsPages.value) {
                currentProjectsPage.value++;
            }
        };

        // Přejde na konkrétní stránku projektů
        const goToProjectsPage = (page) => {
            if (page >= 0 && page <= maxProjectsPages.value) {
                currentProjectsPage.value = page;
            }
        };
        
        // Metody pro touch swipe
        const handleTouchStart = (event) => {
            touchStartX.value = event.touches[0].clientX;
        };

        const handleTouchMove = (event) => {
            touchEndX.value = event.touches[0].clientX;
        };

        // Upravená funkce handleTouchEnd, která na mobilních zařízeních nechá
        // fungovat nativní scrollování místo vlastního přeskakování o celou stránku
        const handleTouchEnd = () => {
            // Na mobilních zařízeních (menší než 768px) neděláme nic a necháme nativní scroll fungovat
            if (window.innerWidth < 768) {
                // Reset hodnot
                touchStartX.value = 0;
                touchEndX.value = 0;
                return;
            }
            
            const swipeThreshold = 50; // Minimální posun pro detekci swipe
            const swipeDistance = touchStartX.value - touchEndX.value;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe doleva - další projekt
                    nextProjectsSlide();
                } else {
                    // Swipe doprava - předchozí projekt
                    prevProjectsSlide();
                }
            }
            
            // Reset hodnot
            touchStartX.value = 0;
            touchEndX.value = 0;
        };
        
        // Klávesové zkratky pro galerii a modální okno
        const handleKeyPress = (event) => {
            if (galleryActive.value) {
                if (event.key === 'Escape') {
                    closeGallery();
                } else if (event.key === 'ArrowLeft') {
                    prevImage();
                } else if (event.key === 'ArrowRight') {
                    nextImage();
                }
            } else if (modalActive.value) {
                if (event.key === 'Escape') {
                    closeModal();
                } else if (event.key === 'ArrowLeft') {
                    prevModalImage();
                } else if (event.key === 'ArrowRight') {
                    nextModalImage();
                }
            }
        };
        
        // ===== VRÁCENÍ REACTIVE PROPERTIES A METOD =====
        return {
            // Reactive properties
            isScrolled,
            activeSection,
            mobileMenuActive,
            galleryActive,
            projects,
            currentProjectsPage,
            projectsPerPage,
            totalProjectsPages,
            maxProjectsPages,
            modalActive,
            modalData,
            currentModalImageIndex,
            touchStartX,
            touchEndX,
            
            // Metody
            toggleMobileMenu,
            closeMobileMenu,
            openGallery,
            closeGallery,
            prevImage,
            nextImage,
            openServiceModal,
            openProjectModal,
            closeModal,
            prevModalImage,
            nextModalImage,
            setModalImage,
            prevProjectsSlide,
            nextProjectsSlide,
            goToProjectsPage,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd
        };
    }
}).mount('#app');