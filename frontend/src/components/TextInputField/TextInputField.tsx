import { useState } from "react";
import "./TextInputField.css";

type TextInputFieldProps={
    setText:( text:string )=>void, 
    rows:number, 
    cols:number, 
    placeholder:string
};

export default function TextInputField({ setText,rows ,cols ,placeholder } :TextInputFieldProps){
    const [content, setContent] = useState<string>("");
    const handleChange = ( evt:React.ChangeEvent<HTMLTextAreaElement> )=>{
        evt.stopPropagation();
        setContent(evt.target.value);
        evt.target.value && setText(evt.target.value);
    }
    
    return (
        <textarea 
        className="TextInputField" 
        rows={rows} 
        cols={cols} 
        placeholder={placeholder} 
        value={content} 
        onChange={handleChange}
        required 
        />
    );
}