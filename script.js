// Функція для переключення вкладок
function openTab(tabId) {
    // Сховати всі вкладки
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Видалити активний клас з усіх кнопок
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Показати вибрану вкладку і зробити кнопку активною
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Функція для розрахунку кабелів
function calculateCable() {
    const power = parseFloat(document.getElementById('power').value);
    const voltage = parseFloat(document.getElementById('voltage').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const cableType = document.getElementById('cable-type').value;
    const conductor = document.getElementById('conductor').value;
    
    if (!power || !voltage || !hours) {
        alert('Будь ласка, заповніть всі обов\'язкові поля');
        return;
    }
    
    // Розрахунок струму навантаження
    const current = power / (Math.sqrt(3) * voltage);
    
    // Визначення економічної густини струму
    let j_ek;
    
    if (hours <= 3000) {
        if (cableType === 'paper') {
            j_ek = conductor === 'copper' ? 2.5 : 1.3;
        } else if (cableType === 'plastic') {
            j_ek = conductor === 'copper' ? 3.5 : 1.9;
        } else { // rubber
            j_ek = conductor === 'copper' ? 3.0 : 1.6;
        }
    } else if (hours <= 5000) {
        if (cableType === 'paper') {
            j_ek = conductor === 'copper' ? 2.1 : 1.1;
        } else if (cableType === 'plastic') {
            j_ek = conductor === 'copper' ? 3.1 : 1.7;
        } else { // rubber
            j_ek = conductor === 'copper' ? 2.5 : 1.4;
        }
    } else {
        if (cableType === 'paper') {
            j_ek = conductor === 'copper' ? 1.8 : 1.0;
        } else if (cableType === 'plastic') {
            j_ek = conductor === 'copper' ? 2.7 : 1.6;
        } else { // rubber
            j_ek = conductor === 'copper' ? 2.0 : 1.2;
        }
    }
    
    // Розрахунок економічного перерізу
    const section = current / j_ek;
    
    // Вибір стандартного перерізу (найближчий більший)
    const standardSections = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
    let selectedSection = 240; // максимальний за замовчуванням
    
    for (let i = 0; i < standardSections.length; i++) {
        if (standardSections[i] >= section) {
            selectedSection = standardSections[i];
            break;
        }
    }
    
    // Визначення допустимого струму для кабелю (спрощений підхід)
    let allowedCurrent;
    if (conductor === 'copper') {
        allowedCurrent = 3.5 * selectedSection;
    } else {
        allowedCurrent = 2.7 * selectedSection;
    }
    
    // Перевірка на термічну стійкість (спрощений підхід)
    let thermalSection = selectedSection;
    if (voltage === 6 && conductor === 'aluminum') {
        thermalSection = Math.max(selectedSection, 50);
    }
    
    // Формування результату
    let resultHTML = `
        <h3>Результати розрахунку:</h3>
        <p><strong>Розрахунковий струм навантаження:</strong> ${current.toFixed(2)} А</p>
        <p><strong>Економічна густина струму:</strong> ${j_ek.toFixed(2)} А/мм²</p>
        <p><strong>Розрахунковий переріз:</strong> ${section.toFixed(2)} мм²</p>
        <p><strong>Вибраний стандартний переріз:</strong> ${selectedSection} мм²</p>
        <p><strong>Допустимий струм для кабелю:</strong> ${allowedCurrent.toFixed(2)} А</p>
        <p><strong>Переріз з урахуванням термічної стійкості:</strong> ${thermalSection} мм²</p>
        <p><strong>Рекомендований кабель:</strong> ААБ 10 ${thermalSection}x${thermalSection} (або інший тип відповідно до вибору)</p>
    `;
    
    document.getElementById('cable-result').innerHTML = resultHTML;
}

// Функція для розрахунку струмів КЗ на ГПП
function calculateShortCircuit() {
    const Sk = parseFloat(document.getElementById('short-circuit-power').value);
    const SnomT = parseFloat(document.getElementById('transformer-power').value);
    const Uk = parseFloat(document.getElementById('uk-percent').value);
    const Uch = parseFloat(document.getElementById('voltage-high').value);
    
    if (!Sk || !SnomT || !Uk || !Uch) {
        alert('Будь ласка, заповніть всі обов\'язкові поля');
        return;
    }
    
    // Розрахунок опорів
    const Xc = Math.pow(Uch, 2) / Sk;
    const Xt = (Uk / 100) * (Math.pow(Uch, 2) / SnomT);
    const Xsum = Xc + Xt;
    
    // Розрахунок струму КЗ
    const Ipo = Uch / (Math.sqrt(3) * Xsum);
    
    // Ударний струм (спрощений підхід)
    const iud = 2.55 * Ipo;
    
    // Формування результату
    let resultHTML = `
        <h3>Результати розрахунку струмів КЗ:</h3>
        <p><strong>Опір системи (Xc):</strong> ${Xc.toFixed(4)} Ом</p>
        <p><strong>Опір трансформатора (Xt):</strong> ${Xt.toFixed(4)} Ом</p>
        <p><strong>Сумарний опір (XΣ):</strong> ${Xsum.toFixed(4)} Ом</p>
        <p><strong>Початкове діюче значення струму трифазного КЗ (Iп0):</strong> ${Ipo.toFixed(4)} кА</p>
        <p><strong>Ударний струм КЗ (iуд):</strong> ${iud.toFixed(4)} кА</p>
    `;
    
    document.getElementById('short-circuit-result').innerHTML = resultHTML;
}

// Функція для розрахунку струмів КЗ для ХПнЕМ
function calculateHPSEM() {
    const regime = document.getElementById('regime').value;
    const SnomT = parseFloat(document.getElementById('transformer-power-hpsem').value);
    const Uk = parseFloat(document.getElementById('uk-percent-hpsem').value);
    const Uch = parseFloat(document.getElementById('voltage-high-hpsem').value);
    
    if (!SnomT || !Uk || !Uch) {
        alert('Будь ласка, заповніть всі обов\'язкові поля');
        return;
    }
    
    // Опори для різних режимів (з прикладу 7.4)
    let Rc, Xc;
    if (regime === 'normal') {
        Rc = 10.65;
        Xc = 24.02;
    } else { // minimal
        Rc = 34.88;
        Xc = 65.68;
    }
    
    // Розрахунок опору трансформатора
    const Xt = (Uk / 100) * (Math.pow(Uch, 2) / SnomT);
    
    // Сумарний опір
    const Rsum = Rc;
    const Xsum = Xc + Xt;
    const Zsum = Math.sqrt(Math.pow(Rsum, 2) + Math.pow(Xsum, 2));
    
    // Напруга на стороні НН (10 кВ)
    const Un = 10.5;
    
    // Розрахунок струму КЗ
    const Ipo = Un / (Math.sqrt(3) * Zsum);
    
    // Формування результату
    let regimeName = regime === 'normal' ? 'нормальний' : 'мінімальний';
    
    let resultHTML = `
        <h3>Результати розрахунку струмів КЗ для ХПнЕМ (${regimeName} режим):</h3>
        <p><strong>Опір системи (Rc):</strong> ${Rc.toFixed(2)} Ом</p>
        <p><strong>Опір системи (Xc):</strong> ${Xc.toFixed(2)} Ом</p>
        <p><strong>Опір трансформатора (Xt):</strong> ${Xt.toFixed(2)} Ом</p>
        <p><strong>Сумарний опір (ZΣ):</strong> ${Zsum.toFixed(2)} Ом</p>
        <p><strong>Початкове діюче значення струму трифазного КЗ (Iп0):</strong> ${Ipo.toFixed(4)} кА</p>
    `;
    
    document.getElementById('hpsem-result').innerHTML = resultHTML;
}