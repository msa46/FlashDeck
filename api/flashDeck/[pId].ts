import { FlashCard, PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";

const prisma = new PrismaClient();

export default async (req: VercelRequest, res: VercelResponse) => {
    const { pId } = req.query;
    if (req.method === "GET") {
        const flashDeck = await prisma.flashDeck.findUnique({
            where: {
                pId: Number(pId),
            },

        });
        if (flashDeck) {
            delete flashDeck.signedSecret;
            res.status(200).send(flashDeck);
        }
        else {
            res.status(404).send("Flash deck not found");
        }
    }
    else if (req.method === "PATCH") {
        const { pId, signedSecret, flashCards } = req.body;
        
        const flashDeck = await prisma.flashDeck.findUnique({
            where: {
                pId: Number(pId),
            },
        });
        if (signedSecret === flashDeck?.signedSecret){
            const newFlashcards: FlashCard[]  = [];
            const parsedFlashCards = JSON.parse(flashCards);
            for(const key in Object.keys(parsedFlashCards)){
                if(parsedFlashCards[key].id){
                    const newFlashCard = await prisma.flashCard.update({
                        where: {
                            id: parsedFlashCards[key].id
                        },
                        data: {
                            question: parsedFlashCards[key].question,
                            answer: parsedFlashCards[key].answer,
                            label: parsedFlashCards[key].label
                        }
                    });
                    newFlashcards.push(newFlashCard);

            }
            else {
                const newFlashCard = await prisma.flashCard.create({
                    data: {
                        question: parsedFlashCards[key].question,
                        answer: parsedFlashCards[key].answer,
                        label: parsedFlashCards[key].label,
                        flashDeckPublicId: Number(pId)
                    }
                });
                newFlashcards.push(newFlashCard);
            }

        }
        res.status(200).send(newFlashcards);
       
    }
    else {
        res.status(400).send("Not allowed");
    }

}

    else {
        res.status(400).send("Not a valid method");
    }
}