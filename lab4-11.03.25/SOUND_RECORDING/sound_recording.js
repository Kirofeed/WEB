class THashStorage {
  constructor() {
      this._storage = {};
  }
  Reset() {
      this._storage = {};
  }
  AddValue(key, value) {
      this._storage[key] = value;
  }
  GetValue(key) {
      return this._storage.hasOwnProperty(key) ? this._storage[key] : undefined;
  }
  DeleteValue(key) {
      if (this._storage.hasOwnProperty(key)) {
          delete this._storage[key];
      }
  }
  GetKeys() {
      return Object.keys(this._storage);
  }
}