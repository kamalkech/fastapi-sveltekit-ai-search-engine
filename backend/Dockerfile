# 
FROM python:3.11

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./app /code/app
COPY ./main.py /code/main.py
COPY ./.env /code/.env

# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3333"]
