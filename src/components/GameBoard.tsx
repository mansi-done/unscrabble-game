import React, { useState, useEffect, useRef } from 'react'
import "./styles.css";
import { words } from '../data/words';
import axios from 'axios';
import { message, Modal } from 'antd';



function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const stringToArr = (str: string) => {
    const arr = [];
    for (var i = 0; i < str.length; i++) {
        arr.push(str[i]);
    }
    return arr;
}

// function getRandomWord() {
//     const wordsLength = words.length - 1;
//     const randomNum = getRandomInt(0, wordsLength);
//     const randomWord = words[randomNum];
//     const scrabledWord = scrambleWord(randomWord);

//     return [stringToArr(randomWord), stringToArr(scrabledWord)]
// }

function getRandomWord(word: string) {
    // const wordsLength = words.length - 1;
    // const randomNum = getRandomInt(0, wordsLength);
    // const randomWord = words[randomNum];
    const scrambledWord = scrambleWord(word);
    return [stringToArr(word), stringToArr(scrambledWord)]

}

function scrambleWord(word: string) {
    // Convert the word to an array of characters
    const characters = word.split('');

    // Shuffle the characters using the Fisher-Yates shuffle algorithm
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    // Join the shuffled characters back into a string
    const scrambledWord = characters.join('');
    return scrambledWord;
}

function generateString(length: number) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += "_";
    }
    return result;
}

function areEqual(arr1: any, arr2: any) {
    const N = arr1.length;

    for (let i = 0; i < N; i++)
        if (arr1[i] != arr2[i])
            return false;

    return true;
}

function PrintString(props: any) {
    const { array, color } = props;
    return (
        <div className="guess">
            {array?.map((element: any, index: any) => {
                const correct: boolean = (element != "_" && color);
                return (
                    <div key={index} style={{ color: correct ? "green" : "black" }}>{element}</div>
                )
            })}
        </div>
    );
}



