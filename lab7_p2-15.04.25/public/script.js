function loadPage(page) {
    fetch(`${page}.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('app').innerHTML = html;
        attachEvents(); // навешиваем обработчики кнопок
      });
  }
  
  function attachEvents() {
    const toStudio = document.getElementById('goToStudioBtn');
    const toHome = document.getElementById('goHomeBtn');
    const loadDataBtn = document.getElementById('loadDataBtn');
  
    if (toStudio) toStudio.addEventListener('click', () => loadPage('studio'));
    if (toHome) toHome.addEventListener('click', () => loadPage('home'));
    if (loadDataBtn) loadDataBtn.addEventListener('click', loadJSON);
  }
  
  function loadJSON() {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        const table = document.createElement('table');
        table.border = 1;
        table.innerHTML = `<tr><th>Название</th><th>Описание</th></tr>` +
          Object.entries(data).map(([key, value]) =>
            `<tr><td>${key}</td><td>${value}</td></tr>`
          ).join('');
        document.getElementById('data-table').innerHTML = '';
        document.getElementById('data-table').appendChild(table);
      });
  }
  
  document.addEventListener('DOMContentLoaded', () => loadPage('home'));