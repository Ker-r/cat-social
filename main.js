// главный управляющий файл
import { savePostsToLocalStorage, loadPostsFromLocalStorage } from './storage.js'
import { renderPosts} from './render.js'

let posts = []; // создаем массив постов
const button = document.querySelector(".button") // ищем кнопку создания поста
const input = document.querySelector(".text") // ищем поле ввода
const post = document.querySelector(".post") // ищем тег для всех постов
const catName = document.querySelector(".cat_name") // ищем тег для поля ввода имени котика
const catAvatar = document.querySelector(".cat_avatar") // ищем тег для выбора аватара котика
const catFilter = document.querySelector(".filter_cat"); // выпадающий список с выбором для фильтрации
let currentFilter = "all"; // переменная для хранения фильтра

// кнопки сортировки 
const buttonNew = document.querySelector(".sort_date_new")
const buttonOld = document.querySelector(".sort_date_old")
const buttonLikes = document.querySelector(".sort_likes")

// кнопки фильтрации
const applyFilterBtn = document.querySelector(".apply_filter_btn");
const resetFilterBtn = document.querySelector(".reset_filter_btn");

// обработчик создания поста
button.addEventListener("click", function() { // при нажатии на кнопку
    if(input.value.trim() === "") { // если текста внутри поля нет
        return // мы ничего не делаем
    }
    const now = new Date(); // создаём дату прямо сейчас
    const postData = { // создаем объект поста
        text: input.value, // в текст передаем введеный в поле текст
        name: catName.value, // введено имя
        avatar: catAvatar.value, // выбранный аватар
        createdAt: now, // используем дату
        likes: 0, // изначально лайки = 0
    }
    posts.push(postData) // добавляем созданный пост в массив
    savePostsToLocalStorage(posts)
    renderPosts(post, posts, updatePosts) // вызывает функцию 
    // post — это контейнер, posts — массив, savePostsToLocalStorage — функция сохранения.
    input.value = ""; // очищаем поле текста
    catName.value = ""; // очищаем имя
    catAvatar.selectedIndex = 0; // очищаем список с аватарками
});

buttonNew.addEventListener("click", () => { // сортировка от новых к старым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    posts = sortPosts;
    renderPosts(post, posts, updatePosts);
})

buttonOld.addEventListener("click", () => { // сортировка от старых к новым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    posts = sortPosts;
    renderPosts(post, posts, updatePosts);
})

buttonLikes.addEventListener("click", () => { // сортировка от большего к меньшему кол-ву лайков
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => b.likes - a.likes);
    posts = sortPosts;
    renderPosts(post, posts, updatePosts);
})

function applyFilter() {
    const selectedValue = catFilter.value;
    if(selectedValue === "Все котики") {
        renderPosts(post, posts, updatePosts)
    }
    else {
        const filtered = posts.filter(post => post.name === selectedValue);
        renderPosts(post, filtered, updatePosts)
    }
}

// вызвать функцию applyFilter()
applyFilterBtn.addEventListener("click", () => {
    applyFilter()
})

// сбросить фильтр
resetFilterBtn.addEventListener("click", () => {
    catFilter.value = "Все котики";
    applyFilter()
});



function updatePosts(newPosts) {
    savePostsToLocalStorage(newPosts); // сохраняем newPosts в localStorage
    posts = newPosts; // обновляем глобальную переменную 
    renderPosts(post, posts, updatePosts); // перерисовываем посты
}


posts = loadPostsFromLocalStorage() // присваеваем новое значение posts и вызываем функцию 
renderPosts(post, posts, updatePosts)