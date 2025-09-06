import React, { useState } from "react";
import "./OneLineInputField.css";

type OneLineInputFieldProps={
    placeholder:string, 
    setText:(text:string)=>void,
    value?:string
};

export default function OneLineInputField( {placeholder, setText, value} : OneLineInputFieldProps){
    const [content, setContent] = useState<string>(value || "");
    
    // propsのvalueが変更された場合は内部stateを更新
    React.useEffect(() => {
        if (value !== undefined) {
            setContent(value);
        }
    }, [value]);
    
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