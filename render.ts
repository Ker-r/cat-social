// отображение постов и реакция на действия пользователя
import { Post } from './types'
import { eventBroker } from './eventBroker'

class PostCard {
    // protected - дочерние классы могут обращаться к таким полям.
    protected postData: Post;
    protected container: HTMLDivElement;
    protected onUpdate: (posts: Post[]) => void;
    protected postsArray: Post[];

    // Вешает обработчики, которые при клике меняют данные (удаляют пост или увеличивают лайк) и вызывают onUpdate(newPosts).
    constructor(postData: Post, container: HTMLDivElement, onUpdate: (posts: Post[]) => void, postsArray: Post[]) {
        // (posts: Post[]) => void - мы ждем функцию, которая принимает массив постов и ничего не возвращает
        this.postData = postData;
        this.container = container;
        this.onUpdate = onUpdate;
        this.postsArray = postsArray;
    }

    // метод отрисовывает карточку на экране
    // создаёт один HTML-элемент для одного поста: текст, имя котика, дату, кнопки удаления и лайка. 
    render(): void {
        const element = document.createElement("div"); // создаем div с постом
        element.classList.add("post_card");
        element.innerHTML = `
            <div class="post_header">
                <div class="post_header_left">
                    <span class="post_avatar">${this.postData.avatar || "🐱"}</span>
                    <div class="post_info">
                        <span class="post_name">${this.postData.name}</span>
                        <span class="post_date">${this.postData.createdAt ? new Date(this.postData.createdAt).toLocaleString() : 'дата неизвестна'}</span>
                    </div>
                </div>
                <div class="post_header_right"></div>
            </div>
            <div class="post_body">
                <span class="post_text">${this.postData.text}</span>
            </div>
        `;
        const header = element.querySelector(".post_header")!;
        const body = element.querySelector(".post_body")!;

        const removeButton = document.createElement("button"); // создаем кнопку удаления поста
        removeButton.classList.add("button_remove");
        removeButton.textContent = "❌"; // текст внутри нее
        removeButton.addEventListener("click", () => { // при нажатии на эту кнопку
            const isConfirmed = confirm("Точно удалить этот пост?");
            if (isConfirmed === false) return;
            const newPosts = this.postsArray.filter((p) =>  // вместо слова function мы добавили =>
                p.id !== this.postData.id // "оставляем все посты, кроме этого" // также убрали {} и return (они автоматически)
            ) // удаляем пост
            eventBroker.emit("postsUpdated", newPosts);
        })
        header.append(removeButton) // добавляем кнопку в созданный пост

        const editButton = document.createElement("button");
        editButton.classList.add("button_edit");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => {
            const newText = prompt("Введите новый текст поста", this.postData.text); // prompt - всплывающее окно
            // Если нажали "Отмена" — выходим
            if (newText === null) return;

            // Если после удаления пробелов ничего не осталось — выходим
            if (newText.trim() === "") return;

            // Если дошли сюда — текст валидный, обновляем
            this.postData.text = newText.trim();
            eventBroker.emit("postsUpdated" ,this.postsArray);
        })
        header.append(editButton);

        const likeButton = document.createElement("button"); // создаем кнопку для лайков
        likeButton.classList.add("button_like");
        if (this.postData.isLiked) {
            likeButton.classList.add("liked");
        }
        likeButton.textContent = "❤️ " + this.postData.likes; // добавляем текст на кнопку и количество лайков
        likeButton.addEventListener("click", () => { // при нажатии на кнопку лайка
            this.postData.likes++; // увеличиваем лайк на 1
            this.postData.isLiked = !this.postData.isLiked;
            eventBroker.emit("postsUpdated", this.postsArray);
        })
        body.append(likeButton); // добавляем кнопку к посту

        this.container.append(element); // добавляем пост 
        }
}

// наследуем от PostCard
class FeaturedPostCard extends PostCard {
    // здесь только то что отличается от PostCard
    render(): void {
        // чтобы не писать весь код заново — можно вызвать родительский метод через super.render()
        super.render(); // вызываем render() из PostCard
        // здесь добавляем своё
        const frame = this.container.lastElementChild!
        frame.classList.add("featured_card");
    }
}

// очищает контейнер (HTML-элемент post) и заново рисует все посты из postsArray. 
// При этом каждой кнопке (удалить, лайк) передаёт функцию onUpdate, чтобы сообщать об изменениях.
export function renderPosts(container: HTMLDivElement, postsArray: Post[], onUpdate: (posts: Post[]) => void): void { // функция, которая берет данные из массива и рисует html
    // container - это будет post из main.js (контейнер, куда рисовать посты).
    // postsArray — массив постов
    // onSave — это функция, которая будет вызвана, когда нужно сохранить изменения.
    container.innerHTML = "" // очистить экран
    postsArray.forEach((postData) => { // вместо слова function мы добавили =>
        if (postData.likes > 5) {
            const frameCard = new FeaturedPostCard(postData, container, onUpdate, postsArray); // new — это способ создать конкретный экземпляр класса.
            frameCard.render(); // создаем пост с данными с золотой рамкой
        }
        else {
            const card = new PostCard(postData, container, onUpdate, postsArray); // new — это способ создать конкретный экземпляр класса.
            card.render(); // создаем пост с данными
        }
    })
}

export function renderMorePosts(container: HTMLDivElement, postsArray: Post[], onUpdate: (posts: Post[]) => void): void { // функция, которая берет данные из массива и рисует html
    // container - это будет post из main.js (контейнер, куда рисовать посты).
    // postsArray — массив постов
    // onSave — это функция, которая будет вызвана, когда нужно сохранить изменения.
    postsArray.forEach((postData) => { // вместо слова function мы добавили =>
        if (postData.likes > 5) {
            const frameCard = new FeaturedPostCard(postData, container, onUpdate, postsArray); // new — это способ создать конкретный экземпляр класса.
            frameCard.render(); // создаем пост с данными с золотой рамкой
        }
        else {
            const card = new PostCard(postData, container, onUpdate, postsArray); // new — это способ создать конкретный экземпляр класса.
            card.render(); // создаем пост с данными
        }
    })
}