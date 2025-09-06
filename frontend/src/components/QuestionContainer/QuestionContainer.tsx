import Heading from "./../Heading/Heading.tsx";
import TextInputField from "./../TextInputField/TextInputField.tsx";
import "./QuestionContainer.css";

type QuestionProps = {
    questionContent:string, 
    setAnswer:(text:string)=>void
}

export default function Question( { questionContent, setAnswer } : QuestionProps ){
    return (
        <div 
        className="QuestionContainer bg-gray-100 p-4 rounded-md"
        >
            <Heading 
            size="lg" 
            weight="semibold" 
            align="left" 
            className="bg-white border border-gray-0 rounded-md p-4"
            >
                Q. {questionContent}
            </Heading>
            <TextInputField setText={setAnswer} cols={45} placeholder="回答を記述してください"/>
        </div>
    );
}