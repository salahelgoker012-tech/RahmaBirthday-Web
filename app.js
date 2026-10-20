
/* =========================================
   RAHMA BIRTHDAY ❤️
   Complete App + Music + Surprise Box
========================================= */

const APP = document.getElementById("app");

const KEYS = {
    content: "rahmaBirthdayContent",
    game: "rahmaBirthdayGame",
    solved: "rahmaBirthdaySolvedQuestion",
    submissions: "rahmaBirthdaySubmissions",
    hidden: "rahmaBirthdayHiddenPhotos",
    birthday: "rahmaBirthdayCountdown",
    surprise: "rahmaBirthdaySurpriseBox",
    progress: "rahmaBirthdaySurpriseProgress"
};

const BASE_PHOTOS = [
    { id: "1", src: "images/1.jpg", caption: "في عيونك لقيت أجمل حكاية ❤️" },
    { id: "2", src: "images/2.jpg", caption: "كل لحظة معاكي عمر تاني ليا ✨" },
    { id: "3", src: "images/3.jpg", caption: "إنتِ أجمل صدفة غيّرت حياتي 💜" },
    { id: "4", src: "images/4.jpg", caption: "ضحكتك هي المكان اللي قلبي بيرتاح فيه 🥹" },
    { id: "5", src: "images/5.jpg", caption: "وسط زحمة الدنيا، إنتِ اختياري كل مرة ❤️" },
    { id: "6", src: "images/6.jpg", caption: "نفسي أفضل أجمع معاكي ذكريات لآخر العمر 💍" },
    { id: "7", src: "images/7.jpg", caption: "كل صورة لينا بتفكرني إني محظوظ بيكي 🌹" },
    { id: "8", src: "images/8.jpg", caption: "إنتِ مش جزء من حكايتي... إنتِ أحلى ما فيها ❤️" },
    { id: "9", src: "images/9.jpg", caption: "ولو رجع بيا الزمن ألف مرة، هختارك إنتِ كل مرة ♾️" }
];

let activeTimer = null;
let surprisePreview = false;

/* =========================================
   MUSIC SYSTEM 🎵
========================================= */

const MUSIC_PATH = "./اغاني/صلاح.mp3";

const backgroundMusic = document.createElement("audio");

backgroundMusic.id = "rahmaBackgroundMusic";
backgroundMusic.src = MUSIC_PATH;
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.65;

let musicStarted = false;

function updateMusicButton() {
    const control = document.getElementById("musicControl");

    if (!control) return;

    const playing = !backgroundMusic.paused;

    control.textContent = playing ? "🔊" : "🔇";
    control.title = playing ? "إيقاف الأغنية" : "تشغيل الأغنية";
    control.setAttribute(
        "aria-label",
        playing ? "إيقاف الأغنية" : "تشغيل الأغنية"
    );
}

function createMusicButton() {
    if (document.getElementById("musicControl")) return;

    const style = document.createElement("style");

    style.textContent = `
        #musicControl {
            position: fixed;
            bottom: 18px;
            left: 18px;
            z-index: 99999;
            width: 49px;
            height: 49px;
            padding: 0;
            display: none;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid #e9c574;
            background: linear-gradient(135deg,#572579,#201029);
            color: #fff;
            font-size: 22px;
            box-shadow: 0 0 18px rgba(191,123,226,.4);
            cursor: pointer;
        }

        #musicControl.visible {
            display: flex;
        }
    `;

    document.head.appendChild(style);

    const control = document.createElement("button");

    control.id = "musicControl";
    control.type = "button";
    control.textContent = "🔊";

    control.onclick = toggleMusic;

    document.body.appendChild(control);

    backgroundMusic.addEventListener("play", updateMusicButton);
    backgroundMusic.addEventListener("pause", updateMusicButton);

    backgroundMusic.addEventListener("error", () => {
        console.warn(
            "تعذر تحميل الأغنية. تأكد من وجود الملف:",
            MUSIC_PATH
        );
        updateMusicButton();
    });
}

function startBackgroundMusic() {
    createMusicButton();

    document.getElementById("musicControl")
        .classList.add("visible");

    if (!musicStarted) {
        musicStarted = true;
        backgroundMusic.currentTime = 0;
    }

    if (backgroundMusic.paused) {
        const result = backgroundMusic.play();

        if (result && typeof result.catch === "function") {
            result.catch(error => {
                console.warn("Music playback:", error);
                updateMusicButton();
            });
        }
    }

    updateMusicButton();
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(error => {
            console.warn("Music playback:", error);
        });
    } else {
        backgroundMusic.pause();
    }

    updateMusicButton();
}

/* =========================================
   STORAGE AND HELPERS
========================================= */

function read(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("ar");
}

function stopTimer() {
    if (activeTimer !== null) {
        clearInterval(activeTimer);
        activeTimer = null;
    }
}

function getContent() {
    return {
        birthday: "كل سنة وإنتِ طيبة يا رحمة ❤️",
        surprises: "مفاجآت جميلة مستنياكي 🎁",
        memories: "كل صورة لينا وراها حكاية جميلة ❤️",
        ...read(KEYS.content, {})
    };
}

function getGame() {
    return {
        question: "إيه الكلمة اللي بتعبّر عن الحكاية دي؟",
        answer: "حب",
        hint: "إحساس بيخلّي للتفاصيل الصغيرة معنى كبير.",
        message: "كل حكاية جميلة بتتكوّن من تفاصيل وذكريات خاصة ❤️",
        ...read(KEYS.game, {})
    };
}

function getBirthday() {
    return {
        date: "2026-10-22",
        time: "00:00",
        surprise: "كل سنة وإنتِ أجمل حاجة في دنيتي يا رحمة ❤️🎂",
        ...read(KEYS.birthday, {})
    };
}

