
document.addEventListener('DOMContentLoaded', function () {

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function fecharMenu() {
    navMenu.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    const aberto = navMenu.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(aberto));
  });

  navMenu.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
    link.addEventListener('click', fecharMenu);
  });

  const header = document.getElementById('header');

  function atualizarCabecalho() {
    header.classList.toggle('header--scrolled', window.scrollY > 12);
  }
  atualizarCabecalho();
  window.addEventListener('scroll', atualizarCabecalho, { passive: true });

  const elementosRevelados = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementosRevelados.forEach(function (el) { observador.observe(el); });
  } else {
    elementosRevelados.forEach(function (el) { el.classList.add('is-visible'); });
  }

  const modal = document.getElementById('procedureModal');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalTeaser = document.getElementById('modalTeaser');
  const modalPanel = modal.querySelector('.modal__panel');
  const gatilhosProcedimento = document.querySelectorAll('.procedure-card__trigger');

  let ultimoElementoFocado = null;

  function abrirModal(dados) {
    ultimoElementoFocado = document.activeElement;

    modalTag.textContent = dados.tag;
    modalTitle.textContent = dados.title;
    modalTeaser.textContent = dados.teaser;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; 
    modalPanel.focus();
  }

  function fecharModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (ultimoElementoFocado) ultimoElementoFocado.focus();
  }

  gatilhosProcedimento.forEach(function (botao) {
    botao.addEventListener('click', function () {
      abrirModal({
        tag: botao.dataset.procedureTag,
        title: botao.dataset.procedureTitle,
        teaser: botao.dataset.procedureTeaser
      });
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', fecharModal);
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && modal.classList.contains('is-open')) {
      fecharModal();
    }
  });

  const track = document.getElementById('carrosselTrack');
  const dotsContainer = document.getElementById('carrosselDots');
  const btnPrev = document.getElementById('carrosselPrev');
  const btnNext = document.getElementById('carrosselNext');
  const carrosselWrap = document.querySelector('.carrossel');

  let indiceAtual = 0;
  let temporizadorAutoplay = null;

  function totalSlides() {
    return track.children.length;
  }

  function irParaSlide(indice) {
    const total = totalSlides();
    indiceAtual = (indice + total) % total;
    track.style.transform = 'translateX(-' + (indiceAtual * 100) + '%)';
    atualizarDots();
  }

  function construirDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carrossel__dot';
      dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
      dot.addEventListener('click', function () {
        irParaSlide(i);
        reiniciarAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function atualizarDots() {
    dotsContainer.querySelectorAll('.carrossel__dot').forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === indiceAtual);
    });
  }

  function iniciarAutoplay() {
    temporizadorAutoplay = setInterval(function () {
      irParaSlide(indiceAtual + 1);
    }, 6000);
  }

  function pararAutoplay() {
    clearInterval(temporizadorAutoplay);
  }

  function reiniciarAutoplay() {
    pararAutoplay();
    iniciarAutoplay();
  }

  btnPrev.addEventListener('click', function () { irParaSlide(indiceAtual - 1); reiniciarAutoplay(); });
  btnNext.addEventListener('click', function () { irParaSlide(indiceAtual + 1); reiniciarAutoplay(); });

  carrosselWrap.addEventListener('mouseenter', pararAutoplay);
  carrosselWrap.addEventListener('mouseleave', iniciarAutoplay);
  carrosselWrap.addEventListener('focusin', pararAutoplay);
  carrosselWrap.addEventListener('focusout', iniciarAutoplay);

  construirDots();
  atualizarDots();
  iniciarAutoplay();

  const form = document.getElementById('avaliacaoForm');
  const grupoEstrelas = document.getElementById('estrelasGrupo');
  const botoesEstrela = grupoEstrelas.querySelectorAll('.estrela-input');
  const inputEstrelas = document.getElementById('avaliacaoEstrelasValor');
  const feedback = document.getElementById('avaliacaoFeedback');

  let notaSelecionada = 0;

  function pintarEstrelas(nota) {
    botoesEstrela.forEach(function (botao) {
      const valor = Number(botao.dataset.valor);
      botao.classList.toggle('selecionada', valor <= nota);
    });
  }

  botoesEstrela.forEach(function (botao) {
    botao.addEventListener('click', function () {
      notaSelecionada = Number(botao.dataset.valor);
      inputEstrelas.value = String(notaSelecionada);
      pintarEstrelas(notaSelecionada);
    });
    botao.addEventListener('mouseenter', function () {
      pintarEstrelas(Number(botao.dataset.valor));
    });
  });
  grupoEstrelas.addEventListener('mouseleave', function () {
    pintarEstrelas(notaSelecionada);
  });

  function criarCardDepoimento(nome, mensagem, nota) {
    const li = document.createElement('li');
    li.className = 'depoimento-card';

    let estrelasHtml = '';
    for (let i = 1; i <= 5; i++) {
      estrelasHtml += '<span class="estrela ' + (i <= nota ? 'cheia' : 'vazia') + '">★</span>';
    }

    li.innerHTML =
      '<div class="depoimento-card__estrelas" aria-label="' + nota + ' de 5 estrelas">' + estrelasHtml + '</div>' +
      '<p class="depoimento-card__texto">"' + mensagem + '"</p>' +
      '<p class="depoimento-card__nome">' + nome + '</p>';

    return li;
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nome = document.getElementById('avaliacaoNome').value.trim();
    const mensagem = document.getElementById('avaliacaoMensagem').value.trim();

    if (!nome || !mensagem) {
      feedback.textContent = 'Preencha seu nome e sua mensagem antes de enviar.';
      return;
    }
    if (notaSelecionada === 0) {
      feedback.textContent = 'Selecione de 1 a 5 estrelas para continuar.';
      return;
    }

    const novoCard = criarCardDepoimento(nome, mensagem, notaSelecionada);
    track.appendChild(novoCard);
    construirDots();
    irParaSlide(totalSlides() - 1);
    reiniciarAutoplay();

    feedback.textContent = 'Obrigado, ' + nome.split(' ')[0] + '! Seu depoimento foi adicionado.';

    form.reset();
    notaSelecionada = 0;
    inputEstrelas.value = '0';
    pintarEstrelas(0);
  });

});
