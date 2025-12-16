
const productsContainer = document.getElementById('productsContainer')
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const discount = document.querySelector('#discount');
const total = document.querySelector('#total');
const category = document.querySelector('#category');
const img = document.querySelector('#img');
const tbody = document.getElementById('tbody');
const submitbtn = document.getElementById('submit');
const searchInputMain = document.getElementById('search');    
const searchInputDash = document.getElementById('search1');   
const btnAll = document.getElementById('all');
const btnMobile = document.getElementById('mobile');
const btnLaptops = document.getElementById('laptops');
const sortSelect = document.querySelector('.sort');

let dataPro

if (localStorage.product) {
dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = []}

let mood = 'create';
let tempIndex = null;

// slider state
let count = 0;
let visible = 3;

// filter/search/sort state
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';


function saveData() {
    localStorage.setItem("product", JSON.stringify(dataPro));
}

function parseNumber(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

function computeTotal(priceVal, discountVal) {
    return Math.max(0, parseNumber(priceVal) - parseNumber(discountVal));
}

function getSlides() {
    return document.querySelectorAll('.slide');
}

function updateVisible() {
    const w = window.innerWidth;
    if (w < 480) visible = 1;
    else if (w < 768) visible = 2;
    else visible = 3;
}

function move(newCount) {
    count = newCount;
    const slides = getSlides();
    if (!productsContainer|| slides.length === 0) {
        productsContainer && (productsContainer.style.transform = `translateX(0px)`);
        return;
    }
    const slideWidth = slides[0].offsetWidth + 10;
    productsContainer.style.transform = `translateX(${-count * slideWidth}px)`;
}


function renderCards(list = dataPro) {
    if (!productsContainer) return;
    productsContainer.innerHTML = ''; 

    if (list.length === 0) {
        productsContainer.innerHTML = `<div class="no-results">No products</div>`;
        move(0);
        return
    }

    list.forEach(pro => {
        productsContainer.innerHTML += `
            <div class="slide">
                <img src="${pro.img  ||'./assets/img/laptop1.jpg'}" alt="${pro.title  ||'product'}" />
                <h3>${pro.title || ''}</h3>
                <p class="cat">${pro.category || ''}</p>
                <p class="price">${pro.total}$</p>
            </div>
        `;
    });

    count = 0;
    move(0);
}

function prepareListForDisplay() {
    let list = dataPro.slice();

    if (currentFilter && currentFilter !== 'all') {
        const cat = currentFilter.toLowerCase();
        list = list.filter(p => (p.category||  '').toLowerCase().includes(cat));
    }if (currentSearch && currentSearch.trim() !== '') {
        const sv = currentSearch.toLowerCase();
        list = list.filter(p => (p.title || '').toLowerCase().includes(sv));
    }

    if (currentSort === 'asc') {
        list.sort((a,b) => parseNumber(a.price) - parseNumber(b.price));
    } else if (currentSort === 'desc') {
        list.sort((a,b) => parseNumber(b.price) - parseNumber(a.price));
    }

    return list;
}

function read() {
    if (!tbody) return;
    let table = '';
    dataPro.forEach((pro, i) => {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${pro.title}</td>
            <td>${pro.price}</td>
            <td>${pro.discount}</td>
            <td>${pro.total}</td>
            <td>${pro.category}</td>
            <td><img src="${pro.img}" width="50" /></td>
            <td><button onclick="updateData(${i})" class="btn">Update</button></td>
            <td><button onclick="deletData(${i})" class="btn">Delete</button></td>
        </tr>`;
    });
    tbody.innerHTML = table;
}

if (submitbtn) {
    submitbtn.addEventListener('click', function(e){
        e.preventDefault();

        if (!title.value  ||!price.value) {
            alert("Enter title and price");
            return;
        }

        const newPro = {
            title: title.value.trim(),
            price: parseNumber(price.value),
            discount: parseNumber(discount.value),
            category: category.value.trim(),
            total: computeTotal(price.value, discount.value),
            img: img.value.trim(),
        };

        if (mood === 'create') {
            dataPro.push(newPro);
        } else {
            dataPro[tempIndex] = newPro;
            mood = 'create';
            submitbtn.innerHTML = 'Create';
        }

        saveData();
        clear();
        read();
        renderCards(prepareListForDisplay());
    });
}

function clear() {
    if (title) title.value = '';
    if (price) price.value = '';
    if (discount) discount.value = '';
    if (category) category.value = '';
    if (total) total.innerHTML = '';
    if (img) img.value = '';
}

function deletData(i) {
    dataPro.splice(i, 1);
    saveData();
    read();
    renderCards(prepareListForDisplay());
}

function updateData(i) {
    tempIndex = i;
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    discount.value = dataPro[i].discount;
    category.value = dataPro[i].category;
    img.value = dataPro[i].img;
    total.innerHTML = dataPro[i].total;
    getTotal();
    mood = 'update';
    submitbtn.innerHTML = 'Update';
    window.scroll({ top: 0, behavior: 'smooth' });
}

function getTotal() {
    if (!price) return;
    if (price.value !== '') {
        const result = computeTotal(price.value, discount.value || 0);
        total.innerHTML = result;
        total.style.background = '#ff9900ff';
    } else {
        total.innerHTML = '';
        total.style.background = '#f39a14ad';
    }
}


function searchByTitle(value) {
    currentSearch = (value||  '').toLowerCase();
    renderCards(prepareListForDisplay());
}

function searchName(value) {
    if (!tbody) return;
    const sv = (value || '').toLowerCase();
    tbody.innerHTML = '';

    for (let i = 0; i < dataPro.length; i++) {
        if (dataPro[i].title.toLowerCase().includes(sv)) {
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><img src="${dataPro[i].img}" width="50"></td>
                    <td><button onclick="updateData(${i})">Update</button></td>
                    <td><button onclick="deletData(${i})">Delete</button></td>
                </tr>
            `;
        }
    }
}
function setFilter(filter) {
    currentFilter = filter;
    renderCards(prepareListForDisplay());
}

function setSort(sortVal) {
    currentSort = sortVal;
    renderCards(prepareListForDisplay());
}

window.addEventListener('resize', () => {
    updateVisible();
    move(count);
});

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const slides = getSlides();
        if (slides.length === 0) return;
        count++;
        if (count > slides.length - visible) count = 0;
        move(count);
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const slides = getSlides();
        if (slides.length === 0) return;
        count--;
        if (count < 0) count = Math.max(0, getSlides().length - visible);
        move(count);
    });
}

btnAll.addEventListener('click', () => setFilter('all'));
btnMobile.addEventListener('click', () => setFilter('mobile'));
btnLaptops.addEventListener('click', () => setFilter('laptops'));

sortSelect.addEventListener('change', (e) => setSort(e.target.value));

if (searchInputMain) {
    searchInputMain.addEventListener('keyup', (e) => {
        searchByTitle(e.target.value);
    });
}

if (searchInputDash) {
    searchInputDash.addEventListener('keyup', (e) => {
        searchName(e.target.value);
    });
}

updateVisible();
read();
renderCards(prepareListForDisplay());

window.updateData = updateData;
window.deletData = deletData;
window.searchByTitle = searchByTitle;
window.searchName = searchName;
window.getTotal = getTotal;
window.setFilter = setFilter;