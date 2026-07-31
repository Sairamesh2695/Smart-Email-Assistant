package com.email.reply;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiAPIUrl;
    @Value("${gemini.api.key}")
    private String geminiAPIKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmail(Email email) throws Exception {
        //We need to build the prompt
        String prompt = buildPrompt(email);
        //and from gemini craft a request
        Map<String, Object> requestBody= Map.of(
                "contents", new Object[] {
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text",prompt)
                                }
                        )
                }
        );
        // do req and get it
        String response = webClient.post()
                .uri(geminiAPIUrl+geminiAPIKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        //extract response and return content in response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String buildPrompt(Email email) throws Exception {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a email reply for the following content. Please do not generate subject line.");
        if(email.getTone() != null && !email.getTone().isEmpty()){
            prompt.append("Use a ").append(email.getTone()).append(" tone.");
        }else{
            prompt.append("Use a professional tone");
        }
        if(email.getContent() != null && !email.getContent().isEmpty()){
            prompt.append("\n Original email: \n").append(email.getContent());
        }else{
            throw new Exception("Please provide with a body");
        }
        return prompt.toString();
    }
}
