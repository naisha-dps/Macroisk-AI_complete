from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import sys
import os

# Import the LangGraph Orchestrator
from langgraph_orchestrator import app_graph

# Import our Agents using their NEW names
from Agent_1.inflation_outlook_agent import MacroAgent
from Agent_2.corporate_analysis_agent import CompanyDataAgent
from Agent_3.scenario_resilience_agent import FinancialAgent
from MacroRiskAI_rag import RAGAgent

app = FastAPI(title="MacroRisk AI Platform API")

# Add CORS middleware to allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ForecastRequest(BaseModel):
    months_ahead: int = Field(
        default=3, 
        ge=1, 
        le=12, 
        description="Number of months to forecast the macro economy (1-12)"
    )

class CompanyForecastRequest(BaseModel):
    company_name: str = Field(description="Name of the company to analyze")
    months_ahead: int = Field(
        default=3, 
        ge=1, 
        le=12, 
        description="Months ahead to forecast macro environment to apply to the company"
    )

class ChatRequest(BaseModel):
    query: str
    context: Optional[dict] = Field(default=None, description="Optional LangGraph state context containing financials")

# Initialize agents globally to keep their models loaded in memory for fast execution
print("⚙️ Initializing Agents for API routing...")
macro_agent = MacroAgent()
financial_agent = FinancialAgent()
company_agent = CompanyDataAgent()
rag_agent = RAGAgent()

@app.get("/")
def read_root():
    return {"message": "MacroRisk AI API is running. Go to /docs for documentation."}

@app.post("/forecast")
def get_forecast(request: ForecastRequest):
    """
    Runs the multi-step autoregressive macro forecast (Agent 1 standalone).
    """
    try:
        result = macro_agent.execute(
            input_payload=None, 
            months_ahead=request.months_ahead
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sectors")
def get_sectors():
    """Returns a unique list of all sectors for frontend dropdowns."""
    try:
        return financial_agent.get_sectors()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/companies/{sector_name}")
def get_companies(sector_name: str):
    """Returns a list of companies belonging to a specific sector."""
    try:
        return financial_agent.get_companies(sector_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/company_financials/{company_name}")
def get_company_financials(company_name: str):
    """
    Runs Agent 2 standalone: 
    Returns the historical baseline financials and granular statements (Income/Balance/CashFlow).
    """
    try:
        return company_agent.execute(company_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_company")
def analyze_company(request: CompanyForecastRequest):
    """
    Triggers the LangGraph workflow:
    1. Macro Agent (predicts economy)
    2. Company Agent (retrieves historical financials & statements)
    3. Financial Agent (predicts company financials)
    4. Executive Intelligence Agent (writes the report)
    """
    try:
        # Define the initial state for the LangGraph orchestrator
        initial_state = {
            "company_name": request.company_name,
            "months_ahead": request.months_ahead,
            "error": None
        }
        
        # Invoke the graph
        final_state = app_graph.invoke(initial_state)
        
        # Check if any nodes raised an error during pipeline execution
        if final_state.get("error"):
            raise HTTPException(status_code=500, detail=final_state["error"])
        
        # Construct the final API response
        return {
            "company": final_state["company_name"],
            "forecast_horizon_months": final_state["months_ahead"],
            "macro_assumptions_used": {
                "projected_inflation": final_state["proj_inf"],
                "projected_repo_rate": final_state["proj_repo"],
                "projected_brent_oil": final_state["proj_oil"]
            },
            # historical_baseline now includes the full Balance Sheet, Income Statement, etc.
            "historical_baseline": final_state["historical_financials"],
            "financial_forecasts": final_state["financial_forecasts"],
            "macro_impacts": final_state.get("macro_impacts", {}),
            "full_macro_context": final_state["macro_results"],
            "investment_report": final_state.get("investment_report")
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_with_rag(request: ChatRequest):
    """
    RAG Endpoint: Answers questions using the Chroma vector database.
    If the user runs the pipeline first, request.context contains all their financial statements,
    allowing the RAG bot to generate Moneycontrol-style tables instantly.
    """
    try:
        answer = rag_agent.execute(
            query=request.query, 
            langgraph_context=request.context
        )
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)