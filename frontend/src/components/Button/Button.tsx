import "./Button.css";

type ButtonProps = {
    text:string,
    onClickFunc:()=>void
};

export default function Button( {text, onClickFunc} : ButtonProps){
    return (
            <button 
            type="submit" 
            className="Button" 
            onClick={onClickFunc}
            >
                {text}
            </button>
    );
}