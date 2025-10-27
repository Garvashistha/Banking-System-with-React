package service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateMessage?key=";

    public String getResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_URL + geminiApiKey;

        // Corrected request body for Gemini generateMessage
        Map<String, Object> requestBody = Map.of(
    "prompt", Map.of("text", userMessage),  // single object, not a list
    "temperature", 0.7,
    "candidateCount", 1
);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("candidates")) {
                // Get the first candidate
                Map candidate = (Map) ((java.util.List) response.get("candidates")).get(0);
                // Each candidate's "content" is now under "output.content"
                java.util.List outputs = (java.util.List) candidate.get("output");
                if (outputs != null && !outputs.isEmpty()) {
                    Map firstOutput = (Map) outputs.get(0);
                    return (String) firstOutput.get("content");
                }
            }
            return "No response from Gemini API.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error connecting to Gemini API: " + e.getMessage();
        }
    }
}
