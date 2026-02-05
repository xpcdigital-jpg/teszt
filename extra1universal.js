//ez segéd javascript file, neve extra1universal.js

const defaultRadios = [
  { name: 'LWR Comedy', url: 'https://lwrcomedy-zaklwr10.radioca.st/stream' },
  { name: 'SciFi Old Time Radio', url: 'http://s1.voscast.com:8652/stream' },
  { name: 'NoLife Radio Video Game Music', url: 'http://listen.nolife-radio.com/stream' },
  { name: 'Rádió Circuito Mix', url: 'http://162.220.58.242:8012/stream/1/' },
  { name: 'World Revolutions by WorldFusionRadio.com', url: 'http://51.255.235.165:5366/stream/1/' },
  { name: 'Spectrum Country', url: 'http://51.255.235.165:5184/stream/1/' },
  { name: 'psyradio', url: 'http://komplex2.psyradio.org:8020/stream/1/' },
  { name: '181 FM Comedy', url: 'http://listen.181fm.com/181-comedy_128k.mp3' },
  { name: 'Asura Britcom', url: 'https://cast2.asurahosting.com/proxy/britcom1/stream' },
  { name: 'Buddha Beach', url: 'https://radio4.vip-radios.fm:18054/stream-128kmp3-BuddhaBeach' },
  { name: 'Chilloutzone', url: 'https://chilloutzone.stream.laut.fm/chilloutzone' },
  { name: 'Sala London old', url: 'http://salalondon.ddns.net:8002/;stream.mp3' },
  { name: 'Sala London', url: 'https://solid55.streamupsolutions.com/proxy/cfyzzdah/stream' },
  { name: 'Mercy Radio Kabare', url: 'http://stream.mercyradio.eu/kabare.mp3' },
  { name: 'VIBE FM', url: 'https://streaming.silvacast.com/VIBEFM.mp3' },
  { name: 'Sex-High Rautemusik', url: 'https://sex-high.rautemusik.fm/' },
  { name: 'InfoStart', url: 'https://stream.infostart.hu/stream' },
  { name: 'Plusfm - Paris France', url: 'https://radio5.pro-fhi.net:19041/stream/1/' },
  { name: 'AIS SA2', url: 'https://ais-sa2.cdnstream1.com/1373_128' },
  { name: 'Kathy TorontoCast', url: 'https://kathy.torontocast.com:1825/stream' },
  { name: 'Dawnshadow Radio', url: 'http://radio.dawnshadow.se:8000/stream' },
  { name: 'RCS Stream', url: 'https://stream.rcs.revma.com/zfad8vm4srhvv.mp3' },
  { name: 'RTL Radio EDM', url: 'http://stream.rtlradio.de/plusedm/mp3-192/' },
  { name: '0n Electro', url: 'https://0n-electro.radionetz.de/0n-electro.mp3' },
  { name: 'JKing Stream', url: 'http://jking.cdnstream1.com/b22139_128mp3' },
  { name: 'Wandering Sheep Christian Jazz', url: 'http://radio.wanderingsheep.tv:8021/christianjazz' },
  { name: 'Yoga Chill', url: 'https://radio4.vip-radios.fm:18027/stream-128kmp3-YogaChill' },
  { name: 'Chilltrax', url: 'https://streamssl.chilltrax.com/index.html' },
  { name: 'Movie Dance', url: 'https://moviedance.stream.laut.fm/moviedance' },
  { name: 'Space Travel Radio', url: 'https://spacetravelradio.de:2893/stream/2/' },
  { name: 'Nature Rex', url: 'https://nature-rex.radioca.st/stream' },
  { name: 'hyperadio ru', url: 'http://hyperadio.ru:8000/live' },
  { name: 'Ambient Art Sound', url: 'https://ambientartsound.skydesignltd.com:8000/radio.mp3' },
  { name: 'Zeno FM', url: 'https://stream.zeno.fm/00rt0rdm7k8uv' },
  { name: 'Jazzy.hu', url: 'https://jazzy.hu/jazzy.mp3' },
  { name: 'PoolWebwork', url: 'https://radios.poolwebwork.com.br/8020/stream' }
];

// Változók a rádió lejátszáshoz
let currentAudio = null;
let isRadioPlaying = false;
let currentRadio = null;
let enterHoldTimeout = null;
let enterPressedTime = 0;
const enterHoldDuration = 1000; // 1 másodperc nyomvatartás az aktiváláshoz

