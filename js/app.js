
const $ = id => document.getElementById(id);

let connected = false;
let jobs = [];
window.visibleItems = [];

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function setConnection(ok, message) {
    connected = ok;

    $("statusText").textContent = ok ? "CONECTADO" : "DESCONECTADO";
    $("statusDot").style.background = ok ? "#38df9a" : "#ff657a";
    $("consoleState").textContent = ok ? "Online" : "Offline";
    $("consoleIp").textContent = $("ps4Ip").value;
    $("connectionMessage").textContent = message;
}

async function connect() {
    $("connectBtn").disabled = true;

    try {
        const data = await PS4Api.status();

        setConnection(true, "Payload respondeu à consulta.");
        $("firmware").textContent = data.firmware || "—";
        $("goldhen").textContent = data.goldhen || "—";
    } catch (error) {
        setConnection(false, "Falha na conexão: " + error.message);
        $("firmware").textContent = "—";
        $("goldhen").textContent = "—";
    } finally {
        $("connectBtn").disabled = false;
    }
}

function renderCatalog() {
    const search = $("searchInput").value.toLowerCase();
    const type = $("typeFilter").value;

    const items = PackageCatalog.items.filter(item => {
        const matchesType = type === "all" || item.type === type;
        const matchesSearch = item.name.toLowerCase().includes(search);
        return matchesType && matchesSearch;
    });

    window.visibleItems = items;

    if (!items.length) {
        $("catalogGrid").innerHTML =
            '<div class="empty">Nenhum pacote encontrado.</div>';
        return;
    }

    $("catalogGrid").innerHTML = items.map((item, index) => `
        <article class="game-card">
            <div class="cover">
                ${item.cover
                    ? `<img src="${escapeHtml(item.cover)}" alt="">`
                    : "PS4"}
            </div>
            <div class="game-info">
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.type)} · ${escapeHtml(item.version || "—")}</p>
                <div class="game-actions">
                    <button onclick="showDetails(${index})" class="secondary">Detalhes</button>
                    <button onclick="queueInstall(${index})">Enviar</button>
                </div>
            </div>
        </article>
    `).join("");
}

function showDetails(index) {
    const item = window.visibleItems[index];

    alert(
        `${item.name}\n` +
        `Tipo: ${item.type}\n` +
        `Versão: ${item.version || "—"}\n` +
        `URL: ${item.url || "Não cadastrada"}`
    );
}

async function queueInstall(index) {
    const item = window.visibleItems[index];

    if (!item.url) {
        alert("Cadastre uma URL no catalog.json primeiro.");
        return;
    }

    if (!connected) {
        alert("Conecte ao payload primeiro.");
        return;
    }

    if (!confirm(`Enviar solicitação de ${item.name}?`)) return;

    try {
        const result = await PS4Api.install(item);

        jobs.unshift({
            name: item.name,
            id: result.id || "—",
            state: result.status || "Solicitado"
        });

        renderJobs();
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

function renderJobs() {
    $("taskCount").textContent = jobs.length;

    $("jobsList").innerHTML = jobs.length
        ? jobs.map(job =>
            `<p>${escapeHtml(job.name)} — ${escapeHtml(job.state)}</p>`
          ).join("")
        : "Nenhuma tarefa solicitada.";
}

async function loadCatalog() {
    try {
        await PackageCatalog.load();
        renderCatalog();
    } catch (error) {
        $("catalogGrid").textContent = error.message;
    }
}

$("connectBtn").addEventListener("click", connect);

$("disconnectBtn").addEventListener("click", () => {
    setConnection(false, "Desconectado.");
});

$("searchInput").addEventListener("input", renderCatalog);
$("typeFilter").addEventListener("change", renderCatalog);

loadCatalog();
renderJobs();
