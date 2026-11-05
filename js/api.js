
window.PS4Api = (() => {
    function baseUrl() {
        const ip = document.getElementById("ps4Ip").value.trim();
        const port = document.getElementById("ps4Port").value.trim();

        if (!ip) throw new Error("Informe o IP do PS4.");

        return `http://${ip}:${port}/api/v1`;
    }

    async function request(path, options = {}) {
        const token = document.getElementById("apiToken").value.trim();

        const headers = {
            "Accept": "application/json",
            ...(options.headers || {})
        };

        if (options.body) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(baseUrl() + path, {
            ...options,
            headers,
            mode: "cors",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    return {
        status: () => request("/status"),

        install: item => request("/install", {
            method: "POST",
            body: JSON.stringify({
                url: item.url,
                name: item.name,
                type: item.type
            })
        }),

        jobs: () => request("/jobs")
    };
})();