function getSurprise() {
    return {
        date: "2026-10-22",
        time: "00:00",
        lockedMessage: "في حاجة مستنياكي... بس لكل حاجة حلوة وقتها ❤️",
        letter:
            "يا رحمة ❤️\n\n" +
            "النهارده مش يوم عادي، ده يوم اتولدت فيه أجمل حكاية.\n" +
            "كل سنة وإنتِ طيبة، وكل سنة وضحكتك منوّرة الدنيا.\n\n" +
            "ولسه المفاجأة مخلصتش... 💜",
        finalMessage:
            "ودي مش نهاية المفاجأة...\n" +
            "دي مجرد بداية حكايات لسه هنعيشها سوا ❤️",
        finalImage: "",
        selectedPhotos: BASE_PHOTOS.map(photo => photo.id),
        ...read(KEYS.surprise, {})
    };
}

function shell(title, body, back = null) {
    stopTimer();

    APP.innerHTML = `
        <div class="heart">❤️</div>
        <h1>${escapeHTML(title)}</h1>
        ${body}
        ${back
            ? '<button id="backBtn" type="button" style="margin-top:20px">رجوع ↩</button>'
            : ""}
        <div class="footer">صُنعت بحب ❤️</div>
    `;

    if (back) {
        document.getElementById("backBtn").onclick = back;
    }
}

function button(label, action) {
    const element = document.createElement("button");

    element.type = "button";
    element.textContent = label;
    element.style.marginTop = "12px";
    element.addEventListener("click", action);

    APP.insertBefore(
        element,
        APP.querySelector(".footer")
    );
}

function showText(title, content, back) {
    shell(
        title,
        `<p style="white-space:pre-wrap;line-height:2;margin:20px 0">
            ${escapeHTML(content)}
        </p>`,
        back
    );
}

/* =========================================
   SURPRISE CSS
========================================= */

