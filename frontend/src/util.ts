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
    questions:Array<Question>
};

type PostJSON = {
    name:string,
    birthdate:string,
    age:number,
    hometown:string,
    affiliation:string,
    aspiration:string,
    answers:Array<Answer>
};

export type {Question, Answer, GetJSON, PostJSON};