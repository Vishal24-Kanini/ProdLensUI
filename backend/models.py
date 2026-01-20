from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Request Models
class AppConfigModel(BaseModel):
    """App configuration model"""
    name: str
    description: Optional[str] = None
    blocks: Optional[Dict[str, Any]] = None
    dependencies: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, Any]] = None

class AnalysisRequestModel(BaseModel):
    """Analysis request model"""
    appConfig: AppConfigModel
    appName: str

# Response Models
class CategoryScoreModel(BaseModel):
    """Category score response"""
    score: int = Field(ge=0, le=100)
    level: str = Field(description="Critical, High, Medium, Low, or Excellent")
    issues: List[str]
    suggestions: List[str]

class RiskModel(BaseModel):
    """Risk model"""
    category: str
    severity: str
    title: str
    description: str
    impact: str
    mitigation: str

class InsightModel(BaseModel):
    """Insight model"""
    category: str
    title: str
    description: str
    actionable: bool

class TestSuggestionModel(BaseModel):
    """Test suggestion model"""
    type: str = Field(description="API, UI, Automation, Load, or Security")
    title: str
    description: str
    priority: str = Field(description="High, Medium, or Low")
    estimatedDuration: str

class ScaleAnalysisModel(BaseModel):
    """Scale analysis model"""
    title: str
    breakingPoints: List[str]
    recommendations: List[str]
    readinessLevel: str = Field(description="Ready, Partially Ready, or Not Ready")

class RecommendationModel(BaseModel):
    """Recommendation model"""
    priority: str = Field(description="Critical, High, Medium, or Low")
    category: str
    action: str
    rationale: str
    estimatedEffort: str

class AnalysisResultModel(BaseModel):
    """Analysis result model"""
    appName: str
    timestamp: str
    overallScore: int = Field(ge=0, le=100)
    categories: Dict[str, CategoryScoreModel]
    risks: List[RiskModel]
    insights: List[InsightModel]
    testSuggestions: List[TestSuggestionModel]
    scaleAnalysis: ScaleAnalysisModel
    recommendations: List[RecommendationModel]

class APIResponseModel(BaseModel):
    """Generic API response model"""
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    message: Optional[str] = None
