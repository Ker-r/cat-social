let posts = []; // создаем массив постов
const button = document.querySelector(".button") // ищем кнопку
const input = document.querySelector(".text") // ищем поле ввода
const post = document.querySelector(".post") // ищем тег для всех постов
button.addEventListener("click", function() { // при нажатии на кнопку
    if(input.value.trim() === "") { // если текста внутри поля нет
        return // мы ничего не делаем
    }
    const postData = { // создаем объект поста
        text: input.value, // в текст передаем введеный в поле текст
        likes: 0 // изначально лайки = 0
    }
    posts.push(postData) // добавляем созданный пост в массив

    renderPosts() // вызывает функцию 
    input.value = ""; // очищаем поле
});

function createPost(postData) { //создаем отдельную функцию создания поста
    const element = document.createElement("div"); // создаем div с постом
    const textElement = document.createElement("span"); // создаем отдельный тег для текста поста
    textElement.textContent = postData.text; // и добавляем в него введенный текст
    element.append(textElement); // добавляем текст к посту

    const removeButton = document.createElement("button"); // создаем кнопку удаления поста
    removeButton.textContent = "❌"; // текст внутри нее
    removeButton.addEventListener("click", function(){ // при нажатии на эту кнопку
        posts = posts.filter((p) =>  // вместо слова function мы добавили =>
            p !== postData // "оставляем все посты, кроме этого" // также убрали {} и return (они автоматически)
        ) // удаляем пост
        renderPosts()
    })
    element.append(removeButton); // добавляем кнопку в созданный пост
    post.append(element); // добавляем пост 

    const likeButton = document.createElement("button"); // создаем кнопку для лайков
    likeButton.textContent = "❤️ " + postData.likes; // добавляем текст на кнопку и количество лайков
    likeButton.addEventListener("click", function() { // при нажатии на кнопку лайка
        postData.likes++; // увеличиваем лайк на 1
        likeButton.textContent = "❤️ " + postData.likes; //обновляем количество лайков в кнопке
    })
    element.append(likeButton); // добавляем кнопку к посту
}

function renderPosts() { // функция, которая берет данные из массива и рисует html
    post.innerHTML = "" // очистить экран
    posts.forEach((postData) => { // вместо слова function мы добавили =>
        createPost(postData) // создаем пост с данными
    })
}
