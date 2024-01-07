import os

from fastapi import Body, APIRouter
from pydantic import BaseModel

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from langchain.schema import (
    SystemMessage
)

from app.settings import Settings

settings = Settings()
SERPER_API_KEY = settings.SERPER_API_KEY
os.environ["SERPER_API_KEY"] = SERPER_API_KEY

router = APIRouter()

class Query(BaseModel):
    """...."""
    text: str
    openai_key: str


@router.post("/")
async def search_stream(
    query: Query = Body(...),
):
    """...."""
    # Get body params.
    text = query.text
    openai_key = query.openai_key

    # initialize the agent (we need to do this for the callbacks)
    llm = ChatOpenAI(
        openai_api_key=openai_key,
        temperature=0,
        # model="gpt-3.5-turbo",
        model="gpt-4-1106-preview",
        streaming=True,
        max_tokens=1000
    )

    memory = ConversationBufferWindowMemory(
        memory_key="chat_history",
        k=10,
        return_messages=True,
        output_key="output"
    )

    params = {
        "engine": "google",
        "gl": "us",
        "hl": "en",
    }

    tools = load_tools(
        ["google-serper"],
        llm=llm,
        serper_api_key=SERPER_API_KEY,
        params=params,
        description="a search engine for Arabic",
    )

    system_message = SystemMessage(
        content="أنت مساعد بحث على الويب للحصول على نتائج الاستعلامات والتأكد من ترجمة الإجابة إلى اللغة العربية.",
        # system="أنت مساعد بحث على الويب للحصول على نتائج الاستعلامات والتأكد من ترجمة الإجابة إلى اللغة العربية."
    )

    agent = initialize_agent(
        agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
        tools=tools,
        llm=llm,
        verbose=True,
        max_iterations=3,
        early_stopping_method="generate",
        memory=memory,
        return_intermediate_steps=False,
        handle_parsing_errors=True,
        system_message=system_message,
        agent_kwargs={
            'prefix': "أنت مساعد مفيد للبحث على الويب وتأكد من الإجابة باللغة العربية.",
        }
    )

    result = agent.run(text)
    return result

