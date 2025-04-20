// rest.js
const express = require('express');
const store = require('./store'); // Подключаем модуль store.js

const router = express.Router();

// Middleware для логирования запросов к API (опционально)
router.use((req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    next();
});

// --- API Routes ---

// GET /api/recordings - Получить все записи
router.get('/', async (req, res) => {
    try {
        const recordings = await store.getAllRecordings();
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving recordings", error: error.message });
    }
});

// GET /api/recordings/:id - Получить одну запись по ID
router.get('/:id', async (req, res) => {
    try {
        const recording = await store.getRecordingById(req.params.id);
        if (!recording) {
            return res.status(404).json({ message: "Recording not found" });
        }
        res.json(recording);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving recording", error: error.message });
    }
});

// POST /api/recordings - Создать новую запись
router.post('/', async (req, res) => {
    try {
        // Простая валидация (можно добавить более сложную)
        const { title, artist, genre, year } = req.body;
        if (!title || !artist || !genre || !year) {
            return res.status(400).json({ message: "Missing required fields (title, artist, genre, year)" });
        }
        const newRecording = await store.addRecording({ title, artist, genre, year: parseInt(year) });
        res.status(201).json(newRecording); // 201 Created
    } catch (error) {
        res.status(500).json({ message: "Error adding recording", error: error.message });
    }
});

// PUT /api/recordings/:id - Обновить запись по ID
router.put('/:id', async (req, res) => {
    try {
        const { title, artist, genre, year } = req.body;
        // Можно добавить валидацию полей, которые пришли
        const updatedData = { title, artist, genre, year: year ? parseInt(year) : undefined };
        // Удаляем undefined поля, чтобы не перезаписывать их
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

        if (Object.keys(updatedData).length === 0) {
             return res.status(400).json({ message: "No fields to update provided" });
        }

        const updatedRecording = await store.updateRecording(req.params.id, updatedData);
        if (!updatedRecording) {
            return res.status(404).json({ message: "Recording not found" });
        }
        res.json(updatedRecording);
    } catch (error) {
        res.status(500).json({ message: "Error updating recording", error: error.message });
    }
});

// DELETE /api/recordings/:id - Удалить запись по ID
router.delete('/:id', async (req, res) => {
    try {
        const success = await store.deleteRecording(req.params.id);
        if (!success) {
            return res.status(404).json({ message: "Recording not found" });
        }
        res.status(204).send(); // 204 No Content (стандартный ответ для успешного DELETE)
    } catch (error) {
        res.status(500).json({ message: "Error deleting recording", error: error.message });
    }
});

module.exports = router; // Экспортируем роутер