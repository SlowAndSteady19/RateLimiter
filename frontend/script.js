const apiBase = "https://rate-limiter-bay.vercel.app/api"; // your deployed API

async function signup() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;

  const res = await fetch(apiBase + "/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch(apiBase + "/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.apiKey) {
    localStorage.setItem("apiKey", data.apiKey); // remember API key
  }
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}

async function getData() {
  const apiKey = document.getElementById("apiKey").value || localStorage.getItem("apiKey");
  const res = await fetch(apiBase + "/data", {
    method: "POST",
    headers: { "x-api-key": apiKey }
  });
  const data = await res.json();
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}

async function getDashboard() {
  const apiKey = document.getElementById("apiKey").value || localStorage.getItem("apiKey");
  const res = await fetch(apiBase + "/data/dashboard", {
    headers: { "x-api-key": apiKey }
  });
  const data = await res.json();
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}

async function getAdmin() {
  const res = await fetch(apiBase + "/admin/users");
  const data = await res.json();
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}
