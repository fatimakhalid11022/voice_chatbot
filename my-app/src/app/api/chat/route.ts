import {type CoreMessage,streamText} from "ai"
import { mistral } from "@ai-sdk/mistral"

export const maxDuration = 30; 

export async function POST(req: Request) {
    const {messages}: {messages:CoreMessage[]} = await req.json();

    const result = await streamText({
        model: mistral("open-mistral-7b"),
        system:"You are a helpful assistant",
        messages,

    })
    return result.toAIStreamResponse()
}