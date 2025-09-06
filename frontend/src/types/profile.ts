type ProfileProps = {
    name: string;
    role: {
        title: string;
        imageUrl: string;
        birthday: string;
        age: number | string;
        enthusiasm: string;
        birthplace: string;
        affiliation: string;
        description: string;
        suitability: string;
    };
    onPrev?: () => void;
    onNext?: () => void;
    showArrows?: boolean;
};

export type {ProfileProps};