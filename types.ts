// файл для описания типов и интерфейсов

// интерфейс для PostData - это описание того как должен выглядеть объект
export interface Post {
    id: string;
    text: string;
    name: string;
    avatar: string;
    photo?: string; // ? означает что поле может быть, а может не быть
    createdAt: Date;
    likes: number;
    isLiked: boolean;
}

// интерфейс для ServerPost
export interface ServerPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}
