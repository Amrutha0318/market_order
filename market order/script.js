let price = 100.0;
let profit = 0;
let orders = [];
let chart;
let username = "";

const priceDisplay = document.getElementById("price");
const profitDisplay = document.getElementById("profit");
const orderPriceInput = document.getElementById("orderPrice");
const ordersDiv = document.getElementById("orders");
const fillSound = document.getElementById("fillSound");

function loginUser() {
  const name = document.getElementById("username").value.trim();
  if (name === "") {
    alert("Please enter a username.");
    return;
  }
  username = name;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("mainContent").classList.remove("hidden");
  alert(`Welcome, ${username}! Start trading now.`);
  startPriceSimulation();
  initChart();
  updateChart();
}

function updatePriceDisplay() {
  priceDisplay.innerText = `Price: ₹${price.toFixed(2)}`;
  profitDisplay.innerText = `Net Profit: ₹${profit.toFixed(2)}`;
}

function placeOrder() {
  const side = document.getElementById("orderSide").value;
  const type = document.getElementById("orderType").value;
  const limitPrice = parseFloat(orderPriceInput.value);

  if (type === "limit" && isNaN(limitPrice)) {
    alert("Please enter a valid limit price.");
    return;
  }

  const order = {
    id: orders.length + 1,
    side,
    type,
    price: type === "market" ? price : limitPrice,
    status: "Pending"
  };

  if (type === "market") {
    fillOrder(order);
  } else {
    orders.push(order);
    renderOrders();
  }
}

function fillOrder(order) {
  order.status = "Filled";
  if (order.side === "buy") {
    profit -= order.price;
  } else {
    profit += order.price;
  }
  fillSound.play();
  renderOrders();
  updatePriceDisplay();
  alert(`Order Filled! ${order.side.toUpperCase()} at ₹${order.price}`);
}

function checkLimitOrders() {
  for (let order of orders) {
    if (order.status === "Pending") {
      if (
        (order.side === "buy" && price <= order.price) ||
        (order.side === "sell" && price >= order.price)
      ) {
        fillOrder(order);
      }
    }
  }
}

function renderOrders() {
  let html = `<h3>Orders:</h3>`;
  orders.forEach(order => {
    html += `<div><strong>Order ${order.id}</strong><br/>Side: ${order.side}<br/>Type: ${order.type}<br/>Price: ₹${order.price.toFixed(2)}<br/>Status: ${order.status}</div>`;
  });
  ordersDiv.innerHTML = html;
}

function startPriceSimulation() {
  setInterval(() => {
    const change = (Math.random() - 0.5) * 2;
    price += change;
    updatePriceDisplay();
    updateChart();
    checkLimitOrders();
  }, 1000);
}

function initChart() {
  const ctx = document.getElementById("priceChart").getContext("2d");
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Price',
          data: [],
          borderColor: '#0ea5e9',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { ticks: { color: '#fff' } },
        y: { ticks: { color: '#fff' } }
      }
    }
  });
}

function updateChart() {
  const time = new Date().toLocaleTimeString();
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(price);
  chart.update();
}

document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
