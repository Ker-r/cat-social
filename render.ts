// отображение постов и реакция на действия пользователя
import { Post } from './types'

// создаёт один HTML-элемент для одного поста: текст, имя котика, дату, кнопки удаления и лайка. 
// Вешает обработчики, которые при клике меняют данные (удаляют пост или увеличивают лайк) и вызывают onUpdate(newPosts).
function createPost(postData: Post, container: HTMLDivElement, onUpdate: (posts: Post[]) => void, postsArray: Post[]) { //создаем отдельную функцию создания поста
    // (posts: Post[]) => void - мы ждем функцию, которая принимает массив постов и ничего не возвращает
    const element = document.createElement("div"); // создаем div с постом
    element.classList.add("post_card");
    element.innerHTML = `
        <span class="post_text">${postData.text}</span>
        <span class="post_name">${postData.name}</span>
        <span class="post_date">${postData.createdAt ? new Date(postData.createdAt).toLocaleString() : 'дата неизвестна'}</span>
        <span class="post_avatar">${postData.avatar || "🐱"}</span>
    `;

    const removeButton = document.createElement("button"); // создаем кнопку удаления поста
    removeButton.classList.add("button_remove");
    removeButton.textContent = "❌"; // текст внутри нее
    removeButton.addEventListener("click", function(){ // при нажатии на эту кнопку
        const isConfirmed = confirm("Точно удалить этот пост?");
        if (isConfirmed === false) return;
        const newPosts = postsArray.filter((p) =>  // вместо слова function мы добавили =>
            p !== postData // "оставляем все посты, кроме этого" // также убрали {} и return (они автоматически)
        ) // удаляем пост
        onUpdate(newPosts);
    })
    element.append(removeButton); // добавляем кнопку в созданный пост

    const editButton = document.createElement("button");
    editButton.classList.add("button_edit");
    editButton.textContent = "✏️";
    editButton.addEventListener("click", function() {
        const newText = prompt("Введите новый текст поста", postData.text); // prompt - всплывающее окно
        // Если нажали "Отмена" — выходим
        if (newText === null) return;

        // Если после удаления пробелов ничего не осталось — выходим
        if (newText.trim() === "") return;

        // Если дошли сюда — текст валидный, обновляем
        postData.text = newText.trim();
        onUpdate(postsArray);
    })
    element.append(editButton); 

    const likeButton = document.createElement("button"); // создаем кнопку для лайков
    likeButton.classList.add("button_like");
    if (postData.isLiked) {
        likeButton.classList.add("liked");
    }
    likeButton.textContent = "❤️ " + postData.likes; // добавляем текст на кнопку и количество лайков
    likeButton.addEventListener("click", function() { // при нажатии на кнопку лайка
        postData.likes++; // увеличиваем лайк на 1
        postData.isLiked = !postData.isLiked;
        onUpdate(postsArray);
    })
    element.append(likeButton); // добавляем кнопку к посту

    container.append(element); // добавляем пост 
}


// очищает контейнер (HTML-элемент post) и заново рисует все посты из postsArray. 
// При этом каждой кнопке (удалить, лайк) передаёт функцию onUpdate, чтобы сообщать об изменениях.
export function renderPosts(container: HTMLDivElement, postsArray: Post[], onUpdate: (posts: Post[]) => void): void { // функция, которая берет данные из массива и рисует html
    // container - это будет post из main.js (контейнер, куда рисовать посты).
    // postsArray — массив постов
    // onSave — это функция, которая будет вызвана, когда нужно сохранить изменения.
    container.innerHTML = "" // очистить экран
    postsArray.forEach((postData) => { // вместо слова function мы добавили =>
        createPost(postData, container, onUpdate, postsArray) // создаем пост с данными
    })
}