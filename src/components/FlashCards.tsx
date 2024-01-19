import { useEffect, useState } from "react"
import { FlashCard } from "../types/flashCard"
import { css } from "@shadow-panda/styled-system/css"
import { hstack, vstack } from "@shadow-panda/styled-system/patterns"


const FlashCards = () => {
    const [revealed, setRevealed] = useState(false)
    const [flashCards, setFlashCards] = useState<FlashCard[]>([])
    const [index, setIndex] = useState(0)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [label, setLabel] = useState("")
    const [change, setChange] = useState(false)


    useEffect(() => {
        const storageFlashcards = localStorage.getItem("flashCards")
        if (storageFlashcards) {
            const parsedList = JSON.parse(storageFlashcards)
            const flashCardsListed = Object.keys(parsedList).map(key => parsedList[key])
            setFlashCards(flashCardsListed)
            setQuestion(flashCardsListed[index].question)
            setAnswer(flashCardsListed[index].answer)
            setLabel(flashCardsListed[index].label)
        }
    }, [])

  
    if (change) {
        setQuestion(flashCards[index].question)
        setAnswer(flashCards[index].answer)
        setLabel(flashCards[index].label)
        setChange(false)
    }

    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const putAtIndex = (givenIndex: number) => {
        const tempFlashCards = flashCards
        const flashCard = tempFlashCards.shift()
        if (flashCard) {
            tempFlashCards.splice(givenIndex, 0, flashCard)
            setFlashCards(tempFlashCards)
            localStorage.setItem("flashCards", JSON.stringify(tempFlashCards))
            setRevealed(false)
            const endIndex = flashCards.length -  1
            if (index !== endIndex){
                setIndex(index => index + 1)
            }
            else {
                setIndex(0)
            }
            setChange(true)

        }
    }

    const earlyInsert = () => {
        const end = Math.max(Math.floor(flashCards.length / 3), 1)
        const randNum = getRandomInt(1, end)
        putAtIndex(randNum)
    }

    const middleInsert = () => {
        const begin = Math.max(Math.floor(flashCards.length / 3) , 1)
        const end = Math.max(Math.floor(flashCards.length * 2 / 3), 1)
        const randNum = getRandomInt(begin, end)
        putAtIndex(randNum)
    }

    const endInsert = () => {
        const begin = Math.max(Math.floor(flashCards.length * 2 / 3), 1)
        const end = flashCards.length - 1
        const randNum = getRandomInt(begin, end)
        putAtIndex(randNum)
    }

    const onReveal = () => {
        setRevealed(true)
    }

    const answerButtonStyle = css({
        color: "white",
        backgroundColor: "stone.700",
        padding: "1%",
        width: "50%",
        // margin: "1",
        border: "none",
        borderRadius: "sm",
        display: "flex",
        justifyContent: "center",
        _hover: {
            backgroundColor: "stone.600",
        },
    })
    return (
        <div 
        className={css({
            width: "full",
            height: "full",
        })}>
        {!revealed ? 
        <div className={css({height: "100%"})}>
            <div className={vstack({
                height: "100%"
            })}>
                <div
                className={vstack({
                    height: "10%",
                    gap: "10%",
                    marginTop: "4%"
                })}
                >
                    <h1>{label}</h1>
                    <h2>{question}</h2>
                </div>
                <button 
                onClick={onReveal}
                className={css({
                    color: "white",
                    backgroundColor: "stone.700",
                    padding: "1",
                    width: "50%",
                    margin: "1",
                    border: "none",
                    borderRadius: "sm",
                    display: "flex",
                    justifyContent: "center",
                    _hover: {
                        backgroundColor: "stone.600",
                    }
                })}
                >
                    Reveal
                </button>
            </div>
        </div>
        :
        <div
        className={vstack({
            width: "full",
            height: "20%"
        })}
        >
            <h1
            className={css({
                margin: "auto"
            })} 
            >{answer}</h1>
            <div 
            className={hstack({ 
                    width: "50%",
                    // height: "20%",
                    gap: "0",
                })}>
                <button className={answerButtonStyle} onClick={earlyInsert}>
                    early
                </button>
                <button className={answerButtonStyle} onClick={middleInsert}>
                    middle
                </button>
                <button className={answerButtonStyle} onClick={endInsert}>
                    end
                </button>
            </div>
        </div>
        }
        </div>
    )

}

export default FlashCards