// Enter számláló változó a ciklikus működéshez
let enterPressCount = 0;

// Hangerejének alapértelmezett értéke
let radioVolume = 0.1; // 10% kezdeti érték

// Hangerő szintek (10% alatt speciális értékek)
const volumeLevels = [0, 0.03, 0.05, 0.07, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

// Billentyű állapot változók - EGY helyen definiálva
let key9Pressed = false;
let key1Pressed = false;
let key7Pressed = false;
let key8Pressed = false;
let resetTriggered = false; // Reset trigger változó

// Enter duplaütés változók
let lastEnterPressTime = 0;
const doubleEnterThreshold = 300; // 300ms a duplaütéshez
let isDoubleEnterProcessing = false; // Jelzés, hogy épp feldolgozzuk-e a duplaütést

// Változó a következő rádió típus nyomon követéséhez
let nextRadioType = 'nature'; // 'nature' vagy 'random'

// Fő funkció - idő, akkumulátor, Bitcoin árfolyam, időjárás
function readStatus() {
    console.log("📋 Billentyű kombináció aktiválva: Enter (rövid) vagy 9+1 - Státusz olvasása");
    
    // 1. Aktuális idő (jelenlegi szó nélkül)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeText = `${hours} óra ${minutes} perc van.`;
    
    // 2. Bitcoin árfolyam lekérése
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            const cac = data.bitcoin.usd;
            // Oszd el 1000-rel és formázd egy tizedesjegyre
            const cacInThousands = cac / 1000;
            const priceText = `A csapadék ${cacInThousands.toFixed(1).replace('.', ',')}`;
            
            // 3. Időjárás előrejelzés lekérése (Budapestre)
            const lat = 47.4979; // Budapest szélesség
            const lon = 19.0402; // Budapest hosszúság
            const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max&timezone=auto&forecast_days=2`;
            
            fetch(weatherApiUrl)
                .then(response => response.json())
                .then(weatherData => {
                    const todayRainPercent = weatherData.daily.precipitation_probability_max[0];
                    const tomorrowRainPercent = weatherData.daily.precipitation_probability_max[1];
                    
                    const weatherText = `Ma ${todayRainPercent} százalék eső. Holnap ${tomorrowRainPercent} százalék.`;
                    
                    // 4. Akkumulátor állapot (csak a kiszámított érték, külön beszéddel)
                    if ('getBattery' in navigator) {
                        navigator.getBattery().then(function(battery) {
                            const batteryPercent = Math.round(battery.level * 100);
                            
                            // Először az időt mondjuk be
                            speakNormal(timeText);
                            
                            // Majd az akkumulátort külön
                            setTimeout(() => {
                                speakBattery(batteryPercent, battery.level);
                                
                                // Ezután az árfolyamot
                                setTimeout(() => {
                                    speakPrice(priceText);
                                    
                                    // Végül az időjárást
                                    setTimeout(() => {
                                        speakWeather(weatherText);
                                    }, 1000); // További 1 másodperc késleltetés
                                }, 1000); // 1 másodperc késleltetés
                            }, 1000); // 1 másodperc késleltetés
                        });
                    } else {
                        // Ha nincs akkumulátor információ, csak idő, árfolyam és időjárás
                        speakNormal(timeText);
                        setTimeout(() => {
                            speakPrice(priceText);
                            setTimeout(() => {
                                speakWeather(weatherText);
                            }, 1000);
                        }, 1000);
                    }
                })
                .catch(weatherError => {
                    console.error('Időjárás lekérési hiba:', weatherError);
                    // Ha az időjárás lekérés sikertelen, folytatjuk nélküle
                    if ('getBattery' in navigator) {
                        navigator.getBattery().then(function(battery) {
                            const batteryPercent = Math.round(battery.level * 100);
                            speakNormal(timeText);
                            setTimeout(() => {
                                speakBattery(batteryPercent, battery.level);
                                setTimeout(() => {
                                    speakPrice(priceText);
                                }, 1000);
                            }, 1000);
                        });
                    } else {
                        speakNormal(timeText);
                        setTimeout(() => {
                            speakPrice(priceText);
                        }, 1000);
                    }
                });
        })
        .catch(error => {
            const errorText = `${timeText}. Árfolyam betöltése sikertelen`;
            speakNormal(errorText);
        });
}

// Normál beszéd (idő, árfolyam, időjárás)
function speakNormal(text) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hu-HU';
    utterance.rate = 1;      // Normál sebesség
    utterance.pitch = 1;     // Normál hangmagasság
    utterance.volume = 1;    // Normál hangerő
    
    // Normál beszéd azonnal
    speechSynthesis.speak(utterance);
}

// Akkumulátor beszéd
function speakBattery(batteryPercent, batteryLevel) {
    // Várakozás az előző beszéd befejezésére
    if (speechSynthesis.speaking) {
        setTimeout(() => {
            speakBattery(batteryPercent, batteryLevel);
        }, 500);
        return;
    }
    
    const batteryText = `Akkumulátor ${batteryPercent} százalék`;
    const utterance = new SpeechSynthesisUtterance(batteryText);
    utterance.lang = 'hu-HU';
    
    // Akkumulátor alapú hangbeállítás CSAK az akkumulátor résznél
    const rate = 0.5 + (batteryLevel * 0.5);    // 0.5-1.0 között
    const pitch = 0.5 + (batteryLevel * 0.5);   // 0.5-1.0 között
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    
    speechSynthesis.speak(utterance);
}

// Árfolyam beszéd
function speakPrice(text) {
    // Várakozás az előző beszéd befejezésére
    if (speechSynthesis.speaking) {
        setTimeout(() => {
            speakPrice(text);
        }, 500);
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hu-HU';
    utterance.rate = 1;      // Normál sebesség
    utterance.pitch = 1;     // Normál hangmagasság
    utterance.volume = 1;    // Normál hangerő
    
    speechSynthesis.speak(utterance);
}

// Időjárás beszéd
function speakWeather(text) {
    // Várakozás az előző beszéd befejezésére
    if (speechSynthesis.speaking) {
        setTimeout(() => {
            speakWeather(text);
        }, 500);
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hu-HU';
    utterance.rate = 1;      // Normál sebesség
    utterance.pitch = 1;     // Normál hangmagasság
    utterance.volume = 1;    // Normál hangerő
    
    speechSynthesis.speak(utterance);
}

// Beszéd leállítása - MÓDOSÍTOTT VÁLTOZAT
function stopSpeaking() {
    let wasSpeaking = false;
    
    // Az ÖSSZES folyamatban lévő beszédet leállítjuk
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log("⏹️ ÖSSZES folyamatban lévő beszéd leállítása");
        speechSynthesis.cancel();
        wasSpeaking = true;
    }
    
    // További biztosítás
    const voices = speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        // Ha bármi fennakad, próbáljuk meg újra
        setTimeout(() => {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                console.log("✅ További beszéd leállítva a második próbálkozásnál");
            }
        }, 50);
    }
    
    return wasSpeaking;
}

// Nature Rex rádió indítása
function playNatureRex() {
    // Ha már megy egy rádió, először állítsuk le
    if (currentAudio) {
        stopRadio();
    }
    
    console.log("🎵 Nature Rex rádió indítása");
    // Nature Rex keresése a listában
    const natureRex = defaultRadios.find(radio => radio.name === 'Nature Rex');
    currentRadio = natureRex || defaultRadios[0];
    
    // Először bemondjuk a rádió nevét azonnal
    speakNormal(`${currentRadio.name} rádió betöltése`);
    
    // Mentjük a rádió nevét helyi változóba a hibakezeléshez
    const radioName = currentRadio.name;
    
    // Új Audio objektum létrehozása
    currentAudio = new Audio(currentRadio.url);
    
    // Hangerejének beállítása az aktuális radioVolume értékre
    currentAudio.volume = radioVolume;
    
    // Eseménykezelők
    currentAudio.addEventListener('playing', function() {
        isRadioPlaying = true;
        console.log(`▶️ Rádió elindult: ${radioName}`);
    });
    
    currentAudio.addEventListener('error', function(e) {
        console.error('❌ Rádió betöltési hiba:', e);
        speakNormal(`Nem sikerült betölteni a ${radioName} rádiót`);
        isRadioPlaying = false;
        currentAudio = null;
    });
    
    currentAudio.addEventListener('ended', function() {
        console.log(`⏸️ Rádió véget ért: ${radioName}`);
        isRadioPlaying = false;
        currentAudio = null;
    });
    
    // Lejátszás indítása
    currentAudio.play().catch(error => {
        console.error('❌ Rádió lejátszási hiba:', error);
        speakNormal(`Nem sikerült elindítani a ${radioName} rádiót`);
        isRadioPlaying = false;
        currentAudio = null;
    });
}

// Véletlen rádió indítása
function playRandomRadio() {
    // Ha már megy egy rádió, először állítsuk le
    if (currentAudio) {
        stopRadio();
    }
    
    // Véletlenszerű rádió választása
    const randomIndex = Math.floor(Math.random() * defaultRadios.length);
    currentRadio = defaultRadios[randomIndex];
    console.log(`🎵 Véletlenszerű rádió indítása: ${currentRadio.name}`);
    
    // Először bemondjuk a rádió nevét azonnal
    speakNormal(`${currentRadio.name} rádió betöltése`);
    
    // Mentjük a rádió nevét helyi változóba a hibakezeléshez
    const radioName = currentRadio.name;
    
    // Új Audio objektum létrehozása
    currentAudio = new Audio(currentRadio.url);
    
    // Hangerejének beállítása az aktuális radioVolume értékre
    currentAudio.volume = radioVolume;
    
    // Eseménykezelők
    currentAudio.addEventListener('playing', function() {
        isRadioPlaying = true;
        console.log(`▶️ Rádió elindult: ${radioName}`);
    });
    
    currentAudio.addEventListener('error', function(e) {
        console.error('❌ Rádió betöltési hiba:', e);
        speakNormal(`Nem sikerült betölteni a ${radioName} rádiót`);
        isRadioPlaying = false;
        currentAudio = null;
    });
    
    currentAudio.addEventListener('ended', function() {
        console.log(`⏸️ Rádió véget ért: ${radioName}`);
        isRadioPlaying = false;
        currentAudio = null;
    });
    
    // Lejátszás indítása
    currentAudio.play().catch(error => {
        console.error('❌ Rádió lejátszási hiba:', error);
        speakNormal(`Nem sikerült elindítani a ${radioName} rádiót`);
        isRadioPlaying = false;
        currentAudio = null;
    });
}

function stopRadio() {
    if (currentAudio) {
        console.log(`⏸️ Rádió leállítása: ${currentRadio ? currentRadio.name : 'Ismeretlen'}`);
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    isRadioPlaying = false;
}

// Hangerejének beállítása - javított változat a finom hangszabállyal
function adjustRadioVolume(change) {
    const oldVolume = radioVolume;
    const oldPercent = Math.round(oldVolume * 100);
    
    // Javított hangszabályzás: 10% alatt speciális lépések
    let newVolume;
    
    if (change > 0) {
        // Hangerő növelés
        if (oldVolume < 0.03) newVolume = 0.03;
        else if (oldVolume < 0.05) newVolume = 0.05;
        else if (oldVolume < 0.07) newVolume = 0.07;
        else if (oldVolume < 0.1) newVolume = 0.1;
        else if (oldVolume < 0.2) newVolume = 0.2;
        else if (oldVolume < 0.3) newVolume = 0.3;
        else if (oldVolume < 0.4) newVolume = 0.4;
        else if (oldVolume < 0.5) newVolume = 0.5;
        else if (oldVolume < 0.6) newVolume = 0.6;
        else if (oldVolume < 0.7) newVolume = 0.7;
        else if (oldVolume < 0.8) newVolume = 0.8;
        else if (oldVolume < 0.9) newVolume = 0.9;
        else newVolume = 1.0;
    } else {
        // Hangerő csökkentés
        if (oldVolume > 0.9) newVolume = 0.9;
        else if (oldVolume > 0.8) newVolume = 0.8;
        else if (oldVolume > 0.7) newVolume = 0.7;
        else if (oldVolume > 0.6) newVolume = 0.6;
        else if (oldVolume > 0.5) newVolume = 0.5;
        else if (oldVolume > 0.4) newVolume = 0.4;
        else if (oldVolume > 0.3) newVolume = 0.3;
        else if (oldVolume > 0.2) newVolume = 0.2;
        else if (oldVolume > 0.1) newVolume = 0.1;
        else if (oldVolume > 0.07) newVolume = 0.07;
        else if (oldVolume > 0.05) newVolume = 0.05;
        else if (oldVolume > 0.03) newVolume = 0.03;
        else newVolume = 0;
    }
    
    // Ha nincs változás, akkor nem csinálunk semmit
    if (newVolume === oldVolume) {
        // Még mindig beszéljük a hangerőről
        const volumePercent = Math.round(oldVolume * 100);
        const volumeText = `Hangerő ${volumePercent} százalék`;
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(volumeText);
            utterance.lang = 'hu-HU';
            utterance.rate = 1.2;
            utterance.pitch = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        }, 50);
        
        console.log(`🔊 Hangerő változatlan: ${oldPercent}%`);
        return radioVolume;
    }
    
    // Beállítjuk az új hangerőt
    radioVolume = newVolume;
    const newPercent = Math.round(radioVolume * 100);
    
    // Ha éppen megy a rádió, frissítsük a hangerejét
    if (currentAudio && isRadioPlaying) {
        currentAudio.volume = radioVolume;
    }
    
    // Hangvisszajelzés a pontos százalékkal
    let volumeText;
    if (radioVolume === 0.03) volumeText = "Hangerő három százalék";
    else if (radioVolume === 0.05) volumeText = "Hangerő öt százalék";
    else if (radioVolume === 0.07) volumeText = "Hangerő hét százalék";
    else if (radioVolume === 0.1) volumeText = "Hangerő tíz százalék";
    else volumeText = `Hangerő ${newPercent} százalék`;
    
    // Töröljük az esetleges korábbi beszédet
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // Rövid várakozás, hogy biztosan törlődött
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(volumeText);
        utterance.lang = 'hu-HU';
        utterance.rate = 1.2; // Kicsit gyorsabb, mert rövid üzenet
        utterance.pitch = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    }, 50);
    
    console.log(`🔊 Hangerő változás: ${oldPercent}% → ${newPercent}%`);
    
    return radioVolume;
}

// RESET Oszcillátor dallam - "Reset Fanfare"
function playResetTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Dallam: három rövid, emelkedő hang
        const now = audioContext.currentTime;
        
        // Hang beállítások
        oscillator.type = 'sawtooth'; // "8-bites" hangzás
        oscillator.frequency.setValueAtTime(220, now); // A (Alsó)
        oscillator.frequency.setValueAtTime(330, now + 0.1); // E (Középső)
        oscillator.frequency.setValueAtTime(440, now + 0.2); // A (Felső)
        
        // Hangerő burkoló
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        gainNode.gain.setValueAtTime(0, now + 0.35);
        
        // Lejátszás
        oscillator.start();
        oscillator.stop(now + 0.35);
        
        // AudioContext takarítás
        setTimeout(() => audioContext.close(), 500);
        
    } catch (e) {
        console.log("Oszcillátor nem érhető el:", e);
    }
}

// RESET funkció - CSAK EGY HELYEN DEFINIVÁLVA
function performReset() {
    if (resetTriggered) return; // Már fut a reset
    resetTriggered = true;
    
    console.log("🔄 RESET aktiválva: Enter duplaütés");
    
    // 1. ÖSSZES HANG LEÁLLÍTÁSA
    console.log("⏹️ Összes audio leállítása...");
    
    // Beszéd szintézis leállítása
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log("✅ Beszéd szintézis leállítva");
    }
    
    // Rádió leállítása
    if (isRadioPlaying && stopRadio) {
        stopRadio();
        console.log("✅ Rádió leállítva");
    }
    
    // Egyéb Audio elemek leállítása
    const allAudioElements = document.querySelectorAll('audio, video');
    allAudioElements.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
            console.log("✅ Audio/video elem leállítva:", audio);
        }
    });
    
    // 2. RESET OSZCILLÁTOR DALLAM
    playResetTone();
    
    // 3. Vizuális visszajelzés
    setTimeout(() => {
        const resetOverlay = document.createElement('div');
        resetOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff0000, #0000ff);
            color: white;
            font-size: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: monospace;
            animation: pulse 0.5s infinite alternate;
        `;
        
        // CSS animáció hozzáadása
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                from { opacity: 0.7; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        resetOverlay.textContent = '🔄 RESET 🔄';
        document.body.appendChild(resetOverlay);
        
        // 4. Oldal újratöltése
        setTimeout(() => {
            console.log("🔄 Oldal újratöltése...");
            window.location.reload(true);
        }, 800);
        
    }, 300);
}

