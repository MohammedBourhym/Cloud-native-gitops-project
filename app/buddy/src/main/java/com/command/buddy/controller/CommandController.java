package com.command.buddy.controller;

import com.command.buddy.model.Command;
import com.command.buddy.service.CommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for handling Command operations
 */
@RestController
@RequestMapping("/commands")
public class CommandController {

    private final CommandService commandService;

    @Autowired
    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    /**
     * Create a new command
     *
     * @param command the command to save
     * @return the saved command with its generated ID
     */
    @PostMapping
    public ResponseEntity<Command> createCommand(@RequestBody Command command) {
        // Basic validation
        if (command.getToolName() == null || command.getToolName().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        if (command.getCommandText() == null || command.getCommandText().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        Command savedCommand = commandService.saveCommand(command);
        return new ResponseEntity<>(savedCommand, HttpStatus.CREATED);
    }

    /**
     * Get all commands for a specific tool
     *
     * @param toolName the name of the tool
     * @return list of commands for the specified tool
     */
    @GetMapping("/{toolName}")
    public ResponseEntity<List<Command>> getCommandsByTool(@PathVariable String toolName) {
        if (toolName == null || toolName.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        List<Command> commands = commandService.findCommandsByToolName(toolName);
        
        if (commands.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        
        return new ResponseEntity<>(commands, HttpStatus.OK);
    }
    
    /**
     * Search for commands by tool name and text
     *
     * @param toolName the name of the tool
     * @param searchText the text to search for
     * @return list of matching commands
     */
    @GetMapping("/{toolName}/search")
    public ResponseEntity<List<Command>> searchCommands(
            @PathVariable String toolName,
            @RequestParam String searchText) {
        
        if (toolName == null || toolName.trim().isEmpty() || 
            searchText == null || searchText.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        List<Command> commands = commandService.searchCommandsByToolAndText(toolName, searchText);
        
        if (commands.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        
        return new ResponseEntity<>(commands, HttpStatus.OK);
    }
}