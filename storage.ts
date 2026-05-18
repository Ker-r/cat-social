// работа с хранилищем браузера
import { nanoid } from 'nanoid';
import { Post } from './types'
import { ServerPost } from './types';

class PostStorage {
    // Сохраняем текущий массив постов в localStorage,
    // чтобы при перезагрузке страницы они не исчезли.
    savePostsToLocalStorage(postsArray: Post[]): void { // получает массив постов, превращает его в строку и сохраняет в localStorage.
        const catPosts = JSON.stringify(postsArray); // превращает массив posts в строку
        localStorage.setItem('cat_posts', catPosts); // сохраняет в localStorage под ключом "cat_posts"
    }

    // При загрузке страницы достаём сохранённые посты из браузера.
    loadPostsFromLocalStorage(): Post[] { // читает строку из localStorage, превращает обратно в массив и возвращает массив постов (или пустой массив, если ничего нет).
        // Post[] - это тип возвращаемого значения
        const catString = localStorage.getItem('cat_posts');
        if (catString !== null) {
            const posts = JSON.parse(catString);
            const postsWithId = posts.map((post: Post) => {
                return this.addMissingId(post); // this нужен, чтобы вызвать другой метод
            });
            return postsWithId;
        } else {
            return []; // Если там ничего нет, оставляем пустой массив.
        }
    }

    // При загрузке страницы достаём сохранённые посты из браузера.
    async loadPostsFromServer(): Promise<ServerPost[]> {
        try { // пробуем выполнить запрос
            const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // отправляем запрос на сервер, ждём ответа (конверт)
            const data = await response.json(); // вскрываем конверт — достаём данные из ответа
            return data; // возвращаем массив постов
        } 
        catch(error) { // если что-то пошло не так (нет интернета, сервер недоступен)
            console.log(error); // выводим ошибку в консоль
            return []; // возвращаем пустой массив чтобы приложение не сломалось
        }
    }

    private addMissingId(post: Post): Post { 
        if (!post.id) {
            post.id = nanoid(); // добавляем id если его нет
        }
        return post; // возвращаем пост обратно 
    }
}

export const storage = new PostStorage();