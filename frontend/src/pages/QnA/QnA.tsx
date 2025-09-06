import { useState, useEffect } from "react";
import Heading from "./../../components/Heading/Heading.tsx";
import Button from "./../../components/Button/Button.tsx";
import QuestionContainer from "./../../components/QuestionContainer/QuestionContainer.tsx";
import type {GetJSON, PostJSON, Question, Answer} from "./../../util.ts";
import "./QnA.css";

const dummyData:GetJSON = {
  "id": "room123",
  "capacity": 4,
  "questions": [
      {
          "questionId": "q1",
          "question": "好きな歌は？"
      },
      {
        "questionId": "q3",
          "question": "好きなゲームは？"
        }
  ]
};

const postData:PostJSON = {
  "name": "Taro Yamada",
  "birthdate": "2000-04-01",
  "age": 25,
  "hometown": "Osaka, Japan",
  "affiliation": "Example Inc.",
  "aspiration": "I'm excited for this new challenge and will do my best to contribute to the team!",
	"answers": [
    {
      "questionId": "q1",
      "value": "hogehoge"
    },
    {
      "questionId": "q3",
      "value": "tekitou"
    }
  ]
}

export default function QnA(){
    // 初回レンダリング時だけ行う処理
    useEffect(
        ()=>{
            // GetJSON型データをリクエストする所
        } ,
        []
    );

    const questions:Array<Question> = dummyData.questions;
    const [post,setPost] = useState<PostJSON>(postData);

    const setAnswer = ( questionId:string, value:string )=>{
        setPost(
            prev =>{
                const nxt = { ...prev };
                const tmp :Answer|undefined = nxt.answers.find( answer => answer.questionId === questionId );
                if(tmp)tmp.value = value;
                return nxt;
            }
        );
    };

    const handleClick = ()=>{
        // POST する処理を書く
        console.log(post);
    };

    return(
        <>
            <Heading 
            size="lg" 
            weight="semibold" 
            align="left"
            >
                {postData.name}さん
            </Heading>
            <div 
            className="QnA"
            >
                {
                    questions.map(
                        (question) =>{
                            return <QuestionContainer 
                            key={question.questionId}
                            questionContent={question.question} 
                            setAnswer={(text:string) => setAnswer(question.questionId,text)} 
                            />
                        }
                    )
                }
                <Button text="回答" onClickFunc={handleClick}/>
            </div>
        </>
    );
}