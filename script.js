// === Water Flow Dashboard Script (Final Integrated Version) ===

// Dummy backend data
const tributaryData = {
  "Tributary 1": [30, 35, 40, 38, 37],
  "Tributary 2": [20, 18, 15, 10, 12],
  "Tributary 3": [25, 27, 29, 30, 28],
  "Tributary 4": [45, 60, 55, 70, 65]
};

const tributaryNames = ["T1", "T2", "T3", "T4"];
const waterFlowData = [45, 60, 30, 80];
const blockageData = [10, 30, 70, 20];
const comparisonData = [55, 65, 45, 85];

let chart; // For popup

// === Dashboard Charts ===

// Line Chart: Flow
const flowCtx = document.getElementById('tributaryFlowChart').getContext('2d');
new Chart(flowCtx, {
  type: 'line',
  data: {
    labels: tributaryNames,
    datasets: [{
      label: 'Water Flow (L/s)',
      data: waterFlowData,
      borderColor: '#00ffff',
      borderWidth: 3,
      pointBackgroundColor: '#00ffff',
      backgroundColor: 'rgba(0,255,255,0.15)',
      fill: true,
      tension: 0.35
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#00ffff' } } },
    scales: {
      x: { ticks: { color: '#00ffff' }, grid: { color: '#003344' } },
      y: { ticks: { color: '#00ffff' }, grid: { color: '#003344' } }
    },
    animation: { duration: 2000, easing: 'easeOutCubic' }
  }
});

// Bar Chart: Blockage
const blockageCtx = document.getElementById('blockageChart').getContext('2d');
new Chart(blockageCtx, {
  type: 'bar',
  data: {
    labels: tributaryNames,
    datasets: [{
      label: 'Blockage (%)',
      data: blockageData,
      backgroundColor: [
        '#00ffffaa',
        '#00ffccaa',
        '#0099ffaa',
        '#66ffffaa'
      ],
      borderColor: '#00ffff',
      borderWidth: 1
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#00ffff' } } },
    scales: {
      x: { ticks: { color: '#00ffff' }, grid: { color: '#002244' } },
      y: { ticks: { color: '#00ffff' }, grid: { color: '#002244' } }
    }
  }
});

// Doughnut Chart: Comparison
const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
new Chart(comparisonCtx, {
  type: 'doughnut',
  data: {
    labels: tributaryNames,
    datasets: [{
      label: 'Flow Comparison',
      data: comparisonData,
      backgroundColor: [
        '#00ffffaa',
        '#00ffccaa',
        '#33ccffaa',
        '#0099ffaa'
      ],
      borderColor: '#000',
      borderWidth: 2
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#00ffff' } } },
    animation: { duration: 2000, easing: 'easeOutElastic' }
  }
});

// === Tributary Popup Flow History ===
const cards = document.querySelectorAll('.card');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popupTitle');
const closeBtn = document.getElementById('closeBtn');
const noDataMsg = document.getElementById('noDataMsg');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const name = card.dataset.name;
    const data = tributaryData[name];
    popupTitle.textContent = `${name} - Flow History`;
    popup.style.display = 'block';

    const ctx = document.getElementById('flowChart').getContext('2d');

    if (chart) chart.destroy();

    if (!data || data.length === 0) {
      noDataMsg.style.display = 'block';
      return;
    } else {
      noDataMsg.style.display = 'none';
    }

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
          label: 'Flow Rate (L/s)',
          data: data,
          borderColor: '#00ffff',
          backgroundColor: 'rgba(0,255,255,0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: '#00e6ff' }, grid: { color: '#00ffff33' } },
          y: { ticks: { color: '#00e6ff' }, grid: { color: '#00ffff33' } }
        },
        plugins: { legend: { labels: { color: '#00ffff' } } }
      }
    });
  });
});

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

// === Weather Alert Simulation ===
const weatherAlert = document.getElementById("weatherAlert");
setTimeout(() => {
  weatherAlert.innerText = "⚠️ Heavy rainfall expected near Tributary 2 – Possible overflow!";
  weatherAlert.style.display = "block";
}, 2500);
