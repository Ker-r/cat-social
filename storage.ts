// работа с хранилищем браузера
import { Post } from './types'

// Сохраняем текущий массив постов в localStorage,
// чтобы при перезагрузке страницы они не исчезли.
export function savePostsToLocalStorage(postsArray: Post[]): void { // получает массив постов, превращает его в строку и сохраняет в localStorage.
    const catPosts = JSON.stringify(postsArray); // превращает массив posts в строку
    localStorage.setItem('cat_posts', catPosts); // сохраняет в localStorage под ключом "cat_posts"
}

// При загрузке страницы достаём сохранённые посты из браузера.
export function loadPostsFromLocalStorage(): Post[] { // читает строку из localStorage, превращает обратно в массив и возвращает массив постов (или пустой массив, если ничего нет).
    // Post[] - это тип возвращаемого значения
    const catString = localStorage.getItem('cat_posts');
    if (catString !== null) {
        return JSON.parse(catString); // снова массив
    } else {
        return []; // Если там ничего нет, оставляем пустой массив.
    }
}