function addSurpriseStyles() {
    if (document.getElementById("rahmaSurpriseStyles")) return;

    const style = document.createElement("style");
    style.id = "rahmaSurpriseStyles";

    style.textContent = `
        .surprise-stage {
            text-align: center;
            margin: 20px auto;
            width: 100%;
            max-width: 520px;
        }

        .surprise-gift {
            position: relative;
            width: 190px;
            height: 190px;
            margin: 36px auto;
            cursor: pointer;
            animation: giftFloat 2.4s ease-in-out infinite;
        }

        .gift-body {
            position: absolute;
            left: 15px;
            bottom: 0;
            width: 160px;
            height: 125px;
            background: linear-gradient(135deg,#7536a0,#321447);
            border: 2px solid #e9c574;
            border-radius: 8px 8px 15px 15px;
            box-shadow: 0 0 35px rgba(173,89,217,.35);
        }

        .gift-lid {
            position: absolute;
            left: 4px;
            top: 34px;
            width: 182px;
            height: 43px;
            z-index: 3;
            background: linear-gradient(135deg,#9853c0,#46195d);
            border: 2px solid #e9c574;
            border-radius: 9px;
            transform-origin: left bottom;
            transition: transform 1.1s ease,top 1.1s ease;
        }

        .gift-ribbon-v {
            position: absolute;
            left: 79px;
            top: 0;
            height: 100%;
            width: 27px;
            background: linear-gradient(90deg,#b78430,#ffe9a5,#b78430);
        }

        .gift-ribbon-h {
            position: absolute;
            left: 0;
            top: 42px;
            width: 100%;
            height: 24px;
            background: linear-gradient(#b78430,#ffe9a5,#b78430);
        }

        .gift-bow {
            position: absolute;
            top: 0;
            left: 67px;
            font-size: 47px;
            z-index: 4;
            color: #f5cf75;
            transition: transform 1s ease,opacity 1s ease;
        }

        .surprise-gift.opening .gift-lid {
            transform: translateY(-95px) rotate(-24deg);
        }

        .surprise-gift.opening .gift-bow {
            transform: translateY(-105px) rotate(-20deg);
            opacity: 0;
        }

        .surprise-gift.opening {
            animation: giftOpen 1.3s ease forwards;
        }

        .surprise-panel {
            padding: 22px 16px;
            border: 1px solid rgba(232,193,104,.65);
            border-radius: 20px;
            background: linear-gradient(145deg,#2b173b,#130c20);
            box-shadow: 0 0 25px rgba(168,91,209,.2);
            margin: 20px auto;
            max-width: 520px;
        }

        .surprise-letter {
            white-space: pre-wrap;
            text-align: center;
            line-height: 2.2;
            min-height: 150px;
            color: #f6e9fa;
        }

        .surprise-photo {
            width: 100%;
            max-height: 420px;
            object-fit: contain;
            border-radius: 16px;
            border: 1px solid #b9934c;
        }

        .surprise-counter {
            display: grid;
            grid-template-columns: repeat(4,minmax(0,1fr));
            gap: 7px;
            margin: 20px 0;
        }

        .surprise-unit {
            padding: 12px 3px;
            border: 1px solid #b9934c;
            border-radius: 12px;
            background: #23142f;
        }

        .surprise-unit strong {
            display: block;
            color: #f3d28a;
            font-size: clamp(19px,5vw,32px);
            font-variant-numeric: tabular-nums;
        }

        .surprise-unit span {
            font-size: 12px;
            color: #dfd1e7;
        }

        .surprise-hearts {
            font-size: 35px;
            animation: giftFloat 1.6s ease-in-out infinite;
        }

        .surprise-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 16px;
        }

        .surprise-actions button {
            flex: 1;
            min-width: 110px;
        }

        @keyframes giftFloat {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-9px); }
        }

        @keyframes giftOpen {
            0% { transform: scale(1); }
            60% { transform: scale(1.12); }
            100% { transform: scale(1.03); }
        }

        @media(prefers-reduced-motion:reduce) {
            .surprise-gift,.surprise-hearts {
                animation: none;
            }

            .gift-lid,.gift-bow {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);
}

function localDate(date, time = "00:00") {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    return new Date(
        year,
        month - 1,
        day,
        hour || 0,
        minute || 0
    );
}

function timeParts(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));

    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60
    };
}

function counterHTML(parts) {
    const pad = n => String(n).padStart(2, "0");

    return `
        <div class="surprise-counter">
            ${[
                [parts.days, "يوم"],
                [parts.hours, "ساعة"],
                [parts.minutes, "دقيقة"],
                [parts.seconds, "ثانية"]
            ].map(([number, label]) => `
                <div class="surprise-unit">
                    <strong>${pad(number)}</strong>
                    <span>${label}</span>
                </div>
            `).join("")}
        </div>
    `;
}

/* =========================================
   LOGIN
========================================= */

function openRahmaBirthday(code) {
    const value = String(code ?? "").trim();

    // تشغيل الأغنية مباشرة بعد تسجيل الدخول
    startBackgroundMusic();

    if (value === "612006") {
        showAdmin();
    } else if (value === "2210") {
        showRahmaHome();
    } else {
        showFriends(value);
    }
}

window.openRahmaBirthday = openRahmaBirthday;

function showLogin() {
    stopTimer();

    // إيقاف الأغنية عند تسجيل الخروج
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicStarted = false;

    location.reload();
}

/* =========================================
   RAHMA HOME
========================================= */

function showRahmaHome() {
    shell(
        "حكايتنا يا رحمة ❤️",
        '<p class="subtitle">كل تفصيلة هنا معمولة مخصوص علشانك ✨</p>'
    );

    button("⏳ عدّاد عيد ميلادك", showCountdown);

    button("🎂 رسالة عيد الميلاد", () => {
        showText(
            "كل سنة وإنتِ طيبة ❤️",
            getContent().birthday,
            showRahmaHome
        );
    });

    button("💌 لعبة الرسائل المجهولة", showRahmaGame);
    button("🎁 صندوق المفاجأة", () => startSurprise(false));
    button("📸 صندوق الذكريات", showMemories);
    button("🚪 خروج", showLogin);
}

/* =========================================
   BIRTHDAY COUNTDOWN
========================================= */

function getBirthdayState(now, settings) {
    const [, month, day] = settings.date.split("-").map(Number);
    const [hour, minute] = settings.time.split(":").map(Number);

    const start = new Date(
        now.getFullYear(),
        month - 1,
        day,
        hour || 0,
        minute || 0
    );

    const end = new Date(
        now.getFullYear(),
        month - 1,
        day + 1,
        0,
        0
    );

    if (now >= start && now < end) {
        return {
            celebrating: true,
            target: start
        };
    }

    let target = start;

    if (now >= end) {
        target = new Date(
            now.getFullYear() + 1,
            month - 1,
            day,
            hour || 0,
            minute || 0
        );
    }

    return {
        celebrating: false,
        target
    };
}

function showCountdown() {
    addSurpriseStyles();

    const settings = getBirthday();

    shell(
        "كل ثانية بتقربنا من أجمل يوم في السنة يا رحمة 🎂❤️",
        `
        <p class="subtitle">
            كل ثانية بتقربنا من يوم جميل أوي ✨
        </p>

        <div id="countdownArea"></div>
        `,
        showRahmaHome
    );

    const area = document.getElementById("countdownArea");

    function update() {
        if (!area.isConnected) {
            stopTimer();
            return;
        }

        const now = new Date();
        const state = getBirthdayState(now, settings);

        if (state.celebrating) {
            area.innerHTML = `
                <div class="surprise-panel">
                    <div class="surprise-hearts">🎂🎉❤️</div>

                    <h2>كل سنة وإنتِ طيبة يا رحمة!</h2>

                    <p style="white-space:pre-wrap;line-height:2">
                        ${escapeHTML(settings.surprise)}
                    </p>
                </div>
            `;

            stopTimer();
            return;
        }

        area.innerHTML = `
            ${counterHTML(
                timeParts(state.target.getTime() - now.getTime())
            )}

            <p>كل لحظة بتقربنا من أحلى يوم ❤️</p>
        `;
    }

    update();

    if (
        area.isConnected &&
        !getBirthdayState(new Date(), settings).celebrating
    ) {
        activeTimer = setInterval(update, 1000);
    }
}

/* =========================================
   SURPRISE BOX 🎁
========================================= */

function surpriseBack() {
    if (surprisePreview) {
        surprisePreview = false;
        showAdmin();
    } else {
        showRahmaHome();
    }
}

function setSurpriseProgress(stage, index = 0) {
    if (surprisePreview) return;

    save(KEYS.progress, {
        stage,
        index,
        savedAt: Date.now()
    });
}

function startSurprise(preview = false) {
    addSurpriseStyles();

    surprisePreview = preview;

    const settings = getSurprise();
    const unlockDate = localDate(
        settings.date,
        settings.time
    );

    if (!preview && new Date() < unlockDate) {
        showLockedSurprise();
        return;
    }

    if (preview) {
        showGiftStage();
        return;
    }

    const progress = read(KEYS.progress, {
        stage: "gift",
        index: 0
    });

    if (progress.stage === "letter") {
        showSurpriseLetter();
    } else if (progress.stage === "photos") {
        showSurprisePhotos(progress.index || 0);
    } else if (progress.stage === "final") {
        showFinalGift();
    } else if (progress.stage === "done") {
        showSurpriseEnding();
    } else {
        showGiftStage();
    }
}

function showLockedSurprise() {
    const settings = getSurprise();

    const unlockDate = localDate(
        settings.date,
        settings.time
    );

    shell(
        "صندوق المفاجأة 🎁",
        `
        <div class="surprise-stage">

            <div class="surprise-gift"
                role="img"
                aria-label="صندوق هدايا مقفول">

                <div class="gift-body">
                    <div class="gift-ribbon-v"></div>
                    <div class="gift-ribbon-h"></div>
                </div>

                <div class="gift-lid">
                    <div class="gift-ribbon-v"></div>
                </div>

                <div class="gift-bow">🎀</div>
            </div>

            <h2>لسه المفاجأة مستنياكي 🔒</h2>

            <p style="white-space:pre-wrap;line-height:2">
                ${escapeHTML(settings.lockedMessage)}
            </p>

            <div id="surpriseLockedCounter"></div>

        </div>
        `,
        showRahmaHome
    );

    const counter = document.getElementById(
        "surpriseLockedCounter"
    );

    function update() {
        if (!counter.isConnected) {
            stopTimer();
            return;
        }

        const remaining =
            unlockDate.getTime() - Date.now();

        if (remaining <= 0) {
            stopTimer();
            showGiftStage();
            return;
        }

        counter.innerHTML = counterHTML(
            timeParts(remaining)
        );
    }

    update();

    if (counter.isConnected) {
        activeTimer = setInterval(update, 1000);
    }
}

function showGiftStage() {
    setSurpriseProgress("gift");

    shell(
        "أول مفاجأة ليكي 🎁",
        `
        <div class="surprise-stage">

            <p class="subtitle">
                الصندوق ده شايل حاجة معمولة مخصوص ليكي ❤️
            </p>

            <div class="surprise-gift"
                id="openingGift"
                role="img"
                aria-label="صندوق هدايا بنفسجي وذهبي">

                <div class="gift-body">
                    <div class="gift-ribbon-v"></div>
                    <div class="gift-ribbon-h"></div>
                </div>

                <div class="gift-lid">
                    <div class="gift-ribbon-v"></div>
                </div>

                <div class="gift-bow">🎀</div>
            </div>

            <button id="openGiftBtn" type="button">
                افتحي هديتك يا رحمة ❤️
            </button>

            <p id="openingMessage" role="status"></p>

        </div>
        `,
        surpriseBack
    );

    document.getElementById("openGiftBtn").onclick = () => {
        const gift = document.getElementById("openingGift");
        const control = document.getElementById("openGiftBtn");

        control.disabled = true;
        gift.classList.add("opening");

        document.getElementById("openingMessage").textContent =
            "✨ 💜 ❤️ ✨";

        setTimeout(() => {
            if (gift.isConnected) {
                showSurpriseLetter();
            }
        }, 1400);
    };
}

function showSurpriseLetter() {
    setSurpriseProgress("letter");

    const settings = getSurprise();

    shell(
        "رسالة من القلب 💌",
        `
        <div class="surprise-panel">

            <div class="surprise-hearts">💌❤️</div>

            <p class="surprise-letter"
                id="typingLetter"
                aria-live="off"></p>

            <button id="skipTypingBtn" type="button">
                إظهار الرسالة كاملة
            </button>

            <button id="nextLetterBtn"
                type="button"
                style="display:none;margin-top:12px">
                كمّلي المفاجأة ❤️
            </button>

        </div>
        `,
        surpriseBack
    );

    const text = settings.letter;
    const output = document.getElementById("typingLetter");
    const skip = document.getElementById("skipTypingBtn");
    const next = document.getElementById("nextLetterBtn");

    let index = 0;

    function finish() {
        stopTimer();

        output.textContent = text;
        skip.style.display = "none";
        next.style.display = "";
    }

    skip.onclick = finish;

    next.onclick = () => showSurprisePhotos(0);

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        finish();
        return;
    }

    activeTimer = setInterval(() => {
        if (!output.isConnected) {
            stopTimer();
            return;
        }

        index = Math.min(index + 2, text.length);
        output.textContent = text.slice(0, index);

        if (index >= text.length) {
            finish();
        }
    }, 65);
}

function selectedSurprisePhotos() {
    const settings = getSurprise();

    return settings.selectedPhotos
        .map(id => BASE_PHOTOS.find(photo => photo.id === id))
        .filter(Boolean);
}

function showSurprisePhotos(index = 0) {
    const photos = selectedSurprisePhotos();

    if (!photos.length) {
        showFinalGift();
        return;
    }

    const current = Math.max(
        0,
        Math.min(index, photos.length - 1)
    );

    setSurpriseProgress("photos", current);

    const photo = photos[current];

    shell(
        "ذكرياتنا الجميلة 📸❤️",
        `
        <div class="surprise-panel">

            <p>${current + 1} / ${photos.length}</p>

            <img class="surprise-photo"
                src="${escapeHTML(photo.src)}"
                alt="${escapeHTML(photo.caption)}">

            <p style="line-height:2;margin-top:15px">
                ${escapeHTML(photo.caption)}
            </p>

            <div class="surprise-actions">

                <button id="previousPhoto" type="button">
                    السابقة
                </button>

                <button id="nextPhoto" type="button">
                    ${current === photos.length - 1
                        ? "الهدية الأخيرة 🎁"
                        : "التالية ❤️"}
                </button>

            </div>

            <button id="skipPhotos"
                type="button"
                style="margin-top:12px">
                تخطي عرض الصور
            </button>

        </div>
        `,
        surpriseBack
    );

    const previous = document.getElementById(
        "previousPhoto"
    );

    previous.disabled = current === 0;

    previous.onclick = () => {
        showSurprisePhotos(current - 1);
    };

    document.getElementById("nextPhoto").onclick = () => {
        if (current === photos.length - 1) {
            showFinalGift();
        } else {
            showSurprisePhotos(current + 1);
        }
    };

    document.getElementById("skipPhotos").onclick =
        showFinalGift;
}

function showFinalGift() {
    setSurpriseProgress("final");

    shell(
        "فاضل آخر هدية 💜",
        `
        <div class="surprise-panel">

            <div class="surprise-hearts">🎁✨❤️</div>

            <h2>فاكرة إن المفاجأة خلصت؟</h2>

            <p>لسه في حاجة أخيرة مستنياكي...</p>

            <button id="openFinalGift" type="button">
                افتحي آخر هدية 🎁
            </button>

        </div>
        `,
        surpriseBack
    );

    document.getElementById("openFinalGift").onclick =
        showSurpriseEnding;
}

function showSurpriseEnding() {
    setSurpriseProgress("done");

    const settings = getSurprise();

    shell(
        "كل سنة وإنتِ أجمل حكاية ❤️",
        `
        <div class="surprise-panel">

            <div class="surprise-hearts">🎉💜🎂💜🎉</div>

            <h2>مفاجأتك الأخيرة يا رحمة</h2>

            ${settings.finalImage ? `
                <img class="surprise-photo"
                    src="${escapeHTML(settings.finalImage)}"
                    alt="الهدية الأخيرة">
            ` : ""}

            <p style="
                white-space:pre-wrap;
                line-height:2.2;
                margin-top:20px;
            ">${escapeHTML(settings.finalMessage)}</p>

            <div class="surprise-hearts">❤️✨❤️</div>

            <button id="replaySurprise" type="button">
                عيشي المفاجأة من أولها تاني ❤️
            </button>

        </div>
        `,
        surpriseBack
    );

    document.getElementById("replaySurprise").onclick = () => {
        if (!surprisePreview) {
            save(KEYS.progress, {
                stage: "gift",
                index: 0
            });
        }

        showGiftStage();
    };
}

/* =========================================
   ADMIN SURPRISE SETTINGS
========================================= */

function showSurpriseAdmin() {
    const settings = getSurprise();

    shell(
        "إدارة صندوق المفاجأة 🎁",
        `
        <form id="surpriseAdminForm">

            <h3>📅 موعد فتح الصندوق</h3>

            <input id="surpriseDate"
                type="date"
                required
                value="${escapeHTML(settings.date)}">

            <input id="surpriseTime"
                type="time"
                required
                value="${escapeHTML(settings.time)}">

            <h3>🔒 رسالة ما قبل الفتح</h3>

            <textarea id="surpriseLockedMessage"
                required>${escapeHTML(settings.lockedMessage)}</textarea>

            <h3>💌 الرسالة اللي هتظهر تدريجيًا</h3>

            <textarea id="surpriseLetter"
                required
                rows="8">${escapeHTML(settings.letter)}</textarea>

            <h3>📸 اختار صور عرض الذكريات</h3>

            <p class="subtitle">
                اكتب ترتيب الصور بالأرقام وافصل بينهم بفاصلة.
                مثال: 3,1,2,5
            </p>

            <input id="surprisePhotoOrder"
                value="${escapeHTML(settings.selectedPhotos.join(","))}"
                placeholder="1,2,3,4,5,6,7,8,9">

            <h3>🎁 نص الهدية الأخيرة</h3>

            <textarea id="surpriseFinalMessage"
                required
                rows="6">${escapeHTML(settings.finalMessage)}</textarea>

            <h3>🖼️ صورة الهدية الأخيرة (اختياري)</h3>

            <input id="surpriseFinalImage"
                type="file"
                accept="image/*">

            <p class="subtitle">
                الصورة لازم تكون أقل من 1 ميجابايت.
            </p>

            <p id="existingFinalImage"></p>

            <button type="submit">
                💾 حفظ صندوق المفاجأة
            </button>

        </form>

        <p id="surpriseAdminStatus" role="status"></p>
        `,
        showAdmin
    );

    const imageLabel = document.getElementById(
        "existingFinalImage"
    );

    imageLabel.textContent = settings.finalImage
        ? "في صورة محفوظة حاليًا للهدية الأخيرة ❤️"
        : "مفيش صورة محفوظة للهدية الأخيرة.";

    document.getElementById("surpriseAdminForm").onsubmit =
        async event => {
            event.preventDefault();

            const value = id =>
                document.getElementById(id).value.trim();

            const file = document.getElementById(
                "surpriseFinalImage"
            ).files[0];

            const status = document.getElementById(
                "surpriseAdminStatus"
            );

            const selected = value("surprisePhotoOrder")
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (
                selected.some(id =>
                    !BASE_PHOTOS.some(photo => photo.id === id)
                ) ||
                new Set(selected).size !== selected.length
            ) {
                status.textContent =
                    "ترتيب الصور لازم يحتوي أرقام من 1 إلى 9 بدون تكرار.";
                return;
            }

            let finalImage = settings.finalImage;

            if (file) {
                if (
                    !file.type.startsWith("image/") ||
                    file.size > 1024 * 1024
                ) {
                    status.textContent =
                        "اختار صورة صحيحة أقل من 1 ميجابايت.";
                    return;
                }

                try {
                    finalImage = await new Promise(
                        (resolve, reject) => {
                            const reader = new FileReader();

                            reader.onload = () =>
                                resolve(reader.result);

                            reader.onerror = reject;

                            reader.readAsDataURL(file);
                        }
                    );
                } catch {
                    status.textContent =
                        "حصلت مشكلة أثناء قراءة الصورة.";
                    return;
                }
            }

            const updated = {
                date: value("surpriseDate"),
                time: value("surpriseTime"),
                lockedMessage: value("surpriseLockedMessage"),
                letter: value("surpriseLetter"),
                selectedPhotos: selected,
                finalMessage: value("surpriseFinalMessage"),
                finalImage
            };

            try {
                save(KEYS.surprise, updated);

                status.textContent =
                    "تم حفظ صندوق المفاجأة بنجاح ❤️";
            } catch {
                status.textContent =
                    "التخزين مش كافي. جرّب صورة أصغر.";
            }
        };

    button("👀 معاينة المفاجأة كاملة", () => {
        startSurprise(true);
    });

    button("🔄 إعادة تجربة رحمة من البداية", () => {
        if (!confirm(
            "ده هيرجع تقدم المفاجأة لأول مرحلة على الجهاز ده. موافق؟"
        )) return;

        save(KEYS.progress, {
            stage: "gift",
            index: 0
        });

        alert("تمت إعادة تجربة المفاجأة ❤️");
    });
}

/* =========================================
   MYSTERY MESSAGE GAME
========================================= */

function showRahmaGame() {
    const game = getGame();
    const solved = read(KEYS.solved, false);

    shell(
        "لعبة الرسائل المجهولة 💌",
        `
        <p class="subtitle">
            الرسالة هتفضل مجهولة لحد ما تجاوبِي صح ❤️
        </p>

        <p>
            نقاطك: <strong>${solved ? 10 : 0}</strong> ⭐
        </p>

        <p style="margin:18px 0">
            ${escapeHTML(game.question)}
        </p>

        <form id="gameForm">
            <input id="gameAnswer"
                placeholder="اكتبي إجابتك"
                required>

            <button type="submit">
                تأكيد الإجابة ❤️
            </button>
        </form>

        <button id="hintBtn"
            type="button"
            style="margin-top:12px">
            💡 تلميح
        </button>

        <p id="gameFeedback"
            role="status"
            style="margin-top:16px"></p>

        ${solved ? `
            <div class="card">
                <h3>الرسالة اتفتحت ❤️</h3>

                <p style="white-space:pre-wrap">
                    ${escapeHTML(game.message)}
                </p>
            </div>
        ` : ""}
        `,
        showRahmaHome
    );

    document.getElementById("hintBtn").onclick = () => {
        document.getElementById("gameFeedback").textContent =
            game.hint;
    };

    document.getElementById("gameForm").onsubmit = event => {
        event.preventDefault();

        const answer = document.getElementById(
            "gameAnswer"
        ).value;

        if (normalize(answer) === normalize(game.answer)) {
            save(KEYS.solved, true);
            showRahmaGame();
        } else {
            document.getElementById("gameFeedback").textContent =
                "لسه مش الإجابة الصح، جرّبي تاني ❤️";
        }
    };
}

/* =========================================
   PHOTO DATABASE
========================================= */

const DB_NAME = "RahmaBirthdayPhotos";
const STORE_NAME = "photos";

function openPhotoDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function photoOperation(mode, value) {
    const db = await openPhotoDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(
            STORE_NAME,
            mode === "getAll" ? "readonly" : "readwrite"
        );

        const store = tx.objectStore(STORE_NAME);

        let request;

        if (mode === "getAll") {
            request = store.getAll();
        }

        if (mode === "add") {
            request = store.add(value);
        }

        if (mode === "delete") {
            request = store.delete(value);
        }

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);

        tx.oncomplete = () => db.close();
        tx.onerror = () => db.close();
    });
}

function photoCard(
    src,
    caption,
    deleteAction = null,
    back = showMemories
) {
    const card = document.createElement("div");

    card.className = "card";
    card.style.margin = "0";

    const img = document.createElement("img");

    img.src = src;
    img.alt = caption;
    img.loading = "lazy";

    img.style.cssText = `
        width:100%;
        aspect-ratio:1;
        object-fit:cover;
        cursor:pointer;
        border-radius:12px;
    `;

    img.onclick = () => showFullPhoto(
        src,
        caption,
        back
    );

    card.appendChild(img);

    const title = document.createElement("p");

    title.textContent = caption;
    title.style.marginTop = "8px";

    card.appendChild(title);

    if (deleteAction) {
        const del = document.createElement("button");

        del.type = "button";
        del.textContent = "🗑️ حذف / إخفاء";
        del.style.marginTop = "8px";
        del.onclick = deleteAction;

        card.appendChild(del);
    }

    return card;
}

function showFullPhoto(
    src,
    caption,
    back = showMemories
) {
    shell(
        "ذكرى جميلة ❤️",
        `
        <p class="subtitle">
            ${escapeHTML(caption)}
        </p>

        <img id="fullMemoryPhoto"
            alt="${escapeHTML(caption)}"
            style="
                width:100%;
                height:auto;
                object-fit:contain;
            ">
        `,
        back
    );

    document.getElementById("fullMemoryPhoto").src = src;
}

/* =========================================
   RAHMA MEMORIES
========================================= */

async function showMemories() {
    shell(
        "صندوق ذكرياتنا 📸❤️",
        `
        <p class="subtitle">
            ${escapeHTML(getContent().memories)}
        </p>

        <div id="photoGallery" style="
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:12px;
            width:100%;
        "></div>

        <p id="photoStatus" role="status"></p>
        `,
        showRahmaHome
    );

    const gallery = document.getElementById("photoGallery");
    const hidden = read(KEYS.hidden, []);

    BASE_PHOTOS
        .filter(photo => !hidden.includes(photo.id))
        .forEach(photo => {
            gallery.appendChild(
                photoCard(photo.src, photo.caption)
            );
        });

    try {
        const uploaded = await photoOperation("getAll");

        if (!gallery.isConnected) return;

        uploaded.forEach(photo => {
            const url = URL.createObjectURL(photo.file);

            gallery.appendChild(
                photoCard(
                    url,
                    photo.caption || "ذكرى جميلة ❤️"
                )
            );
        });

        if (!gallery.children.length) {
            document.getElementById("photoStatus").textContent =
                "لسه مفيش صور في صندوق الذكريات.";
        }
    } catch {
        if (gallery.isConnected) {
            document.getElementById("photoStatus").textContent =
                "الصور الأساسية موجودة، لكن تعذّر تحميل الصور المحلية.";
        }
    }
}

/* =========================================
   ADMIN PHOTOS
========================================= */

async function showPhotoAdmin() {
    shell(
        "إدارة صندوق الذكريات 📸",
        `
        <form id="addPhotoForm">

            <input id="newPhoto"
                type="file"
                accept="image/*"
                required>

            <input id="photoCaption"
                placeholder="اكتب كلام رومانسي للصورة (اختياري)">

            <button type="submit">
                إضافة الصورة ❤️
            </button>

        </form>

        <p id="uploadStatus"
            role="status"
            style="margin:12px 0"></p>

        <h3>الصور الأساسية</h3>

        <p class="subtitle">
            تقدر تخفي أي صورة وترجع تظهرها تاني.
        </p>

        <div id="baseAdminGallery" style="
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:12px;
        "></div>

        <h3>الصور المضافة من لوحة الإدارة</h3>

        <div id="uploadedAdminGallery" style="
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:12px;
        "></div>
        `,
        showAdmin
    );

    const hidden = read(KEYS.hidden, []);

    const baseGallery = document.getElementById(
        "baseAdminGallery"
    );

    BASE_PHOTOS.forEach(photo => {
        const isHidden = hidden.includes(photo.id);

        const card = photoCard(
            photo.src,
            photo.caption,
            () => {
                const current = read(KEYS.hidden, []);

                save(
                    KEYS.hidden,
                    current.includes(photo.id)
                        ? current.filter(id => id !== photo.id)
                        : [...current, photo.id]
                );

                showPhotoAdmin();
            },
            showPhotoAdmin
        );

        const control = card.querySelector("button");

        if (control) {
            control.textContent = isHidden
                ? "👁️ إظهار الصورة"
                : "🙈 إخفاء الصورة";
        }

        baseGallery.appendChild(card);
    });

    const uploadedGallery = document.getElementById(
        "uploadedAdminGallery"
    );

    try {
        const uploaded = await photoOperation("getAll");

        if (!uploadedGallery.isConnected) return;

        uploaded.forEach(photo => {
            const url = URL.createObjectURL(photo.file);

            uploadedGallery.appendChild(
                photoCard(
                    url,
                    photo.caption || "ذكرى جميلة ❤️",
                    async () => {
                        if (!confirm(
                            "متأكد إنك عايز تحذف الصورة؟"
                        )) return;

                        await photoOperation(
                            "delete",
                            photo.id
                        );

                        showPhotoAdmin();
                    },
                    showPhotoAdmin
                )
            );
        });
    } catch {
        if (uploadedGallery.isConnected) {
            uploadedGallery.textContent =
                "تعذّر الوصول إلى الصور المحفوظة.";
        }
    }

    document.getElementById("addPhotoForm").onsubmit =
        async event => {
            event.preventDefault();

            const file = document.getElementById(
                "newPhoto"
            ).files[0];

            const caption = document.getElementById(
                "photoCaption"
            ).value.trim();

            const status = document.getElementById(
                "uploadStatus"
            );

            if (!file || !file.type.startsWith("image/")) {
                status.textContent =
                    "اختار صورة صحيحة الأول.";
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                status.textContent =
                    "اختار صورة أقل من 10 ميجابايت.";
                return;
            }

            try {
                await photoOperation("add", {
                    file,
                    caption,
                    createdAt: Date.now()
                });

                showPhotoAdmin();
            } catch {
                status.textContent =
                    "مش قادر أحفظ الصورة. راجع مساحة التخزين.";
            }
        };
}

/* =========================================
   FRIENDS PAGE
========================================= */

function showFriends(name) {
    const friendName = name.trim() || "صديق رحمة";

    shell(
        `أهلًا يا ${friendName} ❤️`,
        `
        <p class="subtitle">
            سيب رسالة جميلة لرحمة في عيد ميلادها 🎂
        </p>

        <form id="friendForm">

            <textarea id="friendMessage"
                placeholder="اكتب رسالتك لرحمة..."
                required></textarea>

            <input id="friendPhoto"
                type="file"
                accept="image/*">

            <button type="submit">
                إرسال الرسالة ❤️
            </button>

        </form>

        <p id="friendStatus" role="status"></p>
        `,
        showLogin
    );

    document.getElementById("friendForm").onsubmit =
        async event => {
            event.preventDefault();

            const message = document.getElementById(
                "friendMessage"
            ).value.trim();

            const file = document.getElementById(
                "friendPhoto"
            ).files[0];

            const status = document.getElementById(
                "friendStatus"
            );

            if (!message) return;

            if (file && file.size > 1024 * 1024) {
                status.textContent =
                    "اختار صورة أقل من 1 ميجابايت.";
                return;
            }

            let photo = "";

            if (file) {
                try {
                    photo = await new Promise(
                        (resolve, reject) => {
                            const reader = new FileReader();

                            reader.onload = () =>
                                resolve(reader.result);

                            reader.onerror = reject;

                            reader.readAsDataURL(file);
                        }
                    );
                } catch {
                    status.textContent =
                        "حصلت مشكلة أثناء قراءة الصورة.";
                    return;
                }
            }

            const submissions = read(
                KEYS.submissions,
                []
            );

            submissions.push({
                id: Date.now(),
                name: friendName,
                message,
                photo,
                date: new Date().toLocaleString("ar-EG")
            });

            try {
                save(KEYS.submissions, submissions);

                status.textContent =
                    "رسالتك اتحفظت بنجاح ❤️";

                document.getElementById(
                    "friendForm"
                ).reset();
            } catch {
                status.textContent =
                    "مساحة التخزين مش كافية. جرّب من غير صورة.";
            }
        };
}

/* =========================================
   FRIENDS SUBMISSIONS
========================================= */

function showSubmissions() {
    shell(
        "رسائل الأصحاب 💌",
        '<div id="submissionsList"></div>',
        showAdmin
    );

    const list = document.getElementById(
        "submissionsList"
    );

    const submissions = read(
        KEYS.submissions,
        []
    );

    if (!submissions.length) {
        list.textContent = "لسه مفيش رسائل.";
        return;
    }

    submissions.forEach(item => {
        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(item.name)}</h3>

            <p style="white-space:pre-wrap">
                ${escapeHTML(item.message)}
            </p>

            <p>${escapeHTML(item.date)}</p>
        `;

        if (item.photo) {
            const img = document.createElement("img");

            img.src = item.photo;
            img.alt = "صورة مرفقة";

            card.appendChild(img);
        }

        const del = document.createElement("button");

        del.type = "button";
        del.textContent = "حذف الرسالة";

        del.onclick = () => {
            if (!confirm("حذف الرسالة؟")) return;

            save(
                KEYS.submissions,
                read(KEYS.submissions, []).filter(
                    entry => entry.id !== item.id
                )
            );

            showSubmissions();
        };

        card.appendChild(del);
        list.appendChild(card);
    });
}

