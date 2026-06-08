// главный управляющий файл
import { nanoid } from 'nanoid';
import { storage } from './storage'
import { renderPosts, renderMorePosts } from './render'
import { eventBroker } from './eventBroker'

import { Post, ServerPost } from './types'

let posts: Post[] = []; // создаем массив постов
const POSTS_PER_PAGE = 10; // постов на странице
let currentPage = 1; // текущая страница

const postCreate = {
    // ! говорит, что здесь не будет null
    button: document.querySelector<HTMLButtonElement>(".button")!, // ищем кнопку создания поста
    input: document.querySelector<HTMLInputElement>(".text")!, // ищем поле ввода
    post: document.querySelector<HTMLDivElement>(".post")!, // ищем тег для всех постов
    catName: document.querySelector<HTMLInputElement>(".cat_name")!, // ищем тег для поля ввода имени котика
    catAvatar: document.querySelector<HTMLSelectElement>(".cat_avatar")!, // ищем тег для выбора аватара котика
    clearButton: document.querySelector<HTMLButtonElement>(".button.button--secondary")!,
    serverButton: document.querySelector<HTMLButtonElement>(".load_server_btn")!,
}

const MAX_LENGTH = 300;
const counter = document.querySelector<HTMLSpanElement>(".counter")!;
counter.textContent = String(MAX_LENGTH);

const loadButton = document.querySelector<HTMLButtonElement>(".load_more_btn")!; // кнопка загрузки постов

postCreate.input.addEventListener("input", function(){ // считает количество введенных символов и показывается сколько осталось
    if (postCreate.input.value.length > MAX_LENGTH) { // если пользователь ввел много символов,
        postCreate.input.value = postCreate.input.value.slice(0, MAX_LENGTH) // обрезаем текст в поле до MAX_LENGTH символов
    }
    const remaining = MAX_LENGTH - postCreate.input.value.length; // от макисмума отнимаем столько символов сколько уже написано
    counter.textContent = String(remaining); // превращаем число в строку и записываем в счетчик
    if (remaining < 20) {
        counter.classList.add("counter_warning");
    }
    else {
        counter.classList.remove("counter_warning");
    }
})

postCreate.serverButton.addEventListener("click", async function() {
    // async — функция асинхронная, можно использовать await внутри
    const serverPosts = await storage.loadPostsFromServer(); // ждём пока загрузятся посты с сервера
    const converPosts = convertServerPosts(serverPosts); // преобразуем серверный формат в наш формат
    posts = converPosts; // сохраняем все серверные посты в глобальный массив
    loadButton.style.display = "block";
    currentPage = 1; // сбрасываем на первую страницу
    render(getPostsForCurrentPage()) // показываем только первые 10 постов
})

const sortButtons = {
    buttonNew: document.querySelector<HTMLButtonElement>(".sort_date_new")!,
    buttonOld: document.querySelector<HTMLButtonElement>(".sort_date_old")!,
    buttonLikes: document.querySelector<HTMLButtonElement>(".sort_likes")!,
}

const filterButtons = {
    catFilter: document.querySelector<HTMLSelectElement>(".filter_cat")!, // выпадающий список с выбором для фильтрации
    applyFilterBtn: document.querySelector<HTMLButtonElement>(".apply_filter_btn")!,
    resetFilterBtn: document.querySelector<HTMLButtonElement>(".reset_filter_btn")!,
}

const avatars = ["🐱", "🐈", "😺", "🐾"];
avatars.forEach((cat) => {
    const option = document.createElement("option");
    option.classList.add("avatar_option");
    option.textContent = cat;
    postCreate.catAvatar.append(option); 
})

function render(postsToRender: Post[]): void { 
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
    const pattern = /^[а-яёА-ЯЁa-zA-Z\s]+$/; // Проверка имени котика через регулярное выражение
    if(!pattern.test(postCreate.catName.value)) {
        alert("Неправильное имя котика");
        return;
    }
    const now = new Date(); // создаём дату прямо сейчас
    const postData = { // создаем объект поста
        id: nanoid(),
        text: postCreate.input.value, // в текст передаем введеный в поле текст
        name: postCreate.catName.value.trim(), // введено имя
        avatar: postCreate.catAvatar.value, // выбранный аватар
        createdAt: now, // используем дату
        likes: 0, // изначально лайки = 0
        isLiked: false,
    }
    posts.unshift(postData) // добавляем созданный пост в массив
    storage.savePostsToLocalStorage(posts)
    render(posts); // вызывает функцию 
    updateFilterOptions();
    // post — это контейнер, posts — массив, savePostsToLocalStorage — функция сохранения.
    postCreate.input.value = ""; // очищаем поле текста
    postCreate.catName.value = ""; // очищаем имя
    postCreate.catAvatar.selectedIndex = 0; // очищаем список с аватарками
});

