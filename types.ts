// файл для описания типов и интерфейсов

// интерфейс для PostData - это описание того как должен выглядеть объект
export interface Post {
    id: string;
    text: string;
    name: string;
    avatar: string;
    createdAt: Date;
    likes: number;
    isLiked: boolean;
}