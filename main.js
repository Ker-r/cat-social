// главный управляющий файл

import { savePostsToLocalStorage, loadPostsFromLocalStorage } from './storage.js'
import { renderPosts} from './render.js'

let posts = []; // создаем массив постов
const button = document.querySelector(".button") // ищем кнопку
const input = document.querySelector(".text") // ищем поле ввода
const post = document.querySelector(".post") // ищем тег для всех постов
const catName = document.querySelector(".cat_name")
button.addEventListener("click", function() { // при нажатии на кнопку
    if(input.value.trim() === "") { // если текста внутри поля нет
        return // мы ничего не делаем
    }
    const now = new Date(); // создаём дату прямо сейчас
    const postData = { // создаем объект поста
        text: input.value, // в текст передаем введеный в поле текст
        name: catName.value, // введено имя
        createdAt: now, // используем дату
        likes: 0 // изначально лайки = 0
    }
    posts.push(postData) // добавляем созданный пост в массив
    savePostsToLocalStorage(posts)
    renderPosts(post, posts, updatePosts) // вызывает функцию 
    // post — это контейнер, posts — массив, savePostsToLocalStorage — функция сохранения.
    input.value = ""; // очищаем поле текста
    catName.value = ""; // очищаем имя
});

function updatePosts(newPosts) {
    savePostsToLocalStorage(newPosts); // сохраняем newPosts в localStorage
    posts = newPosts; // обновляем глобальную переменную 
    renderPosts(post, posts, savePostsToLocalStorage); // перерисовываем посты
}

posts = loadPostsFromLocalStorage() // присваеваем новое значение posts и вызываем функцию 
renderPosts(post, posts, updatePosts)