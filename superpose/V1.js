
let chart;
let cryptoData = {};

async function fetchCryptoData(crypto) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`);
    if (!response.ok) throw new Error("Notez le nom complet avec un tiret si nécessaire. Ex: pour btc notez bitcoin, pour injective notez injective-protocol, pour Akash notez akash-network, pour RSR notez reserve-rights-token etc");
    const data = await response.json();
    return data.prices.map(entry => ({ x: entry[0], y: entry[1] }));
  } catch (error) {
    alert("Erreur: " + error.message);
    return null;
  }
}

async function addCrypto() {
  const crypto = document.getElementById("cryptoInput").value.toLowerCase().trim();
  if (!crypto || cryptoData[crypto]) return;
  const data = await fetchCryptoData(crypto);
  if (data) {
    cryptoData[crypto] = data;
    updateChart();
  }
}

function updateChart() {
  const ctx = document.getElementById('cryptoChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: Object.keys(cryptoData).map((crypto, index) => ({
        label: crypto,
        data: cryptoData[crypto],
        borderColor: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'][index % 5],
        fill: false
      }))
    },
    options: {
      scales: { x: { type: 'time', time: { unit: 'month' } } },
      responsive: true
    }
  });
}

function clearChart() {
  cryptoData = {};
  updateChart();
}

// menu
const hamburgerMenu = document.querySelector('.hamburger-menu');

hamburgerMenu.addEventListener('click', () => {
  // Utilisation de SweetAlert pour afficher la fenêtre contextuelle
  Swal.fire({
    title: 'free Tool',
    html: '<ul><p><a href="../index.html">fiboscope</a> fibonacci tool</p><p><a href="../alarm/index.html">Alarm Crypto</a></p><p><a href="../wallet/index.html">Wallet</a></p><p><a href="../superpose/index.html">Multi Chart</a></p><p><a href="https://medium.com/@gael-berru">Article</a></p><p><a href="https://berru-g.github.io/berru-g/blog/donation.html">Donation</a></p></ul>',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'custom-swal-popup',
      closeButton: 'custom-swal-close-button',
      content: 'custom-swal-content',
    }
  });
});