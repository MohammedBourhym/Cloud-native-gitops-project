package com.command.buddy.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@Configuration
@PropertySources({
    @PropertySource(value = "file:.env", ignoreResourceNotFound = true)
})
public class EnvConfig {
    // This class loads the .env file if present
}
