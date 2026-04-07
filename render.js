// отображение постов и реакция на действия пользователя


// создаёт один HTML-элемент для одного поста: текст, имя котика, дату, кнопки удаления и лайка. 
// Вешает обработчики, которые при клике меняют данные (удаляют пост или увеличивают лайк) и вызывают onUpdate(newPosts).
function createPost(postData, container, onUpdate, postsArray) { //создаем отдельную функцию создания поста
    const element = document.createElement("div"); // создаем div с постом
    const textElement = document.createElement("span"); // создаем отдельный тег для текста поста
    const catNamePost = document.createElement("span"); // тег для имени
    const dateString = document.createElement("span"); // тег для времени

    textElement.textContent = postData.text; // и добавляем в него введенный текст
    catNamePost.textContent = postData.name || 'Анонимный котик';
    dateString.textContent = postData.createdAt // может быть строкой (после JSON.stringify/parse) или объектом Date
        ? new Date(postData.createdAt).toLocaleString() // превращает дату в строку типа «06.04.2026, 12:34:56».
        : 'дата неизвестна';

    element.append(textElement); // добавляем текст к посту
    element.append(catNamePost);
    element.append(dateString);

    const removeButton = document.createElement("button"); // создаем кнопку удаления поста
    removeButton.textContent = "❌"; // текст внутри нее
    removeButton.addEventListener("click", function(){ // при нажатии на эту кнопку
        const newPosts = postsArray.filter((p) =>  // вместо слова function мы добавили =>
            p !== postData // "оставляем все посты, кроме этого" // также убрали {} и return (они автоматически)
        ) // удаляем пост
        onUpdate(newPosts);
    })
    element.append(removeButton); // добавляем кнопку в созданный пост

    const likeButton = document.createElement("button"); // создаем кнопку для лайков
    likeButton.textContent = "❤️ " + postData.likes; // добавляем текст на кнопку и количество лайков
    likeButton.addEventListener("click", function() { // при нажатии на кнопку лайка
        postData.likes++; // увеличиваем лайк на 1
        onUpdate(postsArray);
    })
    element.append(likeButton); // добавляем кнопку к посту

    container.append(element); // добавляем пост 
}


// очищает контейнер (HTML-элемент post) и заново рисует все посты из postsArray. 
// При этом каждой кнопке (удалить, лайк) передаёт функцию onUpdate, чтобы сообщать об изменениях.
export function renderPosts(container, postsArray, onUpdate) { // функция, которая берет данные из массива и рисует html
    // container - это будет post из main.js (контейнер, куда рисовать посты).
    // postsArray — массив постов
    // onSave — это функция, которая будет вызвана, когда нужно сохранить изменения.
    container.innerHTML = "" // очистить экран
    postsArray.forEach((postData) => { // вместо слова function мы добавили =>
        createPost(postData, container, onUpdate, postsArray) // создаем пост с данными
    })
}