// //SLIDER
let productsContainer = document.getElementById('productsContainer');
const container = document.querySelectorAll('.card')
const next = document.getElementById('next')
const prev = document.getElementById('prev')
const searchdata = document.getElementById('search')
function getSlides() {
    return document.querySelectorAll('.slide');
}
if (next && prev && productsContainer) {
    let count = 0
    let visible


    function updateVisible() {
        const w = window.innerWidth
        if (w < 480) visible = 1
        else if (w < 768) visible = 2
        else visible = 3
    }
    window.addEventListener('resize', () => {
        updateVisible()
        move(count)
    })
    updateVisible()
    next.addEventListener("click", () => {
        let slides = getSlides();
        if (slides.length === 0) return;
        count++
        if (count > slides.length - visible)
            count = 0
        move(count);
    })
    prev.addEventListener("click", () => {
        let slides = getSlides();
        if (slides.length === 0) return;
        count--
        if (count < 0)
            count = slides.length - visible
        move(count)
    })
    function move(newCount) {
        count = newCount;
        const slides = getSlides();
        if (slides.length === 0) return;

        const slideWidth = slides[0].offsetWidth + 10;
        productsContainer.style.transform = `translateX(${-count * slideWidth}px)`;
    }

}
//dashbord
const title = document.querySelector("#title")
const price = document.querySelector('#price')
const discount = document.querySelector('#discount')
const total = document.querySelector('#total')
const category = document.querySelector('#category')
const img = document.querySelector('#img')

let mood = 'creat'
let temp


window.addEventListener('storage', function (e) {
    if (e.key === 'product') {
        renderCards();
    }
});


function getTotal() {
    if (price.value != '') {
        let result = price.value - +discount.value
        total.innerHTML = result
        total.style.background = '#ff9900ff'
    } else {
        total.innerHTML = ''
        total.style.background = '#f39a14ad'
    }
}
let dataPro
if (localStorage.product) {
    dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = []
}

function addCard(product, index) {
    let card = document.createElement('div');
    card.className = 'slide';
    card.id = `card-${index}`;
    card.innerHTML = `
        <img src="${product.img}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p> ${product.category}</p>
        <p> ${product.total}</p>
    `;
    productsContainer.appendChild(card);

}
dataPro.forEach((product, i) =>
    addCard(product, i))


const submitbtn = document.getElementById('submit')
submitbtn.onclick = function () {
    let newPro = {
        title: title.value,
        price: price.value,
        discount: discount.value,
        category: category.value,
        total: total.innerHTML,
        img: img.value
    }
    if (mood === 'creat') {
        dataPro.push(newPro)
        addCard(newPro, dataPro.length - 1);
    } else {
        dataPro[temp] = newPro
        mood = 'creat'
        submitbtn.innerHTML = 'Creat'
        let card = document.getElementById(`card-${temp}`);
        if (card) {
            card.innerHTML = `
                <img src="${newPro.img}" alt="${newPro.title}" />
                <h3>${newPro.title}</h3>
                <p>${newPro.category}</p>
                <p>${newPro.total}</p>
            `;
        }
    }

    localStorage.setItem("product", JSON.stringify(dataPro))
    clear()
    read()
}
function clear() {
    title.value = ""
    price.value = ""
    discount.value = ""
    category.value = ""
    total.innerHTML = ""
    img.value = ""
}
function read() {
    getTotal()
    let table = ''
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td>${dataPro[i].img}</td>
                <td><button onclick = "updateData(${i})" class="btn"> update </button></td>
                <td><button onclick = "deletData(${i})" class="btn"> delete</button></td>
        </tr>`
    }
    document.getElementById('tbody').innerHTML = table
}
read()
function deletData(i) {
    dataPro.splice(i, 1)
    localStorage.product = JSON.stringify(dataPro)
renderCards();

    read()
}
function updateData(i) {
    temp = i
    title.value = dataPro[i].title
    price.value = dataPro[i].price
    discount.value = dataPro[i].discount
    category.value = dataPro[i].category
    img.value = dataPro[i].img
    getTotal()
    submitbtn.innerHTML = 'Update'
    mood = 'update'
    scroll({
        top: 0,
        behavior: 'smooth'
    })
    renderCards();

}

function renderCards() {
    if (!productsContainer) return;

    productsContainer.innerHTML = '';

    let dataPro = JSON.parse(localStorage.getItem('product')) || [];

    dataPro.forEach((product, i) => {
        let card = document.createElement('div');
        card.className = 'slide';
        card.id = `card-${i}`;

        card.innerHTML = `
            <img src="${product.img}">
            <h3>${product.title}</h3>
            <p>${product.category}</p>
            <p>${product.total}</p>
        `;
        productsContainer.appendChild(card);
    });
}

renderCards();

function searchData(value) {
    for (let i = 0; i < dataPro.length; i++) {
        if (dataPro[i].title.includes) {

        }

    }
}







