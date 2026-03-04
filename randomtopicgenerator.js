class WordTranslator {
    constructor(targetLang = 'hu') {
        this.targetLang = targetLang;
        this.randomWordUrl = "https://random-word-api.herokuapp.com/word";
        this.myMemoryUrl = "https://api.mymemory.translated.net/get?q=";
        this.fallbackWords = {
            hu: ["tablet", "kijelző", "rendszer", "alkalmazás", "fejlesztő"],
            de: ["Tablett", "Anzeige", "System", "Anwendung", "Entwickler"],
            fr: ["tablette", "affichage", "système", "application", "développeur"]
        };
        this.stats = this._loadStats();
    }

    // Statisztika betöltése
    _loadStats() {
        return JSON.parse(localStorage.getItem('universalWordStats')) || { total: 0, last: "nincs" };
    }

    // Statisztika mentése
    _saveStats(word) {
        this.stats.total++;
        this.stats.last = `${word} (${this.targetLang.toUpperCase()})`;
        localStorage.setItem('universalWordStats', JSON.stringify(this.stats));
    }

    // Nyelv módosítása menet közben
    setLanguage(langCode) {
        this.targetLang = langCode;
    }

    // Angol szó lekérése
    async _fetchEnglishWord() {
        try {
            const res = await fetch(this.randomWordUrl);
            const data = await res.json();
            return data[0];
        } catch (e) {
            return null;
        }
    }

    // Google Fordító motor
    async _translateGoogle(text) {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${this.targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            return data[0][0][0];
        } catch { return null; }
    }

    // MyMemory motor
    async _translateMyMemory(word) {
        try {
            const res = await fetch(`${this.myMemoryUrl}${encodeURIComponent(word)}&langpair=en|${this.targetLang}`);
            const data = await res.json();
            const trans = data.responseData.translatedText;
            return (trans.toLowerCase() === word.toLowerCase()) ? null : trans;
        } catch { return null; }
    }

    // A fő funkció: Új szó generálása és fordítása
    async getNextWord() {
        let result = null;
        let attempts = 0;

        while (!result && attempts < 5) {
            attempts++;
            const enWord = await this._fetchEnglishWord();
            if (!enWord) continue;

            // Hibrid váltogatás
            result = (attempts % 2 !== 0) 
                ? await this._translateGoogle(enWord)
                : await this._translateMyMemory(enWord);
        }

        // Ha minden API elbukott, jöhet a fallback
        if (!result) {
            const list = this.fallbackWords[this.targetLang] || this.fallbackWords['hu'];
            result = list[Math.floor(Math.random() * list.length)];
        }

        this._saveStats(result);
        return {
            word: result,
            stats: this.stats
        };
    }
}
