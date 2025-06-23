package com.command.buddy.service;

import com.command.buddy.client.GroqClient;
import com.command.buddy.model.Command;
import org.springframework.stereotype.Service;

/**
 * Service for handling quiz-related operations
 */
@Service
public class QuizService {

    private final GroqClient groqClient;
    private final CommandService commandService;

    public QuizService(GroqClient groqClient, CommandService commandService) {
        this.groqClient = groqClient;
        this.commandService = commandService;
    }

    /**
     * Generate a quiz question for a specific tool
     *
     * @param toolName the name of the tool
     * @return a quiz question about using the tool
     */
    public String generateQuestion(String toolName) {
        return groqClient.generateCommandQuestion(toolName);
    }

    /**
     * Evaluate a user's answer to a quiz question
     *
     * @param toolName the name of the tool
     * @param question the quiz question
     * @param userAnswer the user's command answer
     * @return evaluation feedback
     */
    public String evaluateAnswer(String toolName, String question, String userAnswer) {
        return groqClient.evaluateCommandAnswer(toolName, question, userAnswer);
    }

    /**
     * Get an explanation for a command
     *
     * @param toolName the name of the tool
     * @param command the command to explain
     * @return detailed explanation of the command
     */
    public String getCommandExplanation(String toolName, String command) {
        return groqClient.explainCommand(toolName, command);
    }

    /**
     * Save a command to the database
     *
     * @param toolName the name of the tool
     * @param commandText the command text
     * @param explanation the command explanation
     * @return the saved command
     */
    public Command saveCommand(String toolName, String commandText, String explanation) {
        Command command = new Command(toolName, commandText, explanation);
        return commandService.saveCommand(command);
    }
}
