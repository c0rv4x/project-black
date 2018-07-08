tmux new -d -s black "python3 app.py config_docker.yaml"
tmux new-window -t "black:01" -n "masscan" "sudo python3 masscan_worker.py"
tmux new-window -t "black:02" -n "nmap" "python3 nmap_launcher.py"
tmux new-window -t "black:03" -n "dirsearch" "python3 dirsearch_worker.py"

tmux ls

while true; do sleep 1000; done
