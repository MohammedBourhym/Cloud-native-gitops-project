package com.command.buddy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "file:.env", ignoreResourceNotFound = true)
public class ApiConfig {

    @Value("${GROQ_API_KEY:}")
    private String groqApiKey;
    
    @Value("${GROQ_API_URL:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;
    
    public String getGroqApiKey() {
        return groqApiKey;
    }
    
    public String getGroqApiUrl() {
        return groqApiUrl;
    }
}