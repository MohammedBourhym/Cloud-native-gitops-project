package com.command.buddy.service;

import com.command.buddy.model.Command;
import com.command.buddy.repository.CommandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class that provides business logic for Command operations
 */
@Service
public class CommandService {

    private final CommandRepository commandRepository;
    
    @Autowired
    public CommandService(CommandRepository commandRepository) {
        this.commandRepository = commandRepository;
    }
    
    /**
     * Save a command to the database
     *
     * @param command the command to save
     * @return the saved command with its generated ID
     */
    public Command saveCommand(Command command) {
        return commandRepository.save(command);
    }
    
    /**
     * Find all commands for a specific tool
     *
     * @param toolName the name of the tool
     * @return list of commands for the specified tool
     */
    public List<Command> findCommandsByToolName(String toolName) {
        return commandRepository.findByToolName(toolName);
    }
    
    /**
     * Find commands by tool name and containing specific text
     *
     * @param toolName the name of the tool
     * @param searchText the text to search for in the command
     * @return list of matching commands
     */
    public List<Command> searchCommandsByToolAndText(String toolName, String searchText) {
        return commandRepository.findByToolNameAndCommandTextContainingIgnoreCase(toolName, searchText);
    }
    
    /**
     * Get count of commands for a specific tool
     *
     * @param toolName the name of the tool
     * @return the count of commands
     */
    public long getCommandCountByTool(String toolName) {
        return commandRepository.countByToolName(toolName);
    }
}