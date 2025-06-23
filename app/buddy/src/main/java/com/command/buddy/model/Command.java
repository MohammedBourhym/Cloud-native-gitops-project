package com.command.buddy.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Represents a command in the system, stored as a MongoDB document.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "commands")
public class Command {
    
    @Id
    private String id;
    
    private String toolName;
    private String commandText;
    private String explanation;
    
    // Constructor with fields (excluding id which is auto-generated)
    public Command(String toolName, String commandText, String explanation) {
        this.toolName = toolName;
        this.commandText = commandText;
        this.explanation = explanation;
    }
}