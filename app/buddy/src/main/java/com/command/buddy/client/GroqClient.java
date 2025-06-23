package com.command.buddy.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Client for interacting with Groq's LLM API
 */
@Component
public class GroqClient {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;
    
    private final RestTemplate restTemplate;
    
    public GroqClient() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Generate a command quiz question for a specific tool
     *
     * @param toolName the name of the tool (e.g., git, docker, kubernetes)
     * @return a quiz question about using the tool
     */
    public String generateCommandQuestion(String toolName) {
        String prompt = String.format(
            "You are a command line tutor helping users learn %s commands. " +
            "Generate a practical question that asks the user to provide a specific %s command. " +
            "Focus on common, useful operations. " +
            "Format your response as a clear, concise question only. " +
            "Do not provide the answer or any hints.",
            toolName, toolName
        );
        
        return callGroqApi(prompt, 0.7);
    }
    
    /**
     * Evaluate a user's command answer against a question
     *
     * @param toolName the name of the tool
     * @param question the quiz question that was asked
     * @param userAnswer the command provided by the user
     * @return evaluation of the answer with explanation
     */
    public String evaluateCommandAnswer(String toolName, String question, String userAnswer) {
        String prompt = String.format(
            "Question about %s: \"%s\"\n\n" +
            "User's answer: \"%s\"\n\n" +
            "Evaluate if this command correctly solves the task. Respond with:\n" +
            "1. Whether the answer is CORRECT or INCORRECT\n" +
            "2. A brief explanation of why\n" +
            "3. If incorrect, the proper command\n" +
            "4. A tip for remembering this command",
            toolName, question, userAnswer
        );
        
        return callGroqApi(prompt, 0.3);
    }
    
    /**
     * Generate an explanation for a command
     *
     * @param toolName the name of the tool
     * @param command the command to explain
     * @return detailed explanation of the command
     */
    public String explainCommand(String toolName, String command) {
        String prompt = String.format(
            "Explain the following %s command in detail:\n\n" +
            "%s\n\n" +
            "Include:\n" +
            "1. What this command does\n" +
            "2. Breakdown of each part/flag\n" +
            "3. Common use cases\n" +
            "4. Any potential gotchas or warnings\n" +
            "Format as a concise explanation.",
            toolName, command
        );
        
        return callGroqApi(prompt, 0.3);
    }
    
    /**
     * Call the Groq API with the given prompt
     *
     * @param prompt the prompt to send to the API
     * @param temperature the temperature parameter (0.0 to 1.0)
     * @return the response from the API
     */
    private String callGroqApi(String prompt, double temperature) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        
        requestBody.put("messages", messages);
        requestBody.put("temperature", temperature);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                apiUrl, 
                org.springframework.http.HttpMethod.POST,
                request, 
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, String> responseMessage = (Map<String, String>) firstChoice.get("message");
                    return responseMessage.get("content");
                }
            }
            return "Error: Unable to process response from Groq API.";
        } catch (Exception e) {
            return "Error calling Groq API: " + e.getMessage();
        }
    }
}
