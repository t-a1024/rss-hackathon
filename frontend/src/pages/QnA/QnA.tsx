import { useState, useEffect } from "react";
import Heading from "./../../components/Heading/Heading.tsx";
import Button from "./../../components/Button/Button.tsx";
import QuestionContainer from "./../../components/QuestionContainer/QuestionContainer.tsx";
import type {GetJSON, PostJSON, Question, Answer, BaseInformation} from "./../../util.ts";
import {getAPI, postAPI} from "./../../util.ts";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./QnA.css";

const dummyData:Array<Question> = [
        {
            questionId:"",
            question:""
        }
    ];

const postData:PostJSON = {
  "name": "Taro Yamada",
  "birthdate": "2000-04-01",
  "age": 25,
  "hometown": "Osaka, Japan",
  "affiliation": "Example Inc.",
  "aspiration": "I'm excited for this new challenge and will do my best to contribute to the team!",
  "answers": []
}

export default function QnA(){
    const { roomId } = useParams(); // フックはトップレベルで使う方が安全
    const navigate = useNavigate();
    // 初回レンダリング時だけ行う処理
    const [questions,setQuestions] = useState<Array<Question>>(dummyData);
    useEffect(() => {
        const fetchData = async () => {
            console.log("useEffect!");

            try {
                console.log(roomId);
                const json: GetJSON = await getAPI(`rooms/${roomId}`);
                setQuestions(json.questions);
                console.log(json);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData(); // ここで関数を呼ぶ
    }, []);

    // 基本情報設定
    const tmp:BaseInformation = JSON.parse(localStorage.baseInfo);
    postData.name = tmp.name;
    postData.age = tmp.age;
    postData.birthdate = tmp.birthdate;
    postData.aspiration = tmp.aspiration;
    postData.hometown = tmp.hometown;

    const [post,setPost] = useState<PostJSON>(postData);

    const setAnswer = ( questionId:string, value:string )=>{
        setPost(
            prev =>{
                const nxt = { ...prev };
                const tmp :Answer|undefined = nxt.answers.find( answer => answer.questionId === questionId );
                if(tmp)tmp.value = value;
                else nxt.answers.push({questionId, value});
                return nxt;
            }
        );
    };

    const handleClick = ()=>{
        // POST する処理を書く
        const postData = async(data:JSON) =>{
            try{
                const json = await postAPI(`rooms/${roomId}/answers`,data);
                if (roomId)navigate(`/rooms/${roomId}/results`);
                else toast.error("URL から roomId を取得できませんでした。");
                console.log(json);
            }catch(err){
                console.log(err);
                toast.error("質問の回答の送信に失敗しました．");
            }
        };
        const jsonStr = JSON.stringify(post);
        const obj:JSON = JSON.parse(jsonStr);
        postData(obj);
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