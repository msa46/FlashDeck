import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { FlashCard } from "../../src/types/flashCard";

const prisma = new PrismaClient();

export default async (req: VercelRequest, res: VercelResponse) => {
  if(req.method === 'POST') {
    const { pid, flashCards, signedSecret } = req.body;
    if ((pid === undefined) || (flashCards === undefined) || (signedSecret === undefined)) {
        res.status(400).send("Missing required parameters");
    }
    const flashDeck = await prisma.flashDeck.findFirst({
        where: {
            pId: pid
        }
    })
    if (flashDeck === null) {
        await prisma.flashDeck.create({
            data: {
                pId: pid,
                signedSecret: signedSecret,
            }
        });
        const parsedFlashCards: FlashCard[] = Object.values(flashCards);

        const newFlashCards: FlashCard[] = []
        for (const flashCard of parsedFlashCards) {
            const newFlashCard = await prisma.flashCard.create({
                data: {
                    question: flashCard.question,
                    answer: flashCard.answer,
                    label: flashCard.label,
                    flashDeckPublicId: pid
                }
            });
            newFlashCards.push(newFlashCard);
            
        }
        res.status(200).send(newFlashCards)   
    }
    else{
        res.status(400).send("flashDeck already exists");
    }
  }
  else{
    res.status(400).send("Not a valid method");
  }
};