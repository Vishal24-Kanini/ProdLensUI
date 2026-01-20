import json
import re
from typing import Any, Dict, List, Optional
from config import settings

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

class AIAnalyzer:
    """AI-powered analysis using OpenAI"""

    def __init__(self):
        self.client = None
        if OPENAI_AVAILABLE and settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL

    def is_available(self) -> bool:
        """Check if OpenAI is available"""
        return self.client is not None

    async def analyze_with_ai(
        self,
        app_config: Dict[str, Any],
        analysis_type: str
    ) -> Optional[str]:
        """
        Analyze app using OpenAI
        
        Args:
            app_config: Application configuration
            analysis_type: Type of analysis (risks, recommendations, testStrategy)
        """
        if not self.is_available():
            return None

        try:
            prompt = self._build_prompt(app_config, analysis_type)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert DevOps and software architecture specialist. Analyze the provided application configuration and provide structured insights in JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.OPENAI_TEMPERATURE,
                max_tokens=2000,
            )

            return response.choices[0].message.content
        except Exception as e:
            print(f"AI Analysis error: {str(e)}")
            return None

    def _build_prompt(self, app_config: Dict[str, Any], analysis_type: str) -> str:
        """Build prompt for AI analysis"""
        app_summary = json.dumps(app_config, indent=2)[:1000]  # Limit to first 1000 chars

        if analysis_type == "risks":
            return f"""
Analyze the following application configuration and identify production readiness risks:

Application Config:
{app_summary}

Provide a JSON response with the following structure:
{{
  "risks": [
    {{
      "category": "string",
      "severity": "Critical|High|Medium|Low",
      "title": "string",
      "description": "string",
      "impact": "string",
      "mitigation": "string"
    }}
  ]
}}

Focus on: security vulnerabilities, scalability issues, performance bottlenecks, and testing gaps.
Return ONLY valid JSON, no markdown or extra text.
"""

        elif analysis_type == "recommendations":
            return f"""
Analyze the following application configuration and provide improvement recommendations:

Application Config:
{app_summary}

Provide a JSON response with the following structure:
{{
  "recommendations": [
    {{
      "priority": "Critical|High|Medium|Low",
      "category": "string",
      "action": "string",
      "rationale": "string",
      "estimatedEffort": "string"
    }}
  ]
}}

Return ONLY valid JSON, no markdown or extra text.
"""

        elif analysis_type == "testStrategy":
            return f"""
Based on the application configuration, suggest testing strategies:

Application Config:
{app_summary}

Provide a JSON response with the following structure:
{{
  "suggestions": [
    {{
      "type": "API|UI|Automation|Load|Security",
      "title": "string",
      "description": "string",
      "priority": "High|Medium|Low",
      "estimatedDuration": "string"
    }}
  ]
}}

Return ONLY valid JSON, no markdown or extra text.
"""

        return ""

    @staticmethod
    def parse_json_response(response: str) -> Dict[str, Any]:
        """
        Parse JSON response from AI
        
        Args:
            response: Response string from OpenAI
            
        Returns:
            Parsed JSON dict
        """
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                return json.loads(json_str)
        except Exception:
            pass

        return {}

    @staticmethod
    def generate_test_suggestions_default() -> List[Dict[str, Any]]:
        """Generate default test suggestions when AI is unavailable"""
        return [
            {
                "type": "API",
                "title": "API Integration Tests",
                "description": "Test all external API calls and integrations",
                "priority": "High",
                "estimatedDuration": "2-3 days"
            },
            {
                "type": "UI",
                "title": "User Interface Testing",
                "description": "Comprehensive UI testing across components",
                "priority": "High",
                "estimatedDuration": "3-4 days"
            },
            {
                "type": "Load",
                "title": "Load Testing",
                "description": "Performance testing under expected peak load",
                "priority": "High",
                "estimatedDuration": "2 days"
            },
            {
                "type": "Security",
                "title": "Security Assessment",
                "description": "Security scanning for vulnerabilities",
                "priority": "Critical",
                "estimatedDuration": "3-5 days"
            },
            {
                "type": "Automation",
                "title": "Test Automation",
                "description": "Set up CI/CD with automated testing",
                "priority": "Medium",
                "estimatedDuration": "4-5 days"
            }
        ]

    @staticmethod
    def generate_scale_analysis_default() -> Dict[str, Any]:
        """Generate default scale analysis when AI is unavailable"""
        return {
            "title": "Production Scale Analysis",
            "breakingPoints": [
                "Database query performance may degrade with >100k records",
                "Cache layer needed for API calls exceeding 1000/min",
                "Load balancing required for >50 concurrent users",
                "Authentication throughput bottleneck at >500 requests/min"
            ],
            "recommendations": [
                "Implement database query optimization and indexing strategy",
                "Add caching layer (Redis) for frequently accessed data",
                "Use CDN for static assets",
                "Implement auto-scaling policies",
                "Set up monitoring and alerting"
            ],
            "readinessLevel": "Partially Ready"
        }
