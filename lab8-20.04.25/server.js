// server.js
const express = require('express');
const path = require('path');
const store = require('./store'); // Потребуется для рендеринга страниц
const apiRouter = require('./rest'); // Подключаем роутер API

const app = express();
const PORT = process.env.PORT || 3000; // Порт сервера

// --- Middleware ---
// 1. Логгер запросов (простой)
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// 2. Парсер JSON тела запроса (для API)
// Замена body-parser.json()
app.use(express.json());

// 3. Парсер URL-encoded тела запроса (для HTML форм)
// Замена body-parser.urlencoded({ extended: false })
app.use(express.urlencoded({ extended: true }));

// 4. Раздача статических файлов из папки 'public' [source: 9]
app.use(express.static(path.join(__dirname, 'public')));

// --- Настройка шаблонизатора EJS --- [source: 10, 12]
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view')); // Указываем папку для шаблонов [source: 9]

// --- Маршруты ---
// 1. API маршруты (подключаем роутер из rest.js)
app.use('/api/recordings', apiRouter);

// 2. Маршруты для рендеринга HTML страниц
// Главная страница - отображение списка записей
app.get('/', async (req, res) => {
    try {
        const recordings = await store.getAllRecordings();
        // Рендерим 'index.ejs' и передаем ему данные
        res.render('index', {
             title: 'Моя фонотека',
             recordings: recordings,
             currentYear: new Date().getFullYear() // Пример передачи доп. данных
        });
    } catch (err) {
        console.error("Error rendering index page:", err);
        res.status(500).send("Ошибка загрузки страницы");
    }
});

// Страница добавления/редактирования (пример)
// GET /edit/:id - Страница редактирования записи
app.get('/edit/:id', async (req, res) => {
    try {
        const recording = await store.getRecordingById(req.params.id);
        if (!recording) {
            return res.status(404).send('Запись не найдена');
        }
        res.render('edit', { title: 'Редактировать запись', recording });
    } catch (err) {
        console.error("Error rendering edit page:", err);
        res.status(500).send("Ошибка загрузки страницы редактирования");
    }
});

// GET /add - Страница добавления новой записи
app.get('/add', (req, res) => {
    // Передаем пустой объект recording для универсальности шаблона edit.ejs
    res.render('edit', { title: 'Добавить запись', recording: null });
});


// --- Обработка ошибок 404 (Not Found) ---
// Должна быть после всех маршрутов
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Страница не найдена' }); // Нужен шаблон view/404.ejs
});

// --- Глобальный обработчик ошибок ---
// Должен быть последним middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(500).send('Что-то пошло не так!');
});


// --- Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});