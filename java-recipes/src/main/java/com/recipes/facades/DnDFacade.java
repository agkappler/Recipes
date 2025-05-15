package com.recipes.facades;

public class DnDFacade {
//	public String chat(List<ChatMessage> messages) throws Exception {
//        Map<String, Object> payload = new HashMap<>();
//        payload.put("model", "gpt-3.5-turbo");
//        payload.put("messages", messages);
//
//        String json = mapper.writeValueAsString(payload);
//
//        String response = Request.post("https://api.openai.com/v1/chat/completions")
//                .addHeader("Authorization", "Bearer " + openaiApiKey)
//                .addHeader("Content-Type", "application/json")
//                .bodyString(json, ContentType.APPLICATION_JSON)
//                .execute()
//                .returnContent()
//                .asString();
//
//        // Parse response (naively get first message)
//        Map<?, ?> parsed = mapper.readValue(response, Map.class);
//        List<?> choices = (List<?>) parsed.get("choices");
//        Map<?, ?> message = (Map<?, ?>) ((Map<?, ?>) choices.get(0)).get("message");
//        return (String) message.get("content");
//    }
}
