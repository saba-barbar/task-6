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
const tbody = document.getElementById('tbody')
const submitbtn = document.getElementById('submit')



let dataPro
if (localStorage.product) {
    dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = []
}
read();         // لتحديث جدول الداشبورد
renderCards();
let mood = 'create'
let temp

//TOTAL FUNCTION
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

//FUNCTION SHOW THE CARDS 
function renderCards() {
    if (!productsContainer) return;

    dataPro.forEach(pro => {
        const cardHTML = `
            <div class="slide">
                <img src="${pro.img}" alt="${pro.title}">
                <h3>${pro.title}</h3>
                <p>${pro.category}</p>
                <p>${pro.total}</p>
            </div>
        `;
        productsContainer.innerHTML += cardHTML; // نضيف الكرت الجديد بدون مسح القديم
    });
}


//FUNCTION SHOW THE PRODUCT IN DASHBORD
function read() {
    if (!tbody) return;

    let table = ''
    dataPro.forEach((pro, i) => {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${pro.title}</td>
            <td>${pro.price}</td>
            <td>${pro.discount}</td>
            <td>${pro.total}</td>
            <td>${pro.category}</td>
            <td>${pro.img}</td>
            <td><button onclick="updateData(${i})" class="btn">Update</button></td>
            <td><button onclick="deletData(${i})" class="btn">Delete</button></td>
        </tr>`
    })

    tbody.innerHTML = table
}
//  FUNCTION CREAT BUTTON
if (submitbtn) {
    submitbtn.onclick = function (e) {
        e.preventDefault();
        let newPro = {
            title: title.value,
            price: price.value,
            discount: discount.value,
            category: category.value,
            total: total.innerHTML,
            img: img.value,
        }
        if (mood === 'create') {
            dataPro.push(newPro)
        } else {
            dataPro[temp] = newPro
            mood = 'create'
            submitbtn.innerHTML = 'Create'
            }
        }
        localStorage.setItem("product", JSON.stringify(dataPro))
        clear()
        read()
        renderCards()
    }
//CLEAR FUNCTION
function clear() {
    title.value = ""
    price.value = ""
    discount.value = ""
    category.value = ""
    total.innerHTML = ""
    img.value = ""
}
//DELETE FUNCTION
function deletData(i) {
    dataPro.splice(i, 1)
    localStorage.product = JSON.stringify(dataPro)
    read()
    renderCards()
}
//UPDATE FUNCTION
function updateData(i) {
    temp = i
    title.value = dataPro[i].title
    price.value = dataPro[i].price
    discount.value = dataPro[i].discount
    category.value = dataPro[i].category
    img.value = dataPro[i].img
    getTotal()
    mood = 'update'
    submitbtn.innerHTML = 'Update'
    scroll({
        top: 0,
        behavior: 'smooth'
    })
}

//SEARCH FUNCTION 
function searchByTitle(value) {
    if (!productsContainer) return

    const searchValue = value.toLowerCase()
    productsContainer.innerHTML = ''

    for (let i = 0; i < dataPro.length; i++) {
        if (dataPro[i].title.toLowerCase().includes(searchValue)) {
            productsContainer.innerHTML += `
                <div class="slide">
                    <img src="${dataPro[i].img}">
                    <h3>${dataPro[i].title}</h3>
                    <p>${dataPro[i].category}</p>
                    <p>${dataPro[i].total}</p>
                </div>
            `
        }
    }
}
//SEARCH IN DASHBORD
function searchName(value) {
    const tbody = document.getElementById('tbody')
    tbody.innerHTML = ''

    const searchValue = value.toLowerCase()

    for (let i = 0; i < dataPro.length; i++) {
        if (dataPro[i].title.toLowerCase().includes(searchValue)) {
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
            `
        }
    }
}