// Segédfüggvény a gomb kombinációk blokkolásához
function blockKeyEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log(`🚫 Gomb blokkolva a kombináció miatt: ${event.key}`);
    return false;
}

// Ciklikus működés kezelése Enter rövid nyomásra
function handleShortEnterPress() {
    // Ha van folyamatban beszéd, először állítsuk le
    if (speechSynthesis.speaking) {
        console.log("⏹️ Beszéd folyamatban - leállítás");
        stopSpeaking();
        // Várunk egy kicsit, hogy biztosan leálljon
        setTimeout(() => {
            // Növeljük a számlálót és folytatjuk
            enterPressCount++;
            continueWithCycle();
        }, 100);
    } else {
        // Ha nincs beszéd, folytatjuk normálisan
        enterPressCount++;
        continueWithCycle();
    }
}

// A ciklikus működés folytatása
function continueWithCycle() {
    // A ciklus 3 lépéses: info → rádió indítás → rádió stop
    // Minden 3. lépés után újra info, és a rádió típus vált
    
    const cycleStep = (enterPressCount - 1) % 3; // 0, 1, 2
    
    switch (cycleStep) {
        case 0: // Minden 1., 4., 7., 10. stb. nyomás: INFO
            console.log(`✅ Enter (rövid) - ${enterPressCount}. nyomás: Státusz olvasása`);
            readStatus();
            break;
            
        case 1: // Minden 2., 5., 8., 11. stb. nyomás: RÁDIÓ INDÍTÁS
            // A felhasználó leírása szerint:
            // 1. info
            // 2. Nature Rex
            // 3. stop
            // 4. info
            // 5. véletlen
            // 6. stop
            // 7. info
            // 8. véletlen
            // 9. stop
            // 10. info
            // 11. véletlen
            // 12. stop stb.
            
            // Tehát a 2. nyomás után mindig véletlen
            if (enterPressCount === 2) {
                console.log(`✅ Enter (rövid) - ${enterPressCount}. nyomás: Nature Rex rádió indítása`);
                if (!isRadioPlaying) {
                    playNatureRex();
                } else {
                    speakNormal("Rádió már megy");
                }
            } else {
                console.log(`✅ Enter (rövid) - ${enterPressCount}. nyomás: Véletlen rádió indítása`);
                if (!isRadioPlaying) {
                    playRandomRadio();
                } else {
                    speakNormal("Rádió már megy");
                }
            }
            break;
            
        case 2: // Minden 3., 6., 9., 12. stb. nyomás: RÁDIÓ STOP
            console.log(`✅ Enter (rövid) - ${enterPressCount}. nyomás: Rádió leállítása`);
            if (isRadioPlaying) {
                stopRadio();
                speakNormal("Rádió leállítva");
            } else {
                speakNormal("Nincs rádió a leállításhoz");
            }
            break;
    }
}