postCreate.clearButton.addEventListener("click", () => {
    postCreate.input.value = ""; // очищаем поле текста
    postCreate.catName.value = ""; // очищаем имя
    postCreate.catAvatar.selectedIndex = 0; 
});

sortButtons.buttonNew.addEventListener("click", () => { // сортировка от новых к старым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    posts = sortPosts;
    render(posts); 
})

sortButtons.buttonOld.addEventListener("click", () => { // сортировка от старых к новым постам
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    posts = sortPosts;
    render(posts); 
})

sortButtons.buttonLikes.addEventListener("click", () => { // сортировка от большего к меньшему кол-ву лайков
    let sortPosts = [...posts];
    sortPosts.sort((a, b) => b.likes - a.likes);
    posts = sortPosts;
    render(posts); 
})

function applyFilter(): void {
    const selectedValue = filterButtons.catFilter.value;
    if(selectedValue === "Все котики") {
        render(posts);
    }
    else {
        const filtered = posts.filter(post => post.name === selectedValue);
        render(filtered); 
    }
}

function updateFilterOptions(): void {
    const names = posts.map((post) => post.name); // берём каждый post → возвращаем только его name
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

function updatePosts(newPosts: Post[]): void {
    storage.savePostsToLocalStorage(newPosts); // сохраняем newPosts в localStorage
    posts = newPosts; // обновляем глобальную переменную 
    updateFilterOptions()
    render(posts); // перерисовываем посты
}

// принимает массив постов с сервера (ServerPost[]) и возвращает массив наших постов (Post[])
function convertServerPosts(serverPosts: ServerPost[]): Post[] {
    // map проходит по каждому посту с сервера и возвращает новый массив уже в нашем формате
    const convertPost = serverPosts.map((serverPost) => {
    return {
        id: String(serverPost.id), // id на сервере число, превращаем в строку
        text: serverPost.title,    // на сервере текст поста называется title, у нас — text
        name: "Котик " + serverPost.userId, // у сервера нет имени, придумываем из userId
        avatar: "🐱", // на сервере нет аватарки, ставим по умолчанию
        createdAt: new Date(), // на сервере нет даты, ставим текущее время
        likes: 0, // новый пост — лайков нет
        isLiked: false, // новый пост — не лайкнут
    }
    })
    return convertPost; // возвращаем готовый массив наших постов
}

// возвращает только те посты которые нужно показать на текущей странице
// например если страница 2 и POSTS_PER_PAGE = 10 — вернёт посты с индекса 10 по 19
function getPostsForCurrentPage(): Post[] {
    // (currentPage - 1) * POSTS_PER_PAGE — начало среза (страница 1 → 0, страница 2 → 10)
    // currentPage * POSTS_PER_PAGE — конец среза (страница 1 → 10, страница 2 → 20)
    return posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
}

loadButton.addEventListener("click", async function() {
    currentPage++; // переходим на следующую страницу
    renderMore(getPostsForCurrentPage()) // показываем посты следующей страницы
    if (currentPage * POSTS_PER_PAGE >= posts.length) {
        loadButton.style.display = "none";
    }
})

// подписываемся на событие "postsUpdated" — когда что-то изменилось в постах
// render.ts не знает про updatePosts — он просто говорит "postsUpdated произошло"
// а мы здесь решаем что делать когда это событие случилось
eventBroker.subscribe("postsUpdated", function(newPosts: unknown) {
    // newPosts — данные которые передал emit из render.ts
    // приводим тип unknown к Post[] так как знаем что там массив постов
    updatePosts(newPosts as Post[]); // вызываем функцию которая сохраняет и перерисовывает посты
});

function renderMore(postsToRender: Post[]): void { 
    renderMorePosts(postCreate.post, postsToRender, updatePosts)
}


posts = storage.loadPostsFromLocalStorage() // присваеваем новое значение posts и вызываем функцию 
updateFilterOptions()
render(posts)