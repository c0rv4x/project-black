tmux new -d -s postgres "docker-entrypoint.sh postgres"
while true; do pgpool -n; sleep 1; done