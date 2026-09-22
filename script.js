/* =========================================
   StudyHub — JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       البيانات
       ========================================= */

    let subjects = JSON.parse(
        localStorage.getItem("studyhub_subjects")
    ) || [];

    let tasks = JSON.parse(
        localStorage.getItem("studyhub_tasks")
    ) || [];

    let studyMinutes = Number(
        localStorage.getItem("studyhub_minutes")
    ) || 0;

    let darkMode =
        localStorage.getItem("studyhub_theme") !== "light";

    /* =========================================
       الوضع الليلي / الفاتح
       ========================================= */

    const themeButton =
        document.getElementById("themeButton");

    function updateTheme() {

        if (darkMode) {
            document.body.classList.remove("light-mode");
            themeButton.textContent = "☀️";
        } else {
            document.body.classList.add("light-mode");
            themeButton.textContent = "🌙";
        }

        localStorage.setItem(
            "studyhub_theme",
            darkMode ? "dark" : "light"
        );
    }

    themeButton.addEventListener("click", () => {

        darkMode = !darkMode;

        updateTheme();

    });

    updateTheme();


    /* =========================================
       تحديث الإحصائيات
       ========================================= */

    function updateStats() {

        const subjectsCount =
            document.getElementById("subjectsCount");

        const tasksCount =
            document.getElementById("tasksCount");

        const studyTime =
            document.getElementById("studyTime");

        const goalsCount =
            document.getElementById("goalsCount");

        subjectsCount.textContent =
            subjects.length + 6;

        tasksCount.textContent =
            tasks.length;

        studyTime.textContent =
            studyMinutes;

        goalsCount.textContent =
            tasks.filter(task => task.completed).length;

        updateProgress();

    }


    /* =========================================
       حساب نسبة التقدم
       ========================================= */

    function updateProgress() {

        const progressPercent =
            document.getElementById("progressPercent");

        const largeProgressFill =
            document.getElementById("largeProgressFill");

        const progressFill =
            document.querySelector(".progress-fill");

        const progressText =
            document.querySelector(".progress-text");

        let percentage = 0;

        if (tasks.length > 0) {

            const completed =
                tasks.filter(task => task.completed).length;

            percentage =
                Math.round(
                    (completed / tasks.length) * 100
                );
        }

        progressPercent.textContent =
            percentage + "%";

        largeProgressFill.style.width =
            percentage + "%";

        progressFill.style.width =
            percentage + "%";

        progressText.textContent =
            percentage + "% مكتمل";
    }


    /* =========================================
       إضافة مادة
       ========================================= */

    window.addSubject = function () {

        const name = prompt(
            "اكتب اسم المادة:"
        );

        if (!name || !name.trim()) {
            return;
        }

        const subjectName =
            name.trim();

        subjects.push(subjectName);

        localStorage.setItem(
            "studyhub_subjects",
            JSON.stringify(subjects)
        );

        renderSubjects();

        updateStats();

    };


    /* =========================================
       عرض المواد الإضافية
       ========================================= */

    function renderSubjects() {

        const container =
            document.getElementById(
                "subjectsContainer"
            );

        document
            .querySelectorAll(".custom-subject")
            .forEach(card => card.remove());

        subjects.forEach((subject, index) => {

            const card =
                document.createElement("div");

            card.className =
                "subject-card custom-subject";

            card.innerHTML = `

                <div class="subject-icon">
                    📘
                </div>

                <h3>
                    ${escapeHTML(subject)}
                </h3>

                <p>
                    مادة مضافة
                </p>

                <button
                    onclick="openSubject('${escapeAttribute(subject)}')">
                    فتح المادة →
                </button>

                <button
                    class="delete-subject"
                    onclick="deleteSubject(${index})"
                    style="
                        display:block;
                        margin-top:8px;
                        color:#ef4444;
                    ">
                    حذف المادة
                </button>
            `;

            container.appendChild(card);

        });

    }


    /* =========================================
       حذف مادة
       ========================================= */

    window.deleteSubject = function (index) {

        const subject =
            subjects[index];

        const confirmed =
            confirm(
                `هل تريد حذف مادة "${subject}"؟`
            );

        if (!confirmed) {
            return;
        }

        subjects.splice(index, 1);

        localStorage.setItem(
            "studyhub_subjects",
            JSON.stringify(subjects)
        );

        renderSubjects();

        updateStats();

    };


    /* =========================================
       فتح المادة
       ========================================= */

    window.openSubject = function (subject) {

        alert(
            `📚 مادة: ${subject}\n\n` +
            `سنضيف داخل المادة لاحقًا:\n` +
            `📝 الملاحظات\n` +
            `📖 الدروس\n` +
            `📎 الملفات\n` +
            `✅ التمارين`
        );

    };


    /* =========================================
       إضافة مهمة
       ========================================= */

    window.addTask = function () {

        const title =
            prompt(
                "ما هي المهمة الدراسية؟"
            );

        if (!title || !title.trim()) {
            return;
        }

        const task = {

            id: Date.now(),

            title: title.trim(),

            completed: false,

            createdAt:
                new Date().toISOString()

        };

        tasks.push(task);

        saveTasks();

        renderTasks();

        updateStats();

    };


    /* =========================================
       حفظ المهام
       ========================================= */

    function saveTasks() {

        localStorage.setItem(
            "studyhub_tasks",
            JSON.stringify(tasks)
        );

    }


    /* =========================================
       عرض المهام
       ========================================= */

    function renderTasks() {

        const container =
            document.getElementById(
                "tasksContainer"
            );

        if (tasks.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <div>📝</div>

                    <h3>
                        لا توجد مهام بعد
                    </h3>

                    <p>
                        أضف أول مهمة دراسية لك.
                    </p>

                    <button
                        onclick="addTask()">
                        إضافة مهمة
                    </button>

                </div>

            `;

            return;
        }


        container.innerHTML = "";


        tasks.forEach(task => {

            const item =
                document.createElement("div");

            item.style.cssText = `

                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:15px;
                padding:18px;
                margin-bottom:10px;
                background:rgba(255,255,255,0.03);
                border:1px solid var(--border);
                border-radius:14px;

            `;


            const left =
                document.createElement("div");

            left.style.cssText = `

                display:flex;
                align-items:center;
                gap:12px;
                flex:1;

            `;


            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked =
                task.completed;

            checkbox.style.cssText = `

                width:20px;
                height:20px;
                cursor:pointer;

            `;


            checkbox.addEventListener(
                "change",
                () => {

                    task.completed =
                        checkbox.checked;

                    saveTasks();

                    renderTasks();

                    updateStats();

                }
            );


            const title =
                document.createElement("span");

            title.textContent =
                task.title;

            title.style.cssText = `

                font-weight:600;

                ${
                    task.completed
                        ? "text-decoration:line-through;opacity:0.5;"
                        : ""
                }

            `;


            left.appendChild(checkbox);
            left.appendChild(title);


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "حذف المهمة";

            deleteButton.style.cssText = `

                border:none;
                background:transparent;
                color:#ef4444;
                cursor:pointer;
                font-size:1.1rem;

            `;


            deleteButton.addEventListener(
                "click",
                () => {

                    tasks =
                        tasks.filter(
                            item =>
                                item.id !== task.id
                        );

                    saveTasks();

                    renderTasks();

                    updateStats();

                }
            );


            item.appendChild(left);

            item.appendChild(deleteButton);

            container.appendChild(item);

        });

    }


    /* =========================================
       مؤقت الدراسة
       ========================================= */

    let timerSeconds = 25 * 60;

    let timerInterval = null;

    let timerRunning = false;


    function updateTimerDisplay() {

        const display =
            document.getElementById(
                "timerDisplay"
            );

        const minutes =
            Math.floor(
                timerSeconds / 60
            );

        const seconds =
            timerSeconds % 60;

        display.textContent =
            String(minutes).padStart(2, "0")
            + ":"
            + String(seconds).padStart(2, "0");

    }


    window.startTimer = function () {

        if (timerRunning) {
            return;
        }

        timerRunning = true;

        timerInterval =
            setInterval(() => {

                if (timerSeconds > 0) {

                    timerSeconds--;

                    updateTimerDisplay();

                    if (
                        timerSeconds % 60 === 0
                    ) {

                        studyMinutes++;

                        localStorage.setItem(
                            "studyhub_minutes",
                            studyMinutes
                        );

                        updateStats();

                    }

                } else {

                    clearInterval(
                        timerInterval
                    );

                    timerRunning = false;

                    alert(
                        "🎉 أحسنت!\nانتهت جلسة الدراسة."
                    );

                }

            }, 1000);

    };


    window.pauseTimer = function () {

        clearInterval(
            timerInterval
        );

        timerRunning = false;

    };


    window.resetTimer = function () {

        clearInterval(
            timerInterval
        );

        timerRunning = false;

        timerSeconds =
            25 * 60;

        updateTimerDisplay();

    };


    /* =========================================
       حماية بسيطة للنصوص
       ========================================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    function escapeAttribute(text) {

        return text
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'");

    }


    /* =========================================
       تشغيل الموقع
       ========================================= */

    renderSubjects();

    renderTasks();

    updateTimerDisplay();

    updateStats();

});


