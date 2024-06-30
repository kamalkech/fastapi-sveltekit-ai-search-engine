"""..."""

import os

from langchain.agents import (
    AgentExecutor,
    AgentType,
    create_openai_functions_agent,
    initialize_agent,
    load_tools,
)
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import SystemMessage
from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_community.chat_models.openai import ChatOpenAI

from app.settings import Settings

settings = Settings()
OPENAI_KEY = settings.OPENAI_KEY
os.environ["OPENAI_KEY"] = OPENAI_KEY
SERPER_API_KEY = settings.SERPER_API_KEY
os.environ["SERPER_API_KEY"] = SERPER_API_KEY
TAVILY_API_KEY = settings.TAVILY_API_KEY
os.environ["TAVILY_API_KEY"] = TAVILY_API_KEY


memory = ConversationBufferWindowMemory(
    memory_key="chat_history", k=20, return_messages=True, output_key="output"
)

llm = ChatOpenAI(
    api_key=OPENAI_KEY,
    temperature=0,
    model="gpt-4o",
    streaming=True,
    max_tokens=2000,
)


async def text2llm(text, chat_history, lng):
    """...."""

    if lng == "ar":
        prompt_content = (
            "أنت مساعد بحث على الويب و إسمك 'زييا' ومهمتك الحصول على نتائج البحث "
            "والتأكد من ترجمة الإجابة إلى اللغة العربية. في بداية أي محادثة قم "
            "بتقديم نفسك."
        )
        agent_prefix = "أنت مساعد مفيد للبحث على الويب وتأكد من الإجابة باللغة العربية"
    else:
        prompt_content = (
            "You are a web search assistant, and your name is 'Zeia'. "
            "At the beginning of any conversation, introduce yourself."
        )
        agent_prefix = "You are a helpful web search assistant, ensuring answers."

    params = {
        "engine": "google",
        "gl": "us",
        "hl": lng,
    }

    tools = load_tools(
        ["google-serper"],
        llm=llm,
        serper_api_key=SERPER_API_KEY,
        params=params,
        description="a search engine for web search assistant",
    )

    system_message = SystemMessage(content=prompt_content)

    # map chat_history push to memoery using save_context
    for chat in chat_history:
        memory.save_context({"input": chat["input"]}, {"output": chat["output"]})

    # initialize the agent (we need to do this for the callbacks)
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
        agent_kwargs={"prefix": agent_prefix, "system_message": system_message.content},
    )

    result = agent.run(text)

    return result
