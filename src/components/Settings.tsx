import React from 'react';
import "./styles.css";
import { message, InputNumber } from 'antd';




const Settings = ({ letters, setLetters }: { letters: number, setLetters: React.Dispatch<React.SetStateAction<number>> }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Please input a number more than 1',
        });
    };

    const handleLetterChange = (value: number | null) => {
        if (value == 1) error()
        else if (value) setLetters(value)
    }
    return (
        <div className="setting-input">
            <div>Enter No. of Letters:</div>
    
            {contextHolder}
            {/* <input className="letterInput" type='number' onChange={handleLetterChange} value={letters}></input> */}
            <InputNumber onChange={handleLetterChange} value={letters} />
        </div>
    )
}

export default Settings