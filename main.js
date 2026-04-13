// главный управляющий файл
import { savePostsToLocalStorage, loadPostsFromLocalStorage } from './storage.js'
import { renderPosts} from './render.js'

let posts = []; // создаем массив постов

const postCreate = {
    button: document.querySelector(".button"), // ищем кнопку создания поста
    input: document.querySelector(".text"), // ищем поле ввода
    post: document.querySelector(".post"), // ищем тег для всех постов
    catName: document.querySelector(".cat_name"), // ищем тег для поля ввода имени котика
    catAvatar: document.querySelector(".cat_avatar"), // ищем тег для выбора аватара котика
}

const sortButtons = {
    buttonNew: document.querySelector(".sort_date_new"),
    buttonOld: document.querySelector(".sort_date_old"),
    buttonLikes: document.querySelector(".sort_likes"),
}

const filterButtons = {
    catFilter: document.querySelector(".filter_cat"), // выпадающий список с выбором для фильтрации
    applyFilterBtn: document.querySelector(".apply_filter_btn"),
    resetFilterBtn: document.querySelector(".reset_filter_btn"),
}

const avatars = ["🐱", "🐈", "😺", "🐾"];
avatars.forEach((cat) => {
    const option = document.createElement("option");
    option.classList.add("avatar_option");
    option.textContent = cat;
    postCreate.catAvatar.append(option); 
})

function render(postsToRender) { 
    renderPosts(postCreate.post, postsToRender, updatePosts)
}

// обработчик создания поста
postCreate.button.addEventListener("click", function() { // при нажатии на кнопку
    if(postCreate.input.value.trim() === "") { // если текста внутри поля нет
        return // мы ничего не делаем
    }
    if(postCreate.catName.value.trim() === "") {
        postCreate.catName.value = 'Анонимный котик';
    }
    const now = new Date(); // создаём дату прямо сейчас
    const postData = { // создаем объект поста
        text: postCreate.input.value, // в текст передаем введеный в поле текст
        name: postCreate.catName.value.trim(), // введено имя
        avatar: postCreate.catAvatar.value, // выбранный аватар
        createdAt: now, // используем дату
        likes: 0, // изначально лайки = 0
        isLiked: false,
    }
    posts.unshift(postData) // добавляем созданный пост в массив
    savePostsToLocalStorage(posts)
    render(posts); // вызывает функцию 
    updateFilterOptions();
    // post — это контейнер, posts — массив, savePostsToLocalStorage — функция сохранения.
    postCreate.input.value = ""; // очищаем поле текста
    postCreate.catName.value = ""; // очищаем имя
    postCreate.catAvatar.selectedIndex = 0; // очищаем список с аватарками
});

sortButtons.buttonNew.addEventListener("click", () => { // сортировка от новых к старым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    posts = sortPosts;
    render(posts); 
})

sortButtons.buttonOld.addEventListener("click", () => { // сортировка от старых к новым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    posts = sortPosts;
    render(posts); 
})

sortButtons.buttonLikes.addEventListener("click", () => { // сортировка от большего к меньшему кол-ву лайков
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => b.likes - a.likes);
    posts = sortPosts;
    render(posts); 
})

function applyFilter() {
    const selectedValue = filterButtons.catFilter.value;
    if(selectedValue === "Все котики") {
        render(posts);
    }
    else {
        const filtered = posts.filter(post => post.name === selectedValue);
        render(filtered); 
    }
}

function updateFilterOptions() {
    const names = posts.map((post) => post.name);
    const uniqueNames = new Set(names);
    filterButtons.catFilter.innerHTML = "";
    const selectedValue = document.createElement("option");
    selectedValue.textContent = "Все котики";
    filterButtons.catFilter.append(selectedValue);
    uniqueNames.forEach((name) => { 
        const option = document.createElement("option");
        option.textContent = name;
        filterButtons.catFilter.append(option);
    })
}

// вызвать функцию applyFilter()
filterButtons.applyFilterBtn.addEventListener("click", () => {
    applyFilter()
})

// сбросить фильтр
filterButtons.resetFilterBtn.addEventListener("click", () => {
    filterButtons.catFilter.value = "Все котики";
    applyFilter()
});

function updatePosts(newPosts) {
    savePostsToLocalStorage(newPosts); // сохраняем newPosts в localStorage
    posts = newPosts; // обновляем глобальную переменную 
    updateFilterOptions()
    render(posts); // перерисовываем посты
}


posts = loadPostsFromLocalStorage() // присваеваем новое значение posts и вызываем функцию 
updateFilterOptions()
render(posts)