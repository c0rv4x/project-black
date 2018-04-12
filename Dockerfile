FROM ubuntu:16.04

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=front_black Version=1.0.0
EXPOSE 5000

WORKDIR /black
ADD . /black


RUN apt update && apt install -y \
    masscan \
    nmap \
    postgresql \
    python3 \
    python3-pip \
    rabbitmq-server \
    sudo \
    tmux

RUN /etc/init.d/postgresql start && \
    sudo -u postgres createdb black && \
    sudo -u postgres psql -c "CREATE ROLE black PASSWORD 'black101'" && \
    sudo -u postgres psql -c "GRANT ALL on database black to black"


RUN tmux new -d -s admin "rabbitmq-server" 

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "app.py"]

# Using pipenv:
# RUN python3 -m pip install pipenv
#RUN pipenv install --ignore-pipfile
#CMD ["pipenv", "run", "python3", "-m", "front_black"]
