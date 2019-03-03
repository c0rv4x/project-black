# Black

## What is this tool for?

Track progress of the team during pentest/bugbounty. Launch masscan, nmap, dirsearch, amass and patator against the scope you work on.

## Installation

Simple version means running the following docker images:
- Postgres
- RabbitMQ
- Web server
- Workers: each task has it's own worker. For instance, masscan and nmap will be run only in separate workers

For complex installation, see the wiki.
24
Now head to http://localhost:5000, enter the credentials (can be found 

```
git clone https://github.com/c0rvax/black
cd black
docker-compose up`
```

That's it!

Now head to http://localhost:5000, enter the credentials (can be found in https://github.com/c0rvax/black/blob/master/config/config_docker.yml under `application`)

## How to work with this?

After a setup, create a project and head to the respective page.

### Add scope

Let's say we are assessing hackerone.com and all it's subdomains. Write `hackerone.com`
