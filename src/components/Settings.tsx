import React from 'react';
import "./styles.css"

const Settings = ({ letters, setLetters }: { letters: number, setLetters: React.Dispatch<React.SetStateAction<number>> }) => {
    const handleLetterChange = (event:any) =>{
        const num = event.target.value;
        setLetters(num)
    } 
    return (
        <div className="setting-input">Enter No. of Letters:
            <div >
                <input className="letterInput" type='number' onChange={handleLetterChange} value={letters}></input>
            </div>
        </div>
    )
}

export default Settings