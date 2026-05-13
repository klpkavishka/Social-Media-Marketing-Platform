#!/usr/bin/env python3
"""
OpenRouter API Chat Model
Interactive chat interface using the OpenRouter API
"""

import requests
import json
from datetime import datetime

# API Configuration
API_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = "openai/gpt-3.5-turbo"

class OpenRouterChat:
    def __init__(self, model=DEFAULT_MODEL, temperature=0.7, max_tokens=2000):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.messages = []
        self.headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        }
        self.total_tokens = {"prompt": 0, "completion": 0}
    
    def send_message(self, user_input):
        """Send a message and get a response from the model"""
        
        # Add user message to history
        self.messages.append({"role": "user", "content": user_input})
        
        payload = {
            "model": self.model,
            "messages": self.messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "choices" in data and len(data["choices"]) > 0:
                    assistant_message = data["choices"][0].get("message", {}).get("content", "")
                    
                    # Add assistant response to history
                    self.messages.append({"role": "assistant", "content": assistant_message})
                    
                    # Track tokens
                    if "usage" in data:
                        self.total_tokens["prompt"] += data["usage"].get("prompt_tokens", 0)
                        self.total_tokens["completion"] += data["usage"].get("completion_tokens", 0)
                    
                    return {
                        "success": True,
                        "message": assistant_message,
                        "tokens": {
                            "prompt": data.get("usage", {}).get("prompt_tokens", 0),
                            "completion": data.get("usage", {}).get("completion_tokens", 0),
                        }
                    }
            elif response.status_code == 401:
                return {"success": False, "error": "Authentication failed - Invalid API key"}
            else:
                return {"success": False, "error": f"API Error {response.status_code}: {response.text}"}
                
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Request timed out"}
        except Exception as e:
            return {"success": False, "error": f"{type(e).__name__}: {e}"}
    
    def clear_history(self):
        """Clear conversation history"""
        self.messages = []
    
    def set_model(self, model):
        """Change the model"""
        self.model = model
    
    def print_stats(self):
        """Print conversation statistics"""
        print(f"\n📊 Conversation Stats:")
        print(f"   Model: {self.model}")
        print(f"   Total messages: {len([m for m in self.messages if m['role'] == 'user'])}")
        print(f"   Total tokens used - Prompt: {self.total_tokens['prompt']}, Completion: {self.total_tokens['completion']}")
        total = self.total_tokens['prompt'] + self.total_tokens['completion']
        print(f"   Total combined tokens: {total}\n")

def main():
    """Main chat loop"""
    
    print("=" * 70)
    print("🤖 OpenRouter API Chat Model")
    print("=" * 70)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Model: {DEFAULT_MODEL}")
    print("\nCommands:")
    print("  'quit' or 'exit' - Exit the chat")
    print("  'clear' - Clear conversation history")
    print("  'stats' - Show conversation statistics")
    print("  'model <name>' - Change model (e.g., 'model openai/gpt-4')")
    print("-" * 70)
    print()
    
    chat = OpenRouterChat()
    
    try:
        while True:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            # Handle commands
            if user_input.lower() == "quit" or user_input.lower() == "exit":
                print("\n👋 Goodbye!")
                break
            
            if user_input.lower() == "clear":
                chat.clear_history()
                print("✓ Conversation history cleared\n")
                continue
            
            if user_input.lower() == "stats":
                chat.print_stats()
                continue
            
            if user_input.lower().startswith("model "):
                new_model = user_input[6:].strip()
                chat.set_model(new_model)
                print(f"✓ Model changed to: {new_model}\n")
                continue
            
            # Send message to API
            print("Thinking...", end="", flush=True)
            result = chat.send_message(user_input)
            print("\r" + " " * 20 + "\r", end="", flush=True)  # Clear "Thinking..."
            
            if result["success"]:
                print(f"\n🤖 Assistant: {result['message']}")
                tokens = result.get("tokens", {})
                print(f"   [Tokens: prompt={tokens.get('prompt', 0)}, completion={tokens.get('completion', 0)}]")
            else:
                print(f"\n❌ Error: {result.get('error', 'Unknown error')}")
            
            print()
    
    except KeyboardInterrupt:
        print("\n\n👋 Chat interrupted. Goodbye!")

if __name__ == "__main__":
    main()
