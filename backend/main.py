import asyncio
from datetime import datetime
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    AnalysisRequestModel,
    AnalysisResultModel,
    APIResponseModel,
    CategoryScoreModel,
    RiskModel,
    TestSuggestionModel,
    ScaleAnalysisModel,
    RecommendationModel,
)
from analysis_engine import RuleBasedAnalyzer
from ai_analyzer import AIAnalyzer
from config import settings

# Initialize FastAPI
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Analyzer
ai_analyzer = AIAnalyzer()

# In-memory storage for analysis results (for demo/MVP)
analysis_cache: Dict[str, AnalysisResultModel] = {}
analysis_counter = 0


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return APIResponseModel(
        success=True,
        message="ProdLens AI API is running",
        data={
            "status": "healthy",
            "ai_available": ai_analyzer.is_available(),
            "timestamp": datetime.now().isoformat()
        }
    )


@app.post("/api/analyze", response_model=APIResponseModel, tags=["Analysis"])
async def analyze_app(request: AnalysisRequestModel):
    """
    Analyze application configuration
    
    Args:
        request: Analysis request with app config
        
    Returns:
        Analysis result with scores and recommendations
    """
    try:
        app_config = request.appConfig.dict()
        app_name = request.appName or "Untitled App"

        # Run analysis
        result = await perform_analysis(app_config, app_name)

        return APIResponseModel(
            success=True,
            message="Analysis completed successfully",
            data=result.dict()
        )

    except Exception as e:
        return APIResponseModel(
            success=False,
            error=str(e)
        )


@app.get("/api/sample-analysis", response_model=APIResponseModel, tags=["Analysis"])
async def get_sample_analysis():
    """
    Get a sample analysis for demo purposes
    
    Returns:
        Sample analysis result
    """
    try:
        sample_config = {
            "name": "E-Commerce Dashboard",
            "description": "AI-generated e-commerce dashboard application",
            "blocks": {
                "layout": {"type": "grid", "columns": 12},
                "components": [
                    {"id": "header", "type": "header"},
                    {"id": "sidebar", "type": "sidebar"},
                    {"id": "main", "type": "container"},
                    {"id": "dashboard", "type": "dashboard"},
                    {"id": "reports", "type": "reports"},
                ]
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-query": "^3.39.0",
                "lodash": "^4.17.21",
                "moment": "^2.29.4",
                "axios": "^1.4.0",
                "jest": "^29.0.0",
            },
            "metadata": {
                "createdAt": datetime.now().isoformat(),
                "version": "1.0.0",
                "author": "AI",
                "tags": ["dashboard", "ecommerce"],
                "complexity": "medium",
                "estimatedUsers": 5000,
            }
        }

        result = await perform_analysis(sample_config, "E-Commerce Dashboard (Sample)")

        return APIResponseModel(
            success=True,
            message="Sample analysis generated",
            data=result.dict()
        )

    except Exception as e:
        return APIResponseModel(
            success=False,
            error=str(e)
        )


@app.get("/api/status/{analysis_id}", tags=["Analysis"])
async def get_analysis_status(analysis_id: str):
    """
    Get status of an analysis
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        Analysis status
    """
    if analysis_id in analysis_cache:
        return APIResponseModel(
            success=True,
            data={
                "status": "completed",
                "progress": 100,
                "timestamp": datetime.now().isoformat()
            }
        )

    return APIResponseModel(
        success=False,
        error="Analysis not found"
    )


async def perform_analysis(app_config: Dict[str, Any], app_name: str) -> AnalysisResultModel:
    """
    Perform complete analysis on app configuration
    
    Args:
        app_config: Application configuration
        app_name: Application name
        
    Returns:
        Complete analysis result
    """

    # Run rule-based analysis
    scalability = RuleBasedAnalyzer.analyze_scalability(app_config)
    security = RuleBasedAnalyzer.analyze_security(app_config)
    testability = RuleBasedAnalyzer.analyze_testability(app_config)
    maintainability = RuleBasedAnalyzer.analyze_maintainability(app_config)
    performance = RuleBasedAnalyzer.analyze_performance(app_config)

    # Calculate overall score
    weights = settings.SCORING_WEIGHTS
    overall_score = int(
        scalability.score * weights["scalability"] +
        security.score * weights["security"] +
        testability.score * weights["testability"] +
        maintainability.score * weights["maintainability"] +
        performance.score * weights["performance"]
    )

    # Get rule-based risks and insights
    risks = RuleBasedAnalyzer.generate_risks(app_config)
    insights = RuleBasedAnalyzer.generate_insights(app_config)

    # Get test suggestions (try AI first, fallback to default)
    test_suggestions = []
    if ai_analyzer.is_available():
        ai_response = await ai_analyzer.analyze_with_ai(app_config, "testStrategy")
        if ai_response:
            parsed = AIAnalyzer.parse_json_response(ai_response)
            if "suggestions" in parsed:
                for sugg in parsed["suggestions"][:5]:
                    test_suggestions.append(TestSuggestionModel(**sugg))

    if not test_suggestions:
        for sugg in AIAnalyzer.generate_test_suggestions_default()[:5]:
            test_suggestions.append(TestSuggestionModel(**sugg))

    # Get scale analysis
    scale_analysis_dict = AIAnalyzer.generate_scale_analysis_default()
    scale_analysis = ScaleAnalysisModel(**scale_analysis_dict)

    # Generate recommendations (try AI first, fallback to rule-based)
    recommendations = []
    if ai_analyzer.is_available():
        ai_response = await ai_analyzer.analyze_with_ai(app_config, "recommendations")
        if ai_response:
            parsed = AIAnalyzer.parse_json_response(ai_response)
            if "recommendations" in parsed:
                for rec in parsed["recommendations"][:6]:
                    recommendations.append(RecommendationModel(**rec))

    if not recommendations:
        recommendations = [
            RecommendationModel(
                priority="High",
                category="Security",
                action="Implement Authentication",
                rationale="Critical security requirement",
                estimatedEffort="3-5 days"
            ),
            RecommendationModel(
                priority="High",
                category="Performance",
                action="Add Caching Layer",
                rationale="Improves response times under load",
                estimatedEffort="2-3 days"
            ),
            RecommendationModel(
                priority="Medium",
                category="Testing",
                action="Setup Test Framework",
                rationale="Ensures code quality",
                estimatedEffort="2 days"
            ),
            RecommendationModel(
                priority="Medium",
                category="Architecture",
                action="Refactor to Microservices",
                rationale="Better scalability and maintainability",
                estimatedEffort="2-3 weeks"
            ),
        ]

    # Create result
    result = AnalysisResultModel(
        appName=app_name,
        timestamp=datetime.now().isoformat(),
        overallScore=overall_score,
        categories={
            "scalability": scalability,
            "security": security,
            "testability": testability,
            "maintainability": maintainability,
            "performance": performance,
        },
        risks=risks,
        insights=insights,
        testSuggestions=test_suggestions,
        scaleAnalysis=scale_analysis,
        recommendations=recommendations,
    )

    return result


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "ProdLens AI API",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