// CSAK EGY BILLENTYŰZET ESEMÉNYKEZELŐ - minden itt van
document.addEventListener('keydown', function(event) {
    // Enter gomb kezelése - duplaütés és hosszú nyomás
    if (event.key === 'Enter' || event.keyCode === 13) {
        console.log("⌨️ Enter gomb lenyomva");
        
        // HA van folyamatban beszéd, azonnal leállítjuk ÖSSZESET
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            console.log("⏹️ Beszéd folyamatban - ÖSSZES beszéd azonnali leállítása Enter lenyomásra");
            stopSpeaking();
            // Blokkoljuk az eseményt, hogy ne aktiválódjon más funkció
            blockKeyEvent(event);
            return;
        }
        
        // Ha már folyamatban van egy duplaütés feldolgozás, ne kezdjük újra
        if (isDoubleEnterProcessing) {
            console.log("🔄 Dupla Enter feldolgozás már folyamatban");
            blockKeyEvent(event);
            return;
        }
        
        const currentTime = Date.now();
        
        // Ellenőrizzük, hogy ez duplaütés-e
        if (currentTime - lastEnterPressTime < doubleEnterThreshold) {
            // DUPLA ÜTÉS - RESET
            console.log("🔄 Enter duplaütés érzékelve - RESET indítása");
            isDoubleEnterProcessing = true;
            clearTimeout(enterHoldTimeout);
            enterPressedTime = 0;
            
            // Reset timeout törlése, hogy ne aktiválódjon a hosszú nyomás
            setTimeout(() => {
                isDoubleEnterProcessing = false;
            }, doubleEnterThreshold + 50);
            
            performReset();
            lastEnterPressTime = currentTime;
            blockKeyEvent(event);
            return;
        }
        
        // NEM duplaütés - normál kezelés
        lastEnterPressTime = currentTime;
        
        if (!enterPressedTime) {
            enterPressedTime = Date.now();
            enterHoldTimeout = setTimeout(() => {
                // Csak akkor fut, ha nem volt duplaütés
                if (!isDoubleEnterProcessing) {
                    console.log("🎵 Billentyű kombináció aktiválva: Enter (hosszan) - Rádió indítása/leállítása");
                    if (isRadioPlaying) {
                        stopRadio();
                        speakNormal("Rádió leállítva");
                    } else {
                        playRandomRadio();
                    }
                }
            }, enterHoldDuration);
        }
        
        return; // Kilépünk, hogy ne blokkoljuk a többi kódot
    }
    
    // 9-es gomb
    if (event.key === '9' || event.keyCode === 57) {
        console.log("⌨️ 9-es gomb lenyomva");
        key9Pressed = true;
    }
    
    // 1-es gomb
    if (event.key === '1' || event.keyCode === 49) {
        console.log("⌨️ 1-es gomb lenyomva");
        key1Pressed = true;
    }
    
    // 7-es gomb (9+7 = hangerő csökkentés)
    if (event.key === '7' || event.keyCode === 55) {
        console.log("⌨️ 7-es gomb lenyomva");
        key7Pressed = true;
    }
    
    // 8-as gomb (9+8 = hangerő növelés)
    if (event.key === '8' || event.keyCode === 56) {
        console.log("⌨️ 8-as gomb lenyomva");
        key8Pressed = true;
    }
    
    // 9 és 1 egyszerre lenyomva - státusz olvasás
    if (key9Pressed && key1Pressed) {
        console.log("✅ Billentyű kombináció aktiválva: 9+1 - Státusz olvasása");
        readStatus();
        blockKeyEvent(event);
        // Reseteljük a gomb állapotokat, hogy ne ismétlődjön
        key9Pressed = false;
        key1Pressed = false;
        key7Pressed = false;
        key8Pressed = false;
    }
    
    // 9 és 7 egyszerre lenyomva - hangerő csökkentés
    if (key9Pressed && key7Pressed) {
        console.log("🔉 Billentyű kombináció aktiválva: 9+7 - Hangerő csökkentés");
        adjustRadioVolume(-0.1);
        blockKeyEvent(event);
        // Reseteljük a gomb állapotokat, hogy ne ismétlődjön
        key7Pressed = false;
        key8Pressed = false;
        // A 9-es gombot nem reseteljük, hogy további műveletek is lehetségesek legyenek
    }
    
    // 9 és 8 egyszerre lenyomva - hangerő növelés
    if (key9Pressed && key8Pressed) {
        console.log("🔊 Billentyű kombináció aktiválva: 9+8 - Hangerő növelés");
        adjustRadioVolume(0.1);
        blockKeyEvent(event);
        // Reseteljük a gomb állapotokat, hogy ne ismétlődjön
        key7Pressed = false;
        key8Pressed = false;
        // A 9-es gombot nem reseteljük, hogy további műveletek is lehetségesek legyenek
    }
    
    // Blokkoljuk az egyedi gombokat, amikor a 9-es gomb is lenyomva van
    // Ez megakadályozza, hogy a 7-es vagy 8-as gomb normál funkciója aktiválódjon
    if (key9Pressed && (event.key === '7' || event.key === '8' || event.key === '1')) {
        blockKeyEvent(event);
    }
}, true); // true = capture phase

