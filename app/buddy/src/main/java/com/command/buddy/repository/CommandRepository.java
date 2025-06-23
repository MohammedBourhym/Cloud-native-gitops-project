package com.command.buddy.repository;

import com.command.buddy.model.Command;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Command entity operations with MongoDB
 */
@Repository
public interface CommandRepository extends MongoRepository<Command, String> {
    
    /**
     * Find all commands for a specific tool
     * 
     * @param toolName the name of the tool
     * @return list of commands for the specified tool
     */
    List<Command> findByToolName(String toolName);
    
    /**
     * Find all commands for a specific tool containing the given text (case insensitive)
     * 
     * @param toolName the name of the tool
     * @param text the text to search for in the command text
     * @return list of matching commands
     */
    List<Command> findByToolNameAndCommandTextContainingIgnoreCase(String toolName, String text);
    
    /**
     * Count the number of commands for a specific tool
     * 
     * @param toolName the name of the tool
     * @return the count of commands
     */
    long countByToolName(String toolName);
}