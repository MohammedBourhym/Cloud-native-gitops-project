package com.command.buddy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("file:.env")
public class ApiConfig {

    @Value("${GROQ_API_KEY}")
    private String groqApiKey;
    
    @Value("${GROQ_API_URL}")
    private String groqApiUrl;
    
    public String getGroqApiKey() {
        return groqApiKey;
    }
    
    public String getGroqApiUrl() {
        return groqApiUrl;
    }
}