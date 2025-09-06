import { useState } from "react";
import "./TextInputField.css";

type TextInputFieldProps={
    setText:( text:string )=>void, 
    placeholder:string,
    className?:string
};

export default function TextInputField({ className, setText, placeholder } :TextInputFieldProps){
    const [content, setContent] = useState<string>("");
    const handleChange = ( evt:React.ChangeEvent<HTMLTextAreaElement> )=>{
        evt.stopPropagation();
        evt.target.value ? setContent(evt.target.value) : setContent("");
        evt.target.value ? setText(evt.target.value) : setText("");
    }
    
    return (
        <textarea 
        className={className+" TextInputField"} 
        placeholder={placeholder} 
        value={content} 
        onChange={handleChange}
        required 
        />
    );
}