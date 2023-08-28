import React, { useState, useEffect, useRef } from 'react'
import "./styles.css";
import { words } from '../data/words';


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

function getRandomWord() {
    const wordsLength = words.length - 1;
    const randomNum = getRandomInt(0, wordsLength);
    const randomWord = words[randomNum];
    const scrabledWord = scrambleWord(randomWord);

    return [stringToArr(randomWord), stringToArr(scrabledWord)]
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
            {array.map((element: any, index: any) => {
                const correct: boolean = (element != "_" && color);
                return (
                    <div key={index} style={{ color: correct ? "green" : "black" }}>{element}</div>
                )
            })}
        </div>
    );
}

function UpdateColor() {

}


const GameBoard = () => {
    const [guesses, setGuesses] = useState<any>([]);
    const [wordsArr, setWordsArr] = useState(getRandomWord())
    const [currentArray, setCurrArray] = useState(wordsArr[1])
    const [enterAllowed, setEnterAllowed] = useState(false)
    const [gameRunning, setGameRunning] = useState(true);
    const [currGuess, setCurrGuess] = useState(new Array(wordsArr[0].length).fill(" "));
    const [currInput, setCurrInput] = useState(0);
    const inputRefs = useRef(Array.from({ length: wordsArr[0].length }, a => React.createRef())) as any;
    const buttonRef = useRef(null);

    useEffect(()=>{
        console.log(wordsArr);
    },[])

    useEffect(() => {
        function handleEnterKey(event: any) {
            if (event.key === 'Enter') {
                if (!enterAllowed) {
                    // @ts-ignore
                    buttonRef.current.click();
                    // @ts-ignore
                    buttonRef.current.focus();

                }
                else {
                    alert("Please fill all the letters!")
                }

            }
            else if (event.keyCode === 37) {
                const nextInput = inputRefs.current[currInput-1].current;
                if (nextInput) {
                    nextInput.focus();
                }
                setCurrInput(currInput-1)

            }
            else if (event.keyCode === 39) {
                const nextInput = inputRefs.current[currInput+1].current;
                if (nextInput) {
                    nextInput.focus();
                }
                setCurrInput(currInput+1)

            }
        }

        // Attach the event handler to the document
        document.addEventListener('keydown', handleEnterKey);
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleEnterKey);
        };
    }, []);

    useEffect(() => {
        console.log(enterAllowed)
    }, [enterAllowed])

    useEffect(() => {
        function handleInput(event: any, currentIndex: number) {
            const currentValue = event.target.value;
            if (currentValue) {
                setCurrInput(currentIndex + 1)
                const nextIndex = currentIndex + 1;
                if (nextIndex < inputRefs.current.length) {
                    const nextInput = inputRefs.current[nextIndex].current;
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
                else {
                    console.log("reached")
                    setEnterAllowed(true);
                }
            }
        }

        inputRefs.current.forEach((ref: any, index: any) => {
            ref?.current?.addEventListener('input', (event: any) => handleInput(event, index));
        });

        return () => {
            inputRefs.current.forEach((ref: any, index: any) => {
                ref?.current?.removeEventListener('input', (event: any) => handleInput(event, index));
            });
        };
    }, [inputRefs]);

    useEffect(() => {
        const inputBox = document.getElementById("inputid") as HTMLInputElement;
        inputBox?.setSelectionRange(0, 0);
        inputBox?.focus()
    }, []);


    // useEffect(() => {
    //     const inputBox = document.getElementById("inputid");
    //     const handleKeyDown = (event: any) => {
    //         if (event.keyCode === 39) {
    //             event.preventDefault();
    //             const currentPosition = event.target.selectionStart;
    //             event.target.setSelectionRange(currentPosition, currentPosition);
    //         }
    //     };
    //     inputBox?.addEventListener("keydown", handleKeyDown);

    //     return () => {
    //         inputBox?.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, []);

    const clearInputs = () => {
        inputRefs.current.forEach((ref: any) => {
            if (ref) {
                ref.current.value = '';
            }
        });
    };

    function onGuess(guess: any, answer: any) {
        console.log(guess, answer)
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
        console.log(enterAllowed)
        const ans = onGuess(currGuess, wordsArr[0]);
        console.log(ans)
        if (ans[0] == "CORRECT") {
            alert("You win");
            setGameRunning(false)
        }
        else {
            const newGuesses = [...guesses];
            newGuesses.push(ans);
            setGuesses(newGuesses)
            clearInputs();
        }
        setEnterAllowed(false);
    }

    const handleGuess = (e: any, index: any) => {
        var input = e.target.value.toLowerCase();
        var newGuess = currGuess;
        newGuess[index] = input;
        setCurrGuess(newGuess);
    }



    return (
        <div className="game-wrapper">
            <>

                <div id="scrambledid"><PrintString array={currentArray} color={false} /></div>

                {
                    guesses.map((guess: any) => {
                        return (
                            <PrintString array={guess} color={true} />
                        )
                    })
                }

                {
                    gameRunning ? (
                        <div className="inputs-div">
                            {
                                inputRefs.current.map((ref: any, index: any) => {
                                    return (<div className="guess-input">
                                        <input className="inputstyles" ref={ref} autoFocus id="inputid" maxLength={1} placeholder={"_"} onChange={(e: any) => handleGuess(e, index)}></input>
                                    </div>)
                                })
                            }

                        </div>

                    ) : (
                        <PrintString array={wordsArr[0]} color={false} />
                    )
                }

            </>


            <br />
            <br />
            <br />

            <button ref={buttonRef} onClick={handleOnEnter} disabled={enterAllowed ? false : true}>
                <span>
                    Enter
                </span>
            </button>
        </div>
    )
}

export default GameBoard