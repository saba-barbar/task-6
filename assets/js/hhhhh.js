const title = document.querySelector("#title");
const price = document.querySelector('#price');
const discount = document.querySelector('#discount');
const total = document.querySelector('#total');
const category = document.querySelector('#category');
const img = document.querySelector('#img');
const productsContainer = document.getElementById('productsContainer');

let mood = 'create';
let temp;

// حساب المجموع
function getTotal() {
    if (price.value != '') {
        let result = price.value - +discount.value;
        total.innerHTML = result;
        total.style.background = '#ff9900ff';
    } else {
        total.innerHTML = '';
        total.style.background = '#f39a14ad';
    }
}

// جلب البيانات من localStorage
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// دالة لإضافة كارد جديد في الصفحة
function addCard(product, index) {
    let card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${index}`;
    card.innerHTML = `
        <img src="${product.img}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Discount: ${product.discount}%</p>
        <p>Category: ${product.category}</p>
        <p>Total: ${product.total}</p>
    `;
    productsContainer.appendChild(card);
}

// عرض كل المنتجات عند تحميل الصفحة
dataPro.forEach((product, i) => addCard(product, i));

const submitBtn = document.getElementById('submit');
submitBtn.onclick = function () {
    let newPro = {
        title: title.value,
        price: price.value,
        discount: discount.value,
        category: category.value,
        total: total.innerHTML,
        img: img.value
    }

    if(mood === 'create') {
        dataPro.push(newPro);
        addCard(newPro, dataPro.length - 1); // نضيف الكارد الجديد فوراً
    } else {
        dataPro[temp] = newPro;
        mood = 'create';
        submitBtn.innerHTML = 'Create';
        // تعديل الكارد الموجود
        let card = document.getElementById(`card-${temp}`);
        card.innerHTML = `
            <img src="${newPro.img}" alt="${newPro.title}" />
            <h3>${newPro.title}</h3>
            <p>Price: $${newPro.price}</p>
            <p>Discount: ${newPro.discount}%</p>
            <p>Category: ${newPro.category}</p>
            <p>Total: ${newPro.total}</p>
        `;
    }

    localStorage.setItem("product", JSON.stringify(dataPro));
    clear();
    read();
}

function clear() {
    title.value = "";
    price.value = "";
    discount.value = "";
    category.value = "";
    total.innerHTML = "";
    img.value = "";
}

// عرض الجدول
function read() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td>${dataPro[i].img}</td>
                <td><button onclick="updateData(${i})" class="btn">update</button></td>
                <td><button onclick="deleteData(${i})" class="btn">delete</button></td>
            </tr>`;
    }
    document.getElementById('tbody').innerHTML = table;
}

// دوال التحديث والحذف
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    discount.value = dataPro[i].discount;
    category.value = dataPro[i].category;
    img.value = dataPro[i].img;
    getTotal();
    mood = 'update';
    temp = i;
    submitBtn.innerHTML = 'Update';
}

function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem("product", JSON.stringify(dataPro));
    // إزالة الكارد من الصفحة
    let card = document.getElementById(`card-${i}`);
    if(card) card.remove();
    read();
}


