/**
 * Para a Minha Pessoa Favorita ❤️
 * Script Artesanal, Acolhedor e Interativo
 * 
 * Funcionalidades:
 * 1. Partículas de ambientação suaves e aconchegantes
 * 2. Envelope interativo com abertura da aba e selo de cera
 * 3. Upload interativo de fotos reais nas polaroids com persistência (localStorage)
 * 4. Editor da cartinha pelo próprio navegador com salvamento automático
 * 5. Contador de tempo desde 26 de Agosto
 * 6. Player acústico com suporte a musica.mp3 e melodia de fallback
 * 7. Cards de carinho, modal de surpresa e visualizador de fotos (Lightbox)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. AMBIENTAÇÃO SUTIL (CANVAS DE PÉTALAS SUAVES)
       ========================================================================== */
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const petalColors = [
        'rgba(212, 93, 113, 0.18)',
        'rgba(234, 168, 179, 0.22)',
        'rgba(245, 200, 208, 0.20)',
        'rgba(184, 58, 78, 0.14)'
    ];

    class AmbientPetal {
        constructor(x, y) {
            this.x = x ?? Math.random() * width;
            this.y = y ?? -10;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 0.7 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
            this.rotation += this.rotSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Inicializa poucas pétalas para ficar bem discreto e aconchegante
    for (let i = 0; i < 18; i++) {
        const p = new AmbientPetal();
        p.y = Math.random() * height;
        petals.push(p);
    }

    function animateAmbient() {
        ctx.clearRect(0, 0, width, height);

        if (petals.length < 24 && Math.random() < 0.05) {
            petals.push(new AmbientPetal());
        }

        for (let i = petals.length - 1; i >= 0; i--) {
            const p = petals[i];
            p.update();
            p.draw();

            if (p.y > height + 20) {
                petals.splice(i, 1);
            }
        }

        requestAnimationFrame(animateAmbient);
    }

    animateAmbient();

    /* ==========================================================================
       2. BOTÃO "TENHO UMA COISA PRA TE CONTAR..." (SCROLL SUAVE ATÉ A CARTA)
       ========================================================================== */
    const btnContar = document.getElementById('btn-contar');

    if (btnContar) {
        btnContar.addEventListener('click', () => {
            const letterSection = document.getElementById('carta');
            if (letterSection) {
                letterSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Se a música ainda não estiver tocando, inicia suavemente
            if (!isPlaying) {
                toggleMusic();
            }
        });
    }

    /* ==========================================================================
       3. FOTOS POLAROID (UPLOAD FÁCIL & PERSISTÊNCIA NO NAVEGADOR)
       ========================================================================== */
    const polaroidWrappers = document.querySelectorAll('.polaroid-wrapper');

    polaroidWrappers.forEach(wrapper => {
        const id = wrapper.dataset.id;
        const img = wrapper.querySelector('.polaroid-img');
        const fileInput = wrapper.querySelector('.photo-file-input');
        const frame = wrapper.querySelector('.polaroid-frame');
        const overlay = wrapper.querySelector('.polaroid-overlay');

        // Clique no frame abre o Lightbox com a foto em tela cheia
        if (frame) {
            frame.addEventListener('click', (e) => {
                e.stopPropagation();
                const caption = wrapper.querySelector('.polaroid-note')?.textContent || '';
                openLightbox(img.src, caption);
            });
        }

        // Se houver input de arquivo para troca dinâmica
        if (overlay && fileInput) {
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target.result;
                        img.src = dataUrl;
                        try {
                            localStorage.setItem('polaroid_photo_' + id, dataUrl);
                        } catch (err) {
                            console.warn('Armazenamento local cheio para esta foto, exibida normalmente na sessão.', err);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });



    /* ==========================================================================
       5. CONTADOR DE TEMPO (DESDE 26 DE AGOSTO)
       ========================================================================== */
    // Início da história: 26 de Agosto de 2024
    const dataInicio = new Date('2026-08-26T00:00:00');

    const elMonths = document.getElementById('c-months');
    const elDays = document.getElementById('c-days');
    const elHours = document.getElementById('c-hours');
    const elMins = document.getElementById('c-mins');
    const elSecs = document.getElementById('c-secs');

    function updateCounter() {
        const agora = new Date();
        let diferenca = agora - dataInicio;

        if (diferenca < 0) {
            diferenca = 0;
        }
        
        let anos = agora.getFullYear() - dataInicio.getFullYear();
        let meses = agora.getMonth() - dataInicio.getMonth();
        let dias = agora.getDate() - dataInicio.getDate();
        
        // Ajuste de dias negativos
        if (dias < 0) {
            meses--;
            const ultimoDiaMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
            dias += ultimoDiaMesAnterior;
        }
        
        // Ajuste de meses negativos
        if (meses < 0) {
            anos--;
            meses += 12;
        }

        // Somar anos aos meses
        meses += anos * 12;

        const segundosTotais = Math.floor(diferenca / 1000);
        const horas = Math.floor((segundosTotais % 86400) / 3600);
        const minutos = Math.floor((segundosTotais % 3600) / 60);
        const segundos = segundosTotais % 60;

        if (elMonths) elMonths.textContent = meses;
        if (elDays) elDays.textContent = dias;
        if (elHours) elHours.textContent = String(horas).padStart(2, '0');
        if (elMins) elMins.textContent = String(minutos).padStart(2, '0');
        if (elSecs) elSecs.textContent = String(segundos).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);

    /* ==========================================================================
       6. CARDS "COISAS QUE EU GOSTO EM VOCÊ"
       ========================================================================== */
    const reasonCards = document.querySelectorAll('.reason-card');

    reasonCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-active');
        });

        // Acessibilidade via teclado (Enter / Espaço)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('is-active');
            }
        });
    });

    /* ==========================================================================
       7. PLAYER DE MÚSICA (Removido - Agora usamos Spotify Embed)
       ========================================================================== */


    /* ==========================================================================
       8. MODAL DE SURPRESA & CONTADOR DE ABRAÇOS
       ========================================================================== */
    const btnSurprise = document.getElementById('btn-surprise');
    const surpriseModal = document.getElementById('surprise-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const btnLoveClick = document.getElementById('btn-love-click');
    const loveCountBadge = document.getElementById('love-count-badge');
    let hugCount = 0;

    btnSurprise.addEventListener('click', () => {
        surpriseModal.classList.add('is-active');
        surpriseModal.setAttribute('aria-hidden', 'false');
    });

    function closeSurpriseModal() {
        surpriseModal.classList.remove('is-active');
        surpriseModal.setAttribute('aria-hidden', 'true');
    }

    modalCloseBtn.addEventListener('click', closeSurpriseModal);
    surpriseModal.addEventListener('click', (e) => {
        if (e.target === surpriseModal) closeSurpriseModal();
    });

    btnLoveClick.addEventListener('click', () => {
        hugCount++;
        loveCountBadge.textContent = hugCount;

        // Dispara algumas pétalas afetuosas a partir do botão
        const rect = btnLoveClick.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const p = new AmbientPetal(rect.left + rect.width / 2 + (Math.random() * 40 - 20), rect.top);
            p.speedY = -Math.random() * 3 - 1.5;
            p.speedX = (Math.random() - 0.5) * 4;
            petals.push(p);
        }
    });

    /* ==========================================================================
       9. LIGHTBOX DE FOTOS EM TELA CHEIA
       ========================================================================== */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightboxModal.classList.add('is-active');
    }

    function closeLightbox() {
        lightboxModal.classList.remove('is-active');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    // Tecla ESC fecha qualquer modal aberto
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeSurpriseModal();
            closeEditModal();
        }
    });
});