document.addEventListener('keyup', function(event) {
    // Enter gomb felengedése
    if (event.key === 'Enter' || event.keyCode === 13) {
        console.log("⌨️ Enter gomb felengedve");
        
        // Ha éppen duplaütés feldolgozás van, ne csináljunk semmit
        if (isDoubleEnterProcessing) {
            console.log("🔄 Dupla Enter feldolgozás alatt - hosszú nyomás letiltva");
            enterPressedTime = 0;
            clearTimeout(enterHoldTimeout);
            return;
        }
        
        clearTimeout(enterHoldTimeout);
        
        // Ha rövid volt a nyomás (< 1 másodperc), akkor ciklikus működés
        if (enterPressedTime && (Date.now() - enterPressedTime) < enterHoldDuration) {
            handleShortEnterPress();
        }
        
        enterPressedTime = 0;
    }
    
    // 9-es gomb felengedése
    if (event.key === '9' || event.keyCode === 57) {
        console.log("⌨️ 9-es gomb felengedve");
        key9Pressed = false;
    }
    
    // 1-es gomb felengedése
    if (event.key === '1' || event.keyCode === 49) {
        console.log("⌨️ 1-es gomb felengedve");
        key1Pressed = false;
    }
    
    // 7-es gomb felengedése
    if (event.key === '7' || event.keyCode === 55) {
        console.log("⌨️ 7-es gomb felengedve");
        key7Pressed = false;
        // Ha a 9-es gomb még lenyomva van, blokkoljuk a normál funkciót
        if (key9Pressed) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    
    // 8-as gomb felengedése
    if (event.key === '8' || event.keyCode === 56) {
        console.log("⌨️ 8-as gomb felengedve");
        key8Pressed = false;
        // Ha a 9-es gomb még lenyomva van, blokkoljuk a normál funkciót
        if (key9Pressed) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}, true); // true = capture phase

// Globális elérhetőség
window.readStatus = readStatus;
window.playNatureRex = playNatureRex;
window.playRandomRadio = playRandomRadio;
window.stopRadio = stopRadio;
window.stopSpeaking = stopSpeaking;
window.isRadioPlaying = isRadioPlaying;
window.adjustRadioVolume = adjustRadioVolume;
window.radioVolume = radioVolume;

// Konzolba kiírt billentyű kombinációk összefoglaló
console.log("==========================================");
console.log("🎹 BILLENTYŰ KOMBINÁCIÓK ÖSSZEFOGLALÓ:");
console.log("==========================================");
console.log("Enter (rövid nyomás < 1s) → Ciklikus működés (3 lépéses ciklus):");
console.log("  Ha beszéd folyamatban van → ÖSSZES beszéd azonnali leállítása");
console.log("  1. nyomás: Státusz olvasása");
console.log("  2. nyomás: Nature Rex rádió indítása");
console.log("  3. nyomás: Rádió leállítása");
console.log("  4. nyomás: Státusz olvasása");
console.log("  5. nyomás: Véletlen rádió indítása");
console.log("  6. nyomás: Rádió leállítása");
console.log("  7. nyomás: Státusz olvasása");
console.log("  8. nyomás: Véletlen rádió indítása");
console.log("  9. nyomás: Rádió leállítása");
console.log("  10. nyomás: Státusz olvasása");
console.log("  ... és így tovább");
console.log("Enter (hosszú nyomás ≥ 1s) → Rádió indítása/leállítása");
console.log("Enter (duplaütés 300ms-en belül) → RESET");
console.log("9 + 1 (együtt) → Státusz olvasása");
console.log("9 + 7 (együtt) → Hangerő csökkentése");
console.log("9 + 8 (együtt) → Hangerő növelése");
console.log("==========================================");
console.log("🎚️ HANGERŐ SZINTEK:");
console.log("0%, 3%, 5%, 7%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%");
console.log("==========================================");
console.log("🎵 Az első rádió indításkor (2. Enter): Nature Rex indul");
console.log("🎵 Később (5., 8., 11. stb. Enter): véletlenszerű rádiók");
console.log("==========================================");
console.log("⏹️ ÚJ FUNKCIÓ: Ha Enter-t nyomunk és beszéd folyamatban van,");
console.log("az ÖSSZES folyamatban lévő beszéd azonnal leáll!");
console.log("==========================================");
console.log("🚫 FIGYELEM: A 7, 8, 1 gombok normál funkciói blokkolva vannak,");
console.log("amikor a 9-es gomb is lenyomva van, hogy elkerüljük a gombütközéseket.");
console.log("==========================================");
console.log("⚠️ ENTER DUPLAÜTÉS: Két Enter gombot kell gyorsan megnyomni");
console.log("(300ms-en belül) a RESET funkcióhoz.");
console.log("==========================================");