const GameBoard = ({ letters, setLetters }: { letters: number, setLetters: React.Dispatch<React.SetStateAction<number>> }) => {
    const [word, setWord] = useState(null)
    const [wordsArr, setWordsArr] = useState<any>(null)
    const [guesses, setGuesses] = useState<any>([]);
    const [currentArray, setCurrArray] = useState<any>(null)
    const [enterAllowed, setEnterAllowed] = useState(false)
    const [gameRunning, setGameRunning] = useState(true);
    const [currGuess, setCurrGuess] = useState<any>(null);
    const [currInput, setCurrInput] = useState(0);
    const inputRefs = useRef(Array.from({ length: letters }, a => React.createRef())) as any;
    const buttonRef = useRef(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [gameOverModal, setGameOverModal] = useState<boolean>(false);
    const [gif, setGif] = useState<string | null>(null)


    const baseURL = `https://random-word-api.herokuapp.com/word?length=${letters}`;

    const error = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    const warning = (message: string) => {
        messageApi.open({
            type: 'warning',
            content: message,
        });
    };

    useEffect(() => {
        axios.get(baseURL).then((response) => {
            setWord(response.data[0])
            setWordsArr(getRandomWord(response.data[0]))
        });
    }, [letters]);

    useEffect(() => {
        axios.get("https://g.tenor.com/v1/search?q=dancing&key=LIVDSRZULELA&limit=20").then((response) => {
            const random = Math.floor(Math.random() * (19))
            setGif(response.data.results[random].media[0].gif.url)
        });
    }, [letters])


    useEffect(() => {
        if (!wordsArr) return;
        inputRefs.current = Array.from({ length: letters }, a => React.createRef())
        setCurrArray(wordsArr[1])
        setGuesses([])
        setEnterAllowed(false)
        setCurrInput(0)
        setCurrGuess(new Array(wordsArr[0].length).fill(" "))
        setGameRunning(true)
    }, [wordsArr])

    // useEffect(() => {
    //     console.log(currGuess)
    // }, [currGuess])
    useEffect(() => {
        function handleEnterKey(event: any) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (enterAllowed) {
                    // @ts-ignore
                    buttonRef.current.click();
                    // @ts-ignore
                    buttonRef.current.focus();
                    inputRefs.current[0].current.focus()

                }
                else {
                    // alert("Please fill all the letters!")
                    warning("Please fill all the letters!")
                }

            }
            else if (event.keyCode == 8 || event.keyCode == 46) {
                const newCurrInput = currInput - 1;
                if (newCurrInput > -1) {
                    const newGuess = [...currGuess]
                    newGuess[newCurrInput] = " "
                    setCurrGuess(newGuess)
                    setCurrInput(newCurrInput)
                    inputRefs?.current[currInput - 1].current.focus()
                }
            }
        }

        document.addEventListener('keydown', handleEnterKey);
        return () => {
            document.removeEventListener('keydown', handleEnterKey);
        };
    }, [currInput, currGuess]);



    useEffect(() => {
        const inputBox = document.getElementById("inputid") as HTMLInputElement;
        inputBox?.setSelectionRange(0, 0);
        inputBox?.focus()
    }, []);

    const clearInputs = () => {
        inputRefs.current.forEach((ref: any) => {
            if (ref) {
                ref.current.value = '';
            }
        });
    };

    function onGuess(guess: any, answer: any) {
        if (areEqual(guess, answer)) {
            return ["CORRECT"];
        }
        var guessedArr = [];
        const n = guess.length;
        for (var i = 0; i < n; i++) {
            if (guess[i] == answer[i]) guessedArr.push(guess[i]);
            else guessedArr.push("_");
        }
        return guessedArr;
    }

    const handleOnEnter = () => {
        const ans = onGuess(currGuess, wordsArr[0]);
        if (ans[0] == "CORRECT") {
            // alert("You win");
            setGameOverModal(true)
            setGameRunning(false)
        }
        else {
            const newGuesses = [...guesses];
            newGuesses.push(ans);
            setGuesses(newGuesses)
            clearInputs();
            inputRefs.current[0].current.focus()
        }
        setEnterAllowed(false);
    }

    const handleGuess = (e: any, index: any) => {
        var input = e.target.value.toLowerCase();
        var newGuess = currGuess;
        newGuess[index] = input;
        setCurrGuess(newGuess);
        if (input) {
            inputRefs.current[index].current.value = input;
            setCurrInput(index + 1)
            const nextIndex = index + 1;
            if (nextIndex < letters) {
                const nextInput = inputRefs.current[nextIndex].current;
                if (nextInput) {
                    nextInput.focus();
                }
            }
            else {
                setEnterAllowed(true);
            }
        }
    }



    return (

        <div className="game-wrapper">
            {contextHolder}
            <>
                {
                    gameRunning ? (
                        <>
                            {wordsArr ? <div id="scrambledid"><PrintString array={currentArray} color={false} /></div> : <div style={{ fontSize: "1rem" }}>Loading...</div>}

                            {guesses.map((guess: any) => {
                                return (
                                    <PrintString array={guess} color={true} />
                                )
                            })}
                            <div className="inputs-div">
                                {
                                    inputRefs.current.map((ref: any, index: any) => {
                                        return (<div className="guess-input">
                                            <input className="inputstyles" ref={ref} id="inputid" maxLength={1} placeholder={"_"} onChange={(e: any) => handleGuess(e, index)}></input>
                                        </div>)
                                    })
                                }

                            </div>
                            <br />

                            <button ref={buttonRef} className="enterBtn" onClick={handleOnEnter} disabled={enterAllowed ? false : true}>
                                <span>
                                    Enter
                                </span>
                            </button>
                        </>


                    ) : (<>

                        <div style={{ fontSize: "1.5rem" }}>Please Select number of letters above :)</div>


                        <Modal
                            title="YOU WON KKHHKKHHSSHSHSHSHSH"
                            centered
                            open={gameOverModal}
                            onOk={() => {
                                setGameOverModal(false)
                                setLetters(letters + 1)
                            }
                            }
                            okText="Play Again"
                            onCancel={() => setGameOverModal(false)}
                        >
                            <div style={{maxWidth:"90vw"}}>
                                <div style={{ fontSize: "1.5rem" }}>Word: {word}</div>
                                <div style={{ fontSize: "1.5rem" }}>Guesses: {guesses.length + 1}</div>
                                {gif && <img src={gif} width={"100%"} alt="loading..." />}
                            </div>
                        </Modal>
                    </>
                    )
                }
            </>
        </div>
    )
}

export default GameBoard