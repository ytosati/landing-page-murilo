(function () {
  var config = window.SITE_CONFIG || {};
  var cta = document.getElementById('whatsapp-cta');
  var isGroupUrlSet = /^https:\/\/chat\.whatsapp\.com\//.test(config.WHATSAPP_GROUP_URL || '');

  if (isGroupUrlSet) {
    cta.href = config.WHATSAPP_GROUP_URL;
  } else {
    console.info('[CTA] WHATSAPP_GROUP_URL ainda não configurado.');
  }

  cta.addEventListener('click', function (event) {
    if (!isGroupUrlSet) {
      event.preventDefault();
      alert('Link do grupo ainda não configurado.');
      return;
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Fundo: faixas de logos em ordem aleatória, alternando o sentido do movimento
  // Arquivos em assets/brands/
  var BRAND_LOGOS = [
    'tissot.svg', 'seiko.svg', 'hamilton.svg', 'longines.svg', 'mido.svg', 'bulova.svg',
    'citizen.svg', 'baume.svg', 'victorinox.svg', 'oris.svg',
    'casio.png', 'swatch.png', 'movado.png', 'timex.png', 'technos.png', 'orient.png',
    'festina.png', 'lotus.png', 'skagen.png', 'certina.png', 'mondaine.png', 'gshock.png',
    'wellington.png', 'invicta.png'
  ];
  // Mantêm as cores originais; os demais são escuros e viram brancos
  var COLORED_LOGOS = ['mido.svg', 'tissot.svg', 'victorinox.svg', 'orient.png'];
  var BRAND_CHIP_WIDTH = 152;   // largura do selo + espaçamento (px), igual ao CSS
  var BRAND_ROW_HEIGHT = 76;    // altura da faixa + espaçamento (px), igual ao CSS
  var BRAND_SPEED = 25;         // px por segundo, igual para todas as faixas

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  // Sequência aleatória longa o bastante para cobrir a tela, sem a mesma marca lado a lado
  function buildSequence(minLength) {
    var sequence = [];
    while (sequence.length < minLength) {
      var batch = shuffle(BRAND_LOGOS);
      if (batch[0] === sequence[sequence.length - 1]) {
        batch.push(batch.shift());
      }
      sequence = sequence.concat(batch);
    }
    // O loop junta o fim com o começo: evita repetição nessa emenda também
    if (sequence[0] === sequence[sequence.length - 1]) {
      var first = sequence[0];
      sequence[0] = sequence[1];
      sequence[1] = first;
    }
    return sequence;
  }

  function createChip(brand) {
    var chip = document.createElement('span');
    var logo = document.createElement('img');
    chip.className = 'brand-wall__chip' +
      (COLORED_LOGOS.indexOf(brand) === -1 ? ' brand-wall__chip--mono' : '');
    logo.src = 'assets/brands/' + brand;
    logo.alt = '';
    logo.decoding = 'async';
    chip.appendChild(logo);
    return chip;
  }

  var brandWall = document.getElementById('brand-wall');
  var chipsPerRow = Math.ceil(window.innerWidth / BRAND_CHIP_WIDTH / BRAND_LOGOS.length) * BRAND_LOGOS.length;
  var rowCount = Math.ceil(window.innerHeight / BRAND_ROW_HEIGHT) + 1;
  var duration = (chipsPerRow * BRAND_CHIP_WIDTH / BRAND_SPEED) + 's';
  var fragment = document.createDocumentFragment();

  for (var r = 0; r < rowCount; r++) {
    var row = document.createElement('div');
    var track = document.createElement('div');
    var sequence = buildSequence(chipsPerRow);

    row.className = 'brand-wall__row';
    track.className = 'brand-wall__track' + (r % 2 ? ' brand-wall__track--right' : '');
    track.style.animationDuration = duration;
    track.style.animationDelay = '-' + (Math.random() * parseFloat(duration)).toFixed(1) + 's';

    // Sequência duplicada: a animação anda metade da faixa e reinicia sem emenda visível
    sequence.concat(sequence).forEach(function (brand) {
      track.appendChild(createChip(brand));
    });

    row.appendChild(track);
    fragment.appendChild(row);
  }
  brandWall.appendChild(fragment);
})();
