"""..."""

import os
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import SystemMessage, chat_history

# from langchain_groq import ChatGroq
from langchain_anthropic import ChatAnthropic


from app.settings import Settings


settings = Settings()
OPENAI_KEY = settings.OPENAI_KEY
os.environ["OPENAI_KEY"] = OPENAI_KEY
SERPER_API_KEY = settings.SERPER_API_KEY
os.environ["SERPER_API_KEY"] = SERPER_API_KEY

async def text2llm(text, chat_history, lng):
    """...."""
    

    if (lng == "ar"):
        prompt_content = "أنت مساعد بحث على الويب و إسمك 'زييا' ومهمتك الحصول على نتائج البحث والتأكد من ترجمة الإجابة إلى اللغة العربية. في بداية أي محادثة قم بتقديم نفسك.";
        agent_prefix = "أنت مساعد مفيد للبحث على الويب وتأكد من الإجابة باللغة العربية"
    else:
        prompt_content = "You are a web search assistant, and your name is 'Zeia'. At the beginning of any conversation, introduce yourself."
        agent_prefix = "You are a helpful web search assistant, ensuring answers."

    memory = ConversationBufferWindowMemory(
        memory_key="chat_history",
        k=20,
        return_messages=True,
        output_key="output"
    )

    # llm = ChatOpenAI(
    #     openai_api_key=OPENAI_KEY,
    #     temperature=0,
    #     # model="gpt-3.5-turbo",
    #     # model="gpt-4-1106-preview",
    #     model="gpt-4-turbo",
    #     # model="gpt-3.5-turbo-0125",
    #     streaming=True,
    #     max_tokens=1000
    # )
    
    # llm = ChatGroq(
    #     temperature=0,
    #     model="llama2-70b-4096",
    #     streaming=True,
    #     max_tokens=1000
    # )

    llm = ChatAnthropic(
        temperature=0,
        model='claude-3-opus-20240229',
        streaming=True,
        max_tokens=1000
    )

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

    system_message = SystemMessage(
        content=prompt_content
    )


    # map chat_history push to memoery using save_context
    for chat in chat_history:
        print(chat)
        memory.save_context({"input": chat['input']}, {"output": chat['output']})

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
        agent_kwargs={
            'prefix': agent_prefix,
            "system_message": system_message.content
        }
    )

    result = agent.run(text)
    return result
