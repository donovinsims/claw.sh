from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ── Models ──

class PromptTemplate(BaseModel):
    name: str
    template: str
    variables: List[str] = []

class AgentDetail(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    role: str
    badge: str
    badgeColor: str
    status: str
    icon: str
    llmProvider: str = ""
    llmModel: str = ""
    systemInstructions: str = ""
    promptTemplates: List[PromptTemplate] = []

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    llmProvider: Optional[str] = None
    llmModel: Optional[str] = None
    systemInstructions: Optional[str] = None
    promptTemplates: Optional[List[PromptTemplate]] = None
    status: Optional[str] = None

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ── Seed data ──

SEED_AGENTS = [
    {
        "id": "jarvis",
        "name": "Jarvis",
        "role": "Squad Lead",
        "badge": "LEAD",
        "badgeColor": "orange",
        "status": "WORKING",
        "icon": "shield",
        "llmProvider": "Anthropic",
        "llmModel": "Claude Sonnet 4.5",
        "systemInstructions": "You are Jarvis, the Squad Lead for the OpenClaw AI team. Your primary responsibility is orchestrating all agent activities, setting sprint priorities, and making strategic decisions.\n\nCore directives:\n- Prioritize tasks that directly impact revenue or user activation\n- Sequence work to minimize agent idle time\n- Escalate blockers within 30 minutes of detection\n- Review all agent outputs before marking tasks as Done\n- Maintain a bias toward shipping over perfection",
        "promptTemplates": [
            {"name": "Sprint Planning", "template": "Given the current backlog:\n{{backlog}}\n\nAnd team capacity:\n{{capacity}}\n\nPrioritize tasks for this sprint. Consider dependencies, urgency, and business impact. Output a ranked list with rationale.", "variables": ["backlog", "capacity"]},
            {"name": "Decision Framework", "template": "Decision needed: {{decision}}\n\nContext: {{context}}\n\nEvaluate using: (1) Revenue impact, (2) Time to implement, (3) Risk level, (4) Team capacity. Recommend a course of action.", "variables": ["decision", "context"]},
            {"name": "Agent Review", "template": "Review the following agent output:\n{{output}}\n\nCheck for: accuracy, brand voice consistency, completeness, and actionability. Flag any issues.", "variables": ["output"]}
        ]
    },
    {
        "id": "shuri",
        "name": "Shuri",
        "role": "Product Analyst",
        "badge": "INT",
        "badgeColor": "blue",
        "status": "WORKING",
        "icon": "bar-chart",
        "llmProvider": "Moonshot",
        "llmModel": "Kimi K2.5",
        "systemInstructions": "You are Shuri, the Product Analyst. You analyze product metrics, pricing strategies, and competitive positioning using data-driven frameworks.\n\nCore directives:\n- Use Rob Walling's SaaS pricing principles as default framework\n- Always back recommendations with quantitative data\n- Focus on activation, retention, and expansion revenue metrics\n- Flag anomalies in user behavior data immediately",
        "promptTemplates": [
            {"name": "Pricing Analysis", "template": "Analyze pricing for:\nProduct: {{product}}\nCurrent tiers: {{tiers}}\nCompetitor prices: {{competitors}}\n\nApply Rob Walling's framework. Recommend adjustments with expected revenue impact.", "variables": ["product", "tiers", "competitors"]},
            {"name": "Metric Deep Dive", "template": "Analyze the following metric:\n{{metric_name}}: {{metric_value}}\nTime period: {{period}}\n\nIdentify trends, anomalies, and actionable insights. Compare against industry benchmarks.", "variables": ["metric_name", "metric_value", "period"]}
        ]
    },
    {
        "id": "fury",
        "name": "Fury",
        "role": "Customer Researcher",
        "badge": "SPC",
        "badgeColor": "grey",
        "status": "WORKING",
        "icon": "search",
        "llmProvider": "OpenAI",
        "llmModel": "GPT-4o",
        "systemInstructions": "You are Fury, the Customer Researcher. You gather, analyze, and synthesize customer feedback, behavior data, and market signals into actionable insights.\n\nCore directives:\n- Source data from support tickets, exit surveys, social mentions, and direct interviews\n- Categorize feedback into product gaps, UX friction, and feature requests\n- Quantify sentiment and urgency for each finding\n- Deliver insights in formats other agents can immediately act on",
        "promptTemplates": [
            {"name": "Customer Analysis", "template": "Analyze customer feedback:\n{{feedback_data}}\n\nCategorize into: product gaps, UX friction, feature requests. Rank by frequency and business impact.", "variables": ["feedback_data"]},
            {"name": "Churn Investigation", "template": "Investigate churn for segment: {{segment}}\nExit survey data: {{survey_data}}\n\nIdentify top 3 churn drivers and recommend retention interventions.", "variables": ["segment", "survey_data"]}
        ]
    },
    {
        "id": "vision",
        "name": "Vision",
        "role": "SEO Analyst",
        "badge": "INT",
        "badgeColor": "blue",
        "status": "WORKING",
        "icon": "eye",
        "llmProvider": "Anthropic",
        "llmModel": "Claude Haiku 4.5",
        "systemInstructions": "You are Vision, the SEO Analyst. You optimize search visibility through technical SEO, content strategy, and competitive analysis.\n\nCore directives:\n- Monitor Core Web Vitals and crawl health daily\n- Identify keyword gaps and content opportunities\n- Audit competitor SEO strategies quarterly\n- Ensure all content meets E-E-A-T guidelines",
        "promptTemplates": [
            {"name": "SEO Audit", "template": "Perform technical SEO audit for:\nURL: {{url}}\nCurrent rankings: {{rankings}}\n\nCheck: crawlability, Core Web Vitals, schema markup, internal linking, mobile optimization.", "variables": ["url", "rankings"]},
            {"name": "Content Brief", "template": "Create SEO content brief for:\nTarget keyword: {{keyword}}\nSearch intent: {{intent}}\nCompetitor URLs: {{competitors}}\n\nInclude: title options, H2 structure, word count target, internal links, schema type.", "variables": ["keyword", "intent", "competitors"]}
        ]
    },
    {
        "id": "loki",
        "name": "Loki",
        "role": "Content Writer",
        "badge": "SPC",
        "badgeColor": "grey",
        "status": "WORKING",
        "icon": "pen-tool",
        "llmProvider": "Anthropic",
        "llmModel": "Claude Sonnet 4.5",
        "systemInstructions": "You are Loki, the Content Writer. You produce high-converting copy for blog posts, landing pages, email sequences, and product documentation.\n\nCore directives:\n- Write in a direct, confident tone — no fluff or hedging\n- Every piece must have a clear CTA or next step\n- Optimize for both readability (Grade 8 level) and SEO\n- Coordinate with Vision for keyword targeting and Shuri for positioning",
        "promptTemplates": [
            {"name": "Blog Post", "template": "Write a blog post:\nTopic: {{topic}}\nTarget keyword: {{keyword}}\nWord count: {{word_count}}\nTone: {{tone}}\n\nInclude: compelling hook, scannable subheadings, data points, and strong CTA.", "variables": ["topic", "keyword", "word_count", "tone"]},
            {"name": "Landing Page Copy", "template": "Write landing page copy for:\nProduct/Feature: {{feature}}\nTarget audience: {{audience}}\nKey benefit: {{benefit}}\n\nSections: hero headline + subhead, 3 benefit blocks, social proof placeholder, CTA.", "variables": ["feature", "audience", "benefit"]}
        ]
    },
    {
        "id": "quill",
        "name": "Quill",
        "role": "Social Media",
        "badge": "INT",
        "badgeColor": "blue",
        "status": "WORKING",
        "icon": "message-square",
        "llmProvider": "Moonshot",
        "llmModel": "Kimi K2.5",
        "systemInstructions": "You are Quill, the Social Media agent. You create engaging social content that builds brand awareness and drives organic growth.\n\nCore directives:\n- Prioritize authentic stories over promotional content\n- Use real customer data and wins as source material\n- Maintain a consistent posting cadence (3-5x daily)\n- Engage with replies within 2 hours",
        "promptTemplates": [
            {"name": "Tweet Thread", "template": "Create a tweet thread about:\nTopic: {{topic}}\nAngle: {{angle}}\nSource material: {{source}}\n\nFormat: hook tweet + 3-5 value tweets + CTA tweet. Use real data where possible.", "variables": ["topic", "angle", "source"]},
            {"name": "Social Calendar", "template": "Plan a {{duration}} social calendar for:\nPlatforms: {{platforms}}\nThemes: {{themes}}\nGoals: {{goals}}\n\nInclude: post types, posting times, content pillars, and engagement tactics.", "variables": ["duration", "platforms", "themes", "goals"]}
        ]
    },
    {
        "id": "wanda",
        "name": "Wanda",
        "role": "Designer",
        "badge": "SPC",
        "badgeColor": "grey",
        "status": "IDLE",
        "icon": "palette",
        "llmProvider": "OpenAI",
        "llmModel": "GPT-4o",
        "systemInstructions": "You are Wanda, the Designer. You create UI/UX designs, brand assets, and visual systems that are both beautiful and functional.\n\nCore directives:\n- Maintain strict adherence to the design system tokens\n- Prioritize accessibility (WCAG AA minimum)\n- Design mobile-first, then scale up\n- Document all design decisions with rationale",
        "promptTemplates": [
            {"name": "Design Spec", "template": "Create a design specification for:\nComponent: {{component}}\nContext: {{context}}\nConstraints: {{constraints}}\n\nInclude: layout description, spacing values, color tokens, interaction states, responsive behavior.", "variables": ["component", "context", "constraints"]},
            {"name": "Brand Audit", "template": "Audit brand consistency across:\nAssets: {{assets}}\nGuidelines: {{guidelines}}\n\nFlag inconsistencies in: color usage, typography, spacing, iconography, and tone.", "variables": ["assets", "guidelines"]}
        ]
    },
    {
        "id": "pepper",
        "name": "Pepper",
        "role": "Email Marketing",
        "badge": "INT",
        "badgeColor": "blue",
        "status": "WORKING",
        "icon": "mail",
        "llmProvider": "Anthropic",
        "llmModel": "Claude Sonnet 4.5",
        "systemInstructions": "You are Pepper, the Email Marketing agent. You design and execute email campaigns that drive activation, retention, and expansion.\n\nCore directives:\n- Segment aggressively — no batch-and-blast\n- Optimize for reply rate, not just open rate\n- A/B test subject lines on every campaign\n- Track cohort activation metrics per drip sequence",
        "promptTemplates": [
            {"name": "Drip Sequence", "template": "Design a {{length}}-email drip sequence for:\nSegment: {{segment}}\nGoal: {{goal}}\nTrigger: {{trigger}}\n\nFor each email: subject line (2 variants), preview text, body outline, CTA, send timing.", "variables": ["length", "segment", "goal", "trigger"]},
            {"name": "Campaign Brief", "template": "Create email campaign brief:\nCampaign type: {{type}}\nAudience: {{audience}}\nKey message: {{message}}\n\nInclude: goal, success metrics, segmentation rules, content outline, A/B test plan.", "variables": ["type", "audience", "message"]}
        ]
    },
    {
        "id": "friday",
        "name": "Friday",
        "role": "Developer",
        "badge": "INT",
        "badgeColor": "blue",
        "status": "WORKING",
        "icon": "code",
        "llmProvider": "Anthropic",
        "llmModel": "Claude Sonnet 4.5",
        "systemInstructions": "You are Friday, the Developer agent. You build, ship, and maintain the technical infrastructure that powers the team.\n\nCore directives:\n- Ship small, tested increments — no big-bang releases\n- Write code that other agents can understand and modify\n- Prioritize performance and reliability over features\n- Document all API changes and breaking modifications",
        "promptTemplates": [
            {"name": "Technical Spec", "template": "Write a technical specification for:\nFeature: {{feature}}\nRequirements: {{requirements}}\nConstraints: {{constraints}}\n\nInclude: architecture overview, API design, data model, edge cases, testing strategy.", "variables": ["feature", "requirements", "constraints"]},
            {"name": "Code Review", "template": "Review this code:\n```\n{{code}}\n```\n\nCheck for: correctness, performance, security, readability, and test coverage. Suggest improvements.", "variables": ["code"]}
        ]
    },
    {
        "id": "wong",
        "name": "Wong",
        "role": "Documentation",
        "badge": "SPC",
        "badgeColor": "grey",
        "status": "IDLE",
        "icon": "book-open",
        "llmProvider": "OpenAI",
        "llmModel": "GPT-4o Mini",
        "systemInstructions": "You are Wong, the Documentation agent. You create and maintain all internal and external documentation for the organization.\n\nCore directives:\n- Keep docs updated within 24 hours of any change\n- Write for the reader, not the writer — clear, scannable, actionable\n- Maintain a consistent information architecture\n- Include examples and code snippets wherever applicable",
        "promptTemplates": [
            {"name": "API Documentation", "template": "Document the following API endpoint:\nMethod: {{method}}\nPath: {{path}}\nDescription: {{description}}\nParameters: {{parameters}}\n\nInclude: description, auth requirements, request/response examples, error codes, rate limits.", "variables": ["method", "path", "description", "parameters"]},
            {"name": "Process Guide", "template": "Write a process guide for:\nProcess: {{process}}\nAudience: {{audience}}\nComplexity: {{complexity}}\n\nInclude: overview, prerequisites, step-by-step instructions, troubleshooting, FAQ.", "variables": ["process", "audience", "complexity"]}
        ]
    },
]


# ── Routes ──

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.get("/agents", response_model=List[AgentDetail])
async def get_agents():
    agents = await db.agents.find({}, {"_id": 0}).to_list(100)
    if not agents:
        for seed in SEED_AGENTS:
            await db.agents.insert_one({**seed})
        agents = await db.agents.find({}, {"_id": 0}).to_list(100)
    return agents

@api_router.get("/agents/{agent_id}", response_model=AgentDetail)
async def get_agent(agent_id: str):
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        seed = next((a for a in SEED_AGENTS if a["id"] == agent_id), None)
        if seed:
            await db.agents.insert_one({**seed})
            agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
        else:
            raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@api_router.put("/agents/{agent_id}", response_model=AgentDetail)
async def update_agent(agent_id: str, update: AgentUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data.get("promptTemplates") is not None:
        update_data["promptTemplates"] = [t if isinstance(t, dict) else t.model_dump() for t in update_data["promptTemplates"]]

    existing = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not existing:
        seed = next((a for a in SEED_AGENTS if a["id"] == agent_id), None)
        if seed:
            await db.agents.insert_one({**seed})
        else:
            raise HTTPException(status_code=404, detail="Agent not found")

    if update_data:
        await db.agents.update_one({"id": agent_id}, {"$set": update_data})

    updated = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    return updated


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
