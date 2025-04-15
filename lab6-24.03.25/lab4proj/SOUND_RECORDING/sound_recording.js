class TLocalStorage {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this._storage = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    Reset() {
        this._storage = {};
        localStorage.removeItem(this.storageKey);
    }

    AddValue(key, value) {
        this._storage[key] = value;
        this._updateLocalStorage();
    }

    GetValue(key) {
        return this._storage.hasOwnProperty(key) ? this._storage[key] : undefined;
    }

    DeleteValue(key) {
        if (this._storage.hasOwnProperty(key)) {
            delete this._storage[key];
            this._updateLocalStorage();
        }
    }

    GetKeys() {
        return Object.keys(this._storage);
    }

    CheckIfAlreadyExists(key) {
        return this._storage.hasOwnProperty(key);
    }

    _updateLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this._storage));
    }
}

const Storage = new TLocalStorage("SoundRecords");

function AddRecord() {
    let key = prompt("Введите название звукозаписи:");
    if (!key || key.trim() === "") {
        console.log("Название не введено. Операция отменена.");
        return;
    }
    if (Storage.CheckIfAlreadyExists(key.trim())) {
        console.log("Запись с таким названием уже существует. Операция отменена.");
        return;
    }

    let value = prompt("Введите описание звукозаписи:");
    if (!value) {
        console.log("Описание не введено. Операция отменена.");
        return;
    }

    Storage.AddValue(key.trim(), value.trim());
    console.log(`Добавлена запись: "${key.trim()}"`);
}

function DeleteRecord() {
    let key = prompt("Введите название звукозаписи для удаления:");
    if (!key || key.trim() === "") {
        console.log("Название не введено. Операция отменена.");
        return;
    }
    Storage.DeleteValue(key.trim());
    console.log(`Удалена запись (если существовала): "${key.trim()}"`);
}

function GetRecordInfo() {
    let key = prompt("Введите название звукозаписи для получения информации:");
    if (!key || key.trim() === "") {
        console.log("Название не введено. Операция отменена.");
        return;
    }
    let value = Storage.GetValue(key.trim());
    if (value === undefined) {
        console.log("Запись не найдена.");
    } else {
        console.log(`Запись "${key.trim()}": ${value}`);
    }
}

function ListAllRecords() {
    let keys = Storage.GetKeys();
    if (keys.length === 0) {
        console.log("В хранилище нет записей.");
    } else {
        console.log("Перечень всех звукозаписей:");
        keys.forEach(key => console.log(key));
    }
}