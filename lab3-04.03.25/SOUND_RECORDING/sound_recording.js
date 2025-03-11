let recordings = {};


function AddValue(key, value) {
  recordings[key] = value;
}

function DeleteValue(key) {
  if (recordings.hasOwnProperty(key)) {
    delete recordings[key];
  }
}

function GetValueInfo(key) {
  if (recordings.hasOwnProperty(key)) {
    return `Запись "${key}": ${recordings[key]}`;
  } else {
    return "нет информации";
  }
}

function ListValues() {
  let result = "";
  for (let key in recordings) {
    result += `Запись "${key}": ${recordings[key]}\n`;
  }
  return result;
}