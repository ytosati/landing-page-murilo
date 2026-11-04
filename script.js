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
})();