/* =========================================
   MAIN ADMIN PANEL
========================================= */

function showAdmin() {
    const content = getContent();
    const game = getGame();
    const birthday = getBirthday();

    shell(
        "لوحة الإدارة ⚙️",
        `
        <p class="subtitle">
            التحكم في محتوى Rahma Birthday ❤️
        </p>

        <form id="adminForm">

            <h3>🎂 رسالة عيد الميلاد</h3>

            <textarea id="editBirthday"
                required>${escapeHTML(content.birthday)}</textarea>

            <h3>🎁 النص القديم للمفاجآت</h3>

            <textarea id="editSurprises"
                required>${escapeHTML(content.surprises)}</textarea>

            <h3>📸 وصف صندوق الذكريات</h3>

            <textarea id="editMemories"
                required>${escapeHTML(content.memories)}</textarea>

            <h3>⏳ تاريخ عيد ميلاد رحمة</h3>

            <input id="editBirthdayDate"
                type="date"
                required
                value="${escapeHTML(birthday.date)}">

            <h3>🕛 ساعة فتح مفاجأة العدّاد</h3>

            <input id="editBirthdayTime"
                type="time"
                required
                value="${escapeHTML(birthday.time)}">

            <h3>❤️ رسالة مفاجأة العدّاد</h3>

            <textarea id="editCountdownSurprise"
                required>${escapeHTML(birthday.surprise)}</textarea>

            <h3>💌 سؤال اللعبة</h3>

            <input id="editQuestion"
                required
                value="${escapeHTML(game.question)}">

            <h3>الإجابة الصحيحة</h3>

            <input id="editAnswer"
                required
                value="${escapeHTML(game.answer)}">

            <h3>التلميح</h3>

            <textarea id="editHint"
                required>${escapeHTML(game.hint)}</textarea>

            <h3>الرسالة بعد الإجابة الصحيحة</h3>

            <textarea id="editGameMessage"
                required>${escapeHTML(game.message)}</textarea>

            <button type="submit">
                💾 حفظ التعديلات
            </button>

        </form>

        <p id="adminStatus"
            role="status"
            style="margin-top:12px"></p>
        `
    );

    document.getElementById("adminForm").onsubmit =
        event => {
            event.preventDefault();

            const value = id =>
                document.getElementById(id).value.trim();

            const oldGame = getGame();

            const newGame = {
                question: value("editQuestion"),
                answer: value("editAnswer"),
                hint: value("editHint"),
                message: value("editGameMessage")
            };

            try {
                save(KEYS.content, {
                    birthday: value("editBirthday"),
                    surprises: value("editSurprises"),
                    memories: value("editMemories")
                });

                save(KEYS.birthday, {
                    date: value("editBirthdayDate"),
                    time: value("editBirthdayTime"),
                    surprise: value("editCountdownSurprise")
                });

                save(KEYS.game, newGame);

                if (
                    oldGame.question !== newGame.question ||
                    oldGame.answer !== newGame.answer
                ) {
                    save(KEYS.solved, false);
                }

                document.getElementById(
                    "adminStatus"
                ).textContent =
                    "تم حفظ كل التعديلات بنجاح ❤️";
            } catch {
                document.getElementById(
                    "adminStatus"
                ).textContent =
                    "حصلت مشكلة أثناء الحفظ.";
            }
        };

    button(
        "🎁 إدارة صندوق المفاجأة",
        showSurpriseAdmin
    );

    button("👀 معاينة المفاجأة كاملة", () => {
        startSurprise(true);
    });

    button(
        "⏳ معاينة عدّاد عيد الميلاد",
        showCountdown
    );

    button(
        "📸 إدارة صور الذكريات",
        showPhotoAdmin
    );

    button(
        "💌 مراجعة رسائل الأصحاب",
        showSubmissions
    );

    button(
        "👀 معاينة صفحة رحمة",
        showRahmaHome
    );

    button("🚪 خروج", showLogin);
}

/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.showRahmaHome = showRahmaHome;
window.showAdmin = showAdmin;
window.showFriends = showFriends;
