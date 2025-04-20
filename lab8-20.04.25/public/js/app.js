// public/js/app.js
console.log('Client-side JS loaded.');

// --- Функция удаления записи ---
async function deleteRecording(id) {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
        return; // Отмена, если пользователь нажал "Нет"
    }

    try {
        const response = await fetch(`/api/recordings/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) { // Статус 200-299 (включая 204 No Content)
            console.log(`Recording ${id} deleted successfully.`);
            // Удаляем элемент из списка на странице
            const listItem = document.querySelector(`li[data-id="${id}"]`);
            if (listItem) {
                listItem.remove();
            } else {
                // Если элемент не найден, просто перезагрузим страницу (менее оптимально)
                window.location.reload();
            }
        } else {
            // Обработка ошибок сервера (статус 4xx, 5xx)
            const errorData = await response.json(); // Пытаемся прочитать тело ошибки
            console.error(`Error deleting recording ${id}:`, response.status, errorData.message || response.statusText);
            alert(`Ошибка удаления: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        // Обработка сетевых ошибок или ошибок парсинга JSON
        console.error('Network error or JSON parsing error:', error);
        alert('Произошла ошибка сети при удалении записи.');
    }
}

// --- Обработка отправки формы добавления/редактирования ---
const editForm = document.getElementById('edit-form');

if (editForm) {
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const formData = new FormData(editForm);
        const data = Object.fromEntries(formData.entries()); // Преобразуем FormData в объект
        const method = editForm.dataset.method || 'POST'; // Получаем HTTP метод из data-атрибута
        const url = editForm.action; // URL берем из атрибута action формы

        // Удаляем служебное поле _method, если оно есть
        delete data['_method'];

        // Преобразуем год в число
        if (data.year) {
            data.year = parseInt(data.year, 10);
        }

        console.log('Sending data:', method, url, data);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json', // Указываем, что отправляем JSON
                },
                body: JSON.stringify(data), // Преобразуем объект JS в JSON-строку
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                // Перенаправляем на главную страницу после успешного добавления/обновления
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error('Error submitting form:', response.status, errorData.message || response.statusText);
                alert(`Ошибка сохранения: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Network error or JSON parsing error:', error);
            alert('Произошла ошибка сети при сохранении записи.');
        }
    });
}