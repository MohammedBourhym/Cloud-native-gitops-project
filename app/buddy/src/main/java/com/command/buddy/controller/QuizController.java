package com.command.buddy.controller;

import com.command.buddy.model.Command;
import com.command.buddy.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for quiz functionality
 */
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    /**
     * Generate a quiz question for a specific tool
     *
     * @param toolName the name of the tool
     * @return a quiz question
     */
    @GetMapping("/{toolName}")
    public ResponseEntity<Map<String, String>> getQuizQuestion(@PathVariable String toolName) {
        String question = quizService.generateQuestion(toolName);
        
        Map<String, String> response = new HashMap<>();
        response.put("question", question);
        response.put("toolName", toolName);
        
        return ResponseEntity
            .ok()
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .header("Pragma", "no-cache")
            .header("Expires", "0")
            .body(response);
    }

    /**
     * Check if a command answer is correct
     *
     * @param params Map containing the question, answer, and toolName
     * @return feedback on the answer
     */
    @PostMapping("/check")
    public ResponseEntity<Map<String, String>> checkAnswer(@RequestBody Map<String, String> params) {
        String question = params.get("question");
        String answer = params.get("answer");
        String toolName = params.get("toolName");
        
        if (question == null || answer == null || toolName == null) {
            return ResponseEntity.badRequest().build();
        }
        
        String feedback = quizService.evaluateAnswer(toolName, question, answer);
        
        Map<String, String> response = new HashMap<>();
        response.put("feedback", feedback);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get an explanation for a command
     *
     * @param params Map containing the command and toolName
     * @return explanation of the command
     */
    @PostMapping("/explain")
    public ResponseEntity<Map<String, String>> explainCommand(@RequestBody Map<String, String> params) {
        String command = params.get("command");
        String toolName = params.get("toolName");
        
        if (command == null || toolName == null) {
            return ResponseEntity.badRequest().build();
        }
        
        String explanation = quizService.getCommandExplanation(toolName, command);
        
        Map<String, String> response = new HashMap<>();
        response.put("explanation", explanation);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Save a command after quiz
     *
     * @param params Map containing the command, toolName, and explanation
     * @return the saved command
     */
    @PostMapping("/save")
    public ResponseEntity<Command> saveCommand(@RequestBody Map<String, String> params) {
        String command = params.get("command");
        String toolName = params.get("toolName");
        String explanation = params.get("explanation");
        
        if (command == null || toolName == null || explanation == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Command savedCommand = quizService.saveCommand(toolName, command, explanation);
        return ResponseEntity.ok(savedCommand);
    }
}
