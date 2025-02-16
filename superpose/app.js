const apiUrl = "https://api.coingecko.com/api/v3";
const superposeButton = document.getElementById('superpose');
let chartData = [];

// Fonction pour rechercher un token
async function searchToken(query) {
  try {
    const response = await fetch(`${apiUrl}/search?query=${query}`);
    const data = await response.json();
    return data.coins; // Liste des tokens trouvés
  } catch (error) {
    console.error("Erreur lors de la recherche du token :", error);
    return [];
  }
}

// Fonction pour récupérer les données historiques
async function getMarketData(tokenId) {
  try {
    const response = await fetch(`${apiUrl}/coins/${tokenId}/market_chart?vs_currency=usd&days=30`);
    const data = await response.json();
    return data.prices; // Données historiques
  } catch (error) {
    console.error("Erreur lors de la récupération des données du marché :", error);
    return [];
  }
}

// Fonction pour afficher ou superposer un graphique
async function updateChart(tokenId, label, isSuperpose = false) {
  const prices = await getMarketData(tokenId);
  if (prices.length === 0) {
    alert("Aucune donnée trouvée pour ce token.");
    return;
  }

  const xValues = prices.map(([timestamp]) => new Date(timestamp));
  const yValues = prices.map(([, price]) => price);

  const trace = {
    x: xValues,
    y: yValues,
    mode: 'lines',
    name: label,
  };

  if (!isSuperpose) {
    // Si on n'est pas en mode superposition, on réinitialise les données
    chartData = [trace];
    Plotly.newPlot('chart', chartData, {
      title: 'Prix des Cryptomonnaies',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Prix (USD)' },
    });
  } else {
    // Sinon, on ajoute la nouvelle trace
    Plotly.addTraces('chart', trace);
  }

  // Afficher le bouton "Superposer" après le premier graphique
  if (!isSuperpose) {
    superposeButton.style.display = 'inline-block';
  }
}

// Gestion de la recherche
document.getElementById('search').addEventListener('change', async (e) => {
  const query = e.target.value;
  if (!query) return;

  const tokens = await searchToken(query);
  if (tokens.length > 0) {
    const tokenId = tokens[0].id; // Prend le premier résultat
    const tokenName = tokens[0].name;
    updateChart(tokenId, tokenName);
  } else {
    alert("Aucun token trouvé.");
  }
});

// Gestion de la superposition
superposeButton.addEventListener('click', async () => {
  const query = document.getElementById('search').value;
  if (!query) return;

  const tokens = await searchToken(query);
  if (tokens.length > 0) {
    const tokenId = tokens[0].id;
    const tokenName = tokens[0].name;
    updateChart(tokenId, tokenName, true); // Mode superposition
  } else {
    alert("Aucun token trouvé.");
  }
});