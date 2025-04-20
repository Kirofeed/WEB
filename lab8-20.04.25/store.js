// store.js
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Для генерации ID

const dbPath = path.join(__dirname, 'db.json'); // Путь к файлу базы данных

// Чтение данных из файла
async function readData() {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Если файл не найден или пуст, возвращаем пустой массив
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("Error reading data file:", error);
        throw error; // Пробрасываем ошибку дальше
    }
}

// Запись данных в файл
async function writeData(data) {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing data file:", error);
        throw error;
    }
}

// Получить все записи
async function getAllRecordings() {
    return await readData();
}

// Получить запись по ID
async function getRecordingById(id) {
    const recordings = await readData();
    return recordings.find(rec => rec.id === id);
}

// Добавить новую запись
async function addRecording(newRecordingData) {
    const recordings = await readData();
    const newRecording = {
        id: uuidv4(), // Генерируем новый уникальный ID
        ...newRecordingData
    };
    recordings.push(newRecording);
    await writeData(recordings);
    return newRecording;
}

// Обновить запись по ID
async function updateRecording(id, updatedData) {
    const recordings = await readData();
    const index = recordings.findIndex(rec => rec.id === id);
    if (index === -1) {
        return null; // Запись не найдена
    }
    // Обновляем поля, сохраняя ID
    recordings[index] = { ...recordings[index], ...updatedData };
    await writeData(recordings);
    return recordings[index];
}

// Удалить запись по ID
async function deleteRecording(id) {
    let recordings = await readData();
    const initialLength = recordings.length;
    recordings = recordings.filter(rec => rec.id !== id);
    if (recordings.length === initialLength) {
        return false; // Запись не найдена для удаления
    }
    await writeData(recordings);
    return true; // Удаление успешно
}

module.exports = {
    getAllRecordings,
    getRecordingById,
    addRecording,
    updateRecording,
    deleteRecording
};