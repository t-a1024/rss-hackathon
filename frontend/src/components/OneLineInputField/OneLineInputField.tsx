import { useState } from "react";
import "./OneLineInputField.css";

type OneLineInputFieldProps={
    placeholder:string, 
    setText:(text:string)=>void
};

export default function OneLineInputField( {placeholder, setText} : OneLineInputFieldProps){
    const [content, setContent] = useState<string>("");
    const handleChange = ( evt:React.ChangeEvent<HTMLInputElement> )=>{
        evt.stopPropagation();
        evt.target.value ? setContent(evt.target.value) : setContent("");
        evt.target.value ? setText(evt.target.value) : setText("") ;
    };

    return (
        <input 
        type="text" 
        className="OneLineInputField" 
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
        />
    );
}