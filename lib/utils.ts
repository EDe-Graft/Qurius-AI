let conversationHistory : Array<Object> = [];

interface Message {
    text : string,
    isUser : boolean
}

export function getConversationHistory() {
    return conversationHistory;
}

export function addUserQuery(userQuery: Message) {
    conversationHistory.push(userQuery)
}

export function addAIResponse(AIResponse: Message) {
    conversationHistory.push(addAIResponse)
}