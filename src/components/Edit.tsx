import { SubmitHandler, useForm } from "react-hook-form";
import { hstack, vstack } from "@shadow-panda/styled-system/patterns";
import { css } from "@shadow-panda/styled-system/css";
import { useEffect, useState } from "react";
import type { FlashCard } from "../types/flashCard";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";



const Edit = () => {
    const [flashCards, setFlashCards] = useState<FlashCard[]>(JSON.parse(localStorage.getItem("flashCards") || '{}'))
    const [question, setQuestion] = useState("question")
    const [label, setLabel] = useState("label")
    const [answer, setAnswer] = useState("answer")
    const [index, setIndex] = useState(0)
    const [canGoNext, setCanGoNext] = useState(false)
    const [canGoprev, setCanGoPrev] = useState(false)
    const [canAddCard, setCanAddCard] = useState(false)
    // const [submitName, setSubmitName] = useState("save")

    const {register, handleSubmit, reset} = useForm<FlashCard>()

    const onSubmit: SubmitHandler<FlashCard> = (data) =>{
        const tempFlashCard = {
            "question": data["question"],
            "label": data["label"],
            "answer": data["answer"]
        }
        let tempFlashCards=[]
        if(flashCards){
            tempFlashCards = flashCards
            tempFlashCards[index] = tempFlashCard

        }
        else {
             tempFlashCards = [tempFlashCard]
        }
        if (index === Object.keys(flashCards).length - 1) {
            setCanAddCard(true)
        }
        setFlashCards(tempFlashCards)
        localStorage.setItem("flashCards", JSON.stringify(flashCards))
        
    }


    const goToIndex = (index: number) => {
        setIndex(index)
        if (index === Object.keys(flashCards).length - 1) {
            setCanGoNext(false)
            setCanGoPrev(true)
        }
        else if (index === 0) {
            setCanGoPrev(false)
            setCanGoNext(true)

        }
        else {
            setCanGoNext(true)
            setCanGoPrev(true)
        }
        setQuestion(flashCards[index]["question"])
        setLabel(flashCards[index]["label"])
        setAnswer(flashCards[index]["answer"])

    }
    const onPrevClicked = () => {
        goToIndex(index - 1)
    }

    const onNextClicked = () => {
        goToIndex(index + 1)
    }

    const addCard = () => {
        const flashCard = {
            question: "question",
            answer: "answer",
            label: "label"
        }
        const tempFlashCards = flashCards
        const addedIndex = Object.keys(flashCards).length
        tempFlashCards[addedIndex] = flashCard
        setFlashCards(tempFlashCards)
        goToIndex(addedIndex)
        setCanAddCard(false)
    }

    useEffect(() => {
        if (flashCards !== undefined) {
            // const tempFlashCards = Object.keys(flashCards).map((key) => [key, flashCards[key]])
            // setFlashCards(tempFlashCards)
            if (flashCards && Object.keys(flashCards).length !== 0){
                setQuestion(flashCards[0]["question"])
                setLabel(flashCards[0]["label"])
                setAnswer(flashCards[0]["answer"])
                if (Object.keys(flashCards).length > 1 ) {
                    setCanGoNext(true)
                    setCanAddCard(true)
                }
        }

        }
    }, [])

    useEffect(() => {
        reset({
            question: question,
            label: label,
            answer: answer
        })
    }, [question, label, answer, reset])

    const inputStyle = css({
        bg: "stone.500",
        rounded: "md",
        color: "white",
        w: "50%",
        h: "15%",
        p: "2"
    })
    
    const moveButtonStyle = css ({
        bg: "indigo.900",
        px: "4",
        rounded: "xl",
        mb: "2",
        
        _hover: {
            bg:"indigo.800",
        },
        _disabled: {
            opacity: "50%",
            cursor: "not-allowed",
        }
    })

    return (
        <div className={css({
            h: "90%"
        })}>
            <div className={hstack({
                justify: "center",
                // gap: "20%"
            })}>
                <button onClick={onPrevClicked} disabled={!canGoprev} className={moveButtonStyle}>
                    <ChevronLeft />
                </button>
                <button className={
                    css({
                        bg: "indigo.900",
                        px: "16",
                        mx: "15%",
                        rounded: "lg",
                        mb: "2",
                        _hover: {
                            bg: "indigo.800",
                        },
                        _disabled: {
                            opacity: "50%",
                            cursor: "not-allowed",
                        }
                    })}
                onClick={addCard}
                disabled={!canAddCard}
                >
                    <Plus />
                </button>
                <button onClick={onNextClicked} disabled={!canGoNext} className={moveButtonStyle}>
                    <ChevronRight />
                </button>
            </div>
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className={vstack({
                w: "screen",
                h: "100%"
            })}
            >
                <textarea className={inputStyle}  {...register("question")} />
                <input 
                className={css({
                    bg: "stone.500",
                    rounded: "md",
                    color: "white",
                    w: "50%",
                    h: "5%",
                    p: "2"                    
                })} 
                
                {...register("label")}
                />
                <textarea className={inputStyle}  {...register("answer")} />
                <input className={css({
                    bg: "indigo.800",
                    p: "2",
                    rounded: "3xl",
                    _hover: {
                        bg: "indigo.700",
                        cursor: "pointer",
                    },
                })} 
                type="submit"
                // value="add"                
                />
            </form>


        </div>
    )
}

export default Edit