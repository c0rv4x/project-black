# Black

Basic scanner and progress tracker for a bug bounty or pentest project

## What is this tool for?

The tools encourages more **methodical** work on pentest/bugbounty, tracking the progress and general scans information.

It can launch
* masscan
* nmap
* dirsearch
* amass
* patator

against the scope you work on and store the data in a handy form. Perform useful filtering of the project's data, for instance:

* find me all hosts, which have open ports, but not 80
* find me all hosts, whose ips start with 82.
* find me hosts where dirsearch has found at least 1 file with 200 status code

## Installation

Install docker and docker-compose.

Simple version means running the following docker images:
- Postgres
- RabbitMQ
- Web server
- Workers: each task has it's own worker. For instance, masscan and nmap will be run only in separate workers

```
sudo apt install docker docker-compose
git clone https://github.com/c0rvax/black
cd black
docker-compose up
```
This might take some time but that's it!

Now head to http://localhost:5000, enter the credentials. They can be found in https://github.com/c0rvax/black/blob/master/config/config_docker.yml under `application`

For a more complex setup, see the wiki.


### Resources notice

None of the docker containers restrict the amount of resources usage, you are on your own here, however, you can change the amount of parallel tasks for each worker separately. See the wiki for that: TODO

## How to work?

After a setup, create a project and head to the respective page. Now we will follow the basic steps which you can do within the application

### Add scope

Let's say we are assessing hackerone.com and all it's subdomains. Write `hackerone.com` into the `add scope` field and press `Add to scope`

![Scope add](https://i.imgur.com/uZrsBi2.png)

Entrypoint has been added.
