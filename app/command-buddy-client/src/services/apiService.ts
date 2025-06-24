/**
 * API service for interacting with the Command Buddy backend
 */

// Base API URL - configured to use Vite's proxy
const API_BASE_URL = '/api';

// Available tools for command quizzes
export const AVAILABLE_TOOLS = [
  'git',
  'docker',
  'kubernetes',
  'bash',
  'npm',
  'yarn',
  'mvn',
  'gradle',
  'terraform',
  'aws',
  'gcloud'
];

// API Service
export const apiService = {
  /**
   * Generate a quiz question for a specific tool
   * 
   * @param toolName The name of the tool (e.g., git, docker)
   * @returns Promise with question data
   */
  async getQuizQuestion(toolName: string): Promise<{ question: string; toolName: string }> {
    try {
      console.log(`Fetching quiz question for ${toolName}`);
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_BASE_URL}/quiz/${toolName}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error ${response.status}: ${response.statusText}`);
        throw new Error(`Failed to fetch quiz question: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received quiz question:', data);
      return data;
    } catch (error) {
      console.error('Error fetching quiz question:', error);
      throw error;
    }
  },

  /**
   * Check if a command answer is correct
   * 
   * @param toolName The name of the tool
   * @param question The quiz question
   * @param answer The user's answer
   * @returns Promise with feedback data
   */
  async checkAnswer(toolName: string, question: string, answer: string): Promise<{ feedback: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toolName, question, answer })
      });
      
      if (!response.ok) {
        throw new Error('Failed to check answer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking answer:', error);
      throw error;
    }
  },

  /**
   * Get an explanation for a command
   * 
   * @param toolName The name of the tool
   * @param command The command to explain
   * @returns Promise with explanation data
   */
  async explainCommand(toolName: string, command: string): Promise<{ explanation: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toolName, command })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get command explanation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting explanation:', error);
      throw error;
    }
  },

  /**
   * Save a command for later reference
   * 
   * @param toolName The name of the tool
   * @param command The command text
   * @param explanation The command explanation
   * @returns Promise with the saved command
   */
  async saveCommand(toolName: string, command: string, explanation: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toolName, command, explanation })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save command');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving command:', error);
      throw error;
    }
  },

  /**
   * Get all saved commands for a specific tool
   * 
   * @param toolName The name of the tool
   * @returns Promise with list of commands
   */
  async getSavedCommands(toolName: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/commands/${toolName}`);
      if (!response.ok) {
        if (response.status === 204) {
          return []; // No content
        }
        throw new Error('Failed to fetch saved commands');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching saved commands:', error);
      throw error;
    }
  }
};
