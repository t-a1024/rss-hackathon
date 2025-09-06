type Question = {
    questionId:string,
    question:string
};

type Answer = {
    questionId:string,
    value:string
};

type GetJSON = {
    id:string,
    capacity:number,
    questions:Question[]
};

type PostJSON = {
    name:string,
    birthdate:string,
    age:number,
    hometown:string,
    affiliation:string,
    aspiration:string,
    answers:Answer[]
};

const apiUrl = import.meta.env.VITE_API_URL;

export const getAPI = async (url:string) => {
    const response = await fetch(`${apiUrl}/${url}`);
    if (!response.ok) throw new Error(`GET request failed: ${response.status}`);
    return response.json();
}

export const postAPI = async (url:string,data:JSON) => {
    const response = await fetch(`${apiUrl}/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST request failed: ${response.status}`);
    return response.json();
}

export type {Question, Answer, GetJSON, PostJSON};