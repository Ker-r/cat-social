// главный управляющий файл
import { nanoid } from 'nanoid';
import { savePostsToLocalStorage, loadPostsFromLocalStorage } from './storage'
import { renderPosts} from './render'

import { Post } from './types'

let posts: Post[] = []; // создаем массив постов

const postCreate = {
    // ! говорит, что здесь не будет null
    button: document.querySelector<HTMLButtonElement>(".button")!, // ищем кнопку создания поста
    input: document.querySelector<HTMLInputElement>(".text")!, // ищем поле ввода
    post: document.querySelector<HTMLDivElement>(".post")!, // ищем тег для всех постов
    catName: document.querySelector<HTMLInputElement>(".cat_name")!, // ищем тег для поля ввода имени котика
    catAvatar: document.querySelector<HTMLSelectElement>(".cat_avatar")!, // ищем тег для выбора аватара котика
}

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

function updatePosts(newPosts: Post[]): void {
    savePostsToLocalStorage(newPosts); // сохраняем newPosts в localStorage
    posts = newPosts; // обновляем глобальную переменную 
    updateFilterOptions()
    render(posts); // перерисовываем посты
}


posts = loadPostsFromLocalStorage() // присваеваем новое значение posts и вызываем функцию 
updateFilterOptions()
render(posts)