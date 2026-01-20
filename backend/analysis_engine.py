import json
from typing import Any, Dict, List
from datetime import datetime
from models import (
    CategoryScoreModel,
    RiskModel,
    InsightModel,
    TestSuggestionModel,
    ScaleAnalysisModel,
    RecommendationModel,
    AnalysisResultModel,
)

class RuleBasedAnalyzer:
    """Rule-based analysis engine for scoring categories"""

    @staticmethod
    def analyze_scalability(app_config: Dict[str, Any]) -> CategoryScoreModel:
        """Analyze scalability aspects"""
        score = 75
        issues = []
        suggestions = []

        # Check for async patterns
        dependencies = app_config.get("dependencies", {})
        if "async" not in str(dependencies).lower() and "queue" not in str(dependencies).lower():
            score -= 15
            issues.append("No async/queue libraries detected")
            suggestions.append("Consider implementing async patterns for long-running operations")

        # Check for caching
        if "redis" not in str(dependencies).lower() and "cache" not in str(dependencies).lower():
            score -= 10
            issues.append("No caching mechanism detected")
            suggestions.append("Implement caching layer for improved performance at scale")

        # Check metadata for expected users
        metadata = app_config.get("metadata", {})
        expected_users = metadata.get("estimatedUsers", 0)
        if expected_users > 10000:
            score -= 20
            issues.append("Application targets high user count without scalability patterns")
            suggestions.append("Implement load balancing and horizontal scaling strategies")

        return CategoryScoreModel(
            score=max(0, min(100, score)),
            level=RuleBasedAnalyzer._get_level(score),
            issues=issues,
            suggestions=suggestions[:2]
        )

    @staticmethod
    def analyze_security(app_config: Dict[str, Any]) -> CategoryScoreModel:
        """Analyze security aspects"""
        score = 70
        issues = []
        suggestions = []

        # Check for authentication
        metadata = app_config.get("metadata", {})
        if "auth" not in str(app_config).lower():
            score -= 25
            issues.append("No authentication mechanism detected")
            suggestions.append("Implement OAuth 2.0 or JWT-based authentication")

        # Check for secrets management
        if any(keyword in str(app_config).lower() for keyword in ["secret", "api_key", "password"]):
            score -= 15
            issues.append("Potential secrets in configuration")
            suggestions.append("Use environment variables for sensitive data")

        # Check dependencies for known vulnerabilities
        dependencies = app_config.get("dependencies", {})
        if len(dependencies) == 0:
            score -= 5
            issues.append("No dependencies listed")

        return CategoryScoreModel(
            score=max(0, min(100, score)),
            level=RuleBasedAnalyzer._get_level(score),
            issues=issues,
            suggestions=suggestions[:2]
        )

    @staticmethod
    def analyze_testability(app_config: Dict[str, Any]) -> CategoryScoreModel:
        """Analyze testability aspects"""
        score = 72
        issues = []
        suggestions = []

        # Check for test frameworks
        dependencies = app_config.get("dependencies", {})
        test_frameworks = ["jest", "pytest", "mocha", "jasmine"]
        has_test_framework = any(fw in str(dependencies).lower() for fw in test_frameworks)

        if not has_test_framework:
            score -= 20
            issues.append("No testing framework detected")
            suggestions.append("Add Jest, Pytest, or similar testing framework")

        # Check API availability
        metadata = app_config.get("metadata", {})
        complexity = metadata.get("complexity", "medium")
        if complexity == "high":
            score -= 10
            issues.append("High complexity may reduce testability")
            suggestions.append("Break down components for improved test coverage")

        # Check for test IDs
        blocks = app_config.get("blocks", {})
        if not blocks or len(str(blocks)) < 50:
            score -= 8
            issues.append("Minimal component structure for testing")

        return CategoryScoreModel(
            score=max(0, min(100, score)),
            level=RuleBasedAnalyzer._get_level(score),
            issues=issues,
            suggestions=suggestions[:2]
        )

    @staticmethod
    def analyze_maintainability(app_config: Dict[str, Any]) -> CategoryScoreModel:
        """Analyze maintainability aspects"""
        score = 75
        issues = []
        suggestions = []

        # Check for modular design
        blocks = app_config.get("blocks", {})
        components = blocks.get("components", [])

        if not components or len(components) < 3:
            score -= 15
            issues.append("Weak modular structure")
            suggestions.append("Break down into smaller, reusable components")

        # Check for documentation
        description = app_config.get("description", "")
        if not description or len(description) < 20:
            score -= 10
            issues.append("Insufficient documentation")
            suggestions.append("Add comprehensive documentation and comments")

        # Check for code reuse patterns
        dependencies = app_config.get("dependencies", {})
        if len(dependencies) < 3:
            score -= 5
            issues.append("Limited dependency usage")

        return CategoryScoreModel(
            score=max(0, min(100, score)),
            level=RuleBasedAnalyzer._get_level(score),
            issues=issues,
            suggestions=suggestions[:2]
        )

    @staticmethod
    def analyze_performance(app_config: Dict[str, Any]) -> CategoryScoreModel:
        """Analyze performance aspects"""
        score = 78
        issues = []
        suggestions = []

        # Check for optimization libraries
        dependencies = app_config.get("dependencies", {})
        optimization_libs = ["webpack", "rollup", "vite", "next"]
        has_optimization = any(lib in str(dependencies).lower() for lib in optimization_libs)

        if not has_optimization:
            score -= 15
            issues.append("No build optimization tools detected")
            suggestions.append("Use Webpack, Vite, or similar build optimizers")

        # Check API call patterns
        blocks = app_config.get("blocks", {})
        if "components" in str(blocks).lower() and len(blocks) > 100:
            score -= 10
            issues.append("High number of potential API calls")
            suggestions.append("Implement request batching and pagination")

        # Check for sync operations
        if "sync" in str(dependencies).lower():
            score -= 5
            issues.append("Potential synchronous operations detected")

        return CategoryScoreModel(
            score=max(0, min(100, score)),
            level=RuleBasedAnalyzer._get_level(score),
            issues=issues,
            suggestions=suggestions[:2]
        )

    @staticmethod
    def _get_level(score: int) -> str:
        """Get readiness level based on score"""
        if score >= 85:
            return "Excellent"
        elif score >= 70:
            return "Low"
        elif score >= 50:
            return "Medium"
        elif score >= 30:
            return "High"
        else:
            return "Critical"

    @staticmethod
    def generate_risks(app_config: Dict[str, Any]) -> List[RiskModel]:
        """Generate risk report"""
        risks = []

        # Scalability risks
        dependencies = app_config.get("dependencies", {})
        if "redis" not in str(dependencies).lower():
            risks.append(RiskModel(
                category="Scalability",
                severity="High",
                title="Missing Cache Layer",
                description="No caching mechanism found in dependencies",
                impact="Performance degradation under load",
                mitigation="Implement Redis or similar caching solution"
            ))

        # Security risks
        if "auth" not in str(app_config).lower():
            risks.append(RiskModel(
                category="Security",
                severity="Critical",
                title="No Authentication Detected",
                description="Application lacks authentication mechanism",
                impact="Unauthorized access to sensitive data",
                mitigation="Implement OAuth 2.0 or JWT authentication"
            ))

        # Performance risks
        metadata = app_config.get("metadata", {})
        expected_users = metadata.get("estimatedUsers", 0)
        if expected_users > 5000:
            risks.append(RiskModel(
                category="Performance",
                severity="High",
                title="Potential Performance Bottlenecks",
                description="Expected user count suggests high load",
                impact="Potential slowdowns during peak usage",
                mitigation="Implement performance optimization and load testing"
            ))

        # Testability risks
        if "jest" not in str(dependencies).lower() and "pytest" not in str(dependencies).lower():
            risks.append(RiskModel(
                category="Testability",
                severity="Medium",
                title="No Testing Framework",
                description="Testing framework not found in dependencies",
                impact="Difficulty ensuring code quality",
                mitigation="Add Jest, Pytest, or similar testing framework"
            ))

        return risks

    @staticmethod
    def generate_insights(app_config: Dict[str, Any]) -> List[InsightModel]:
        """Generate key insights"""
        insights = []

        insights.append(InsightModel(
            category="Architecture",
            title="Application Structure",
            description=f"App '{app_config.get('name', 'Untitled')}' uses block-based architecture with {len(app_config.get('blocks', {}).get('components', []))} components",
            actionable=True
        ))

        dependencies = app_config.get("dependencies", {})
        insights.append(InsightModel(
            category="Dependencies",
            title="Dependency Analysis",
            description=f"Application has {len(dependencies)} dependencies. {len([d for d in dependencies if 'dev' not in d])} are production dependencies.",
            actionable=False
        ))

        metadata = app_config.get("metadata", {})
        insights.append(InsightModel(
            category="Scale",
            title="Target Scale",
            description=f"Estimated for {metadata.get('estimatedUsers', 'unknown')} users",
            actionable=True
        ))

        return insights
