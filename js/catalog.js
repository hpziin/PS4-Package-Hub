
window.PackageCatalog = {
    items: [],

    async load() {
        const response = await fetch("data/catalog.json");

        if (!response.ok) {
            throw new Error("Erro ao carregar catálogo.");
        }

        this.items = await response.json();
        return this.items;
    }
};
