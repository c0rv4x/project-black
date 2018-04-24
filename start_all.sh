tmux new -d -s black "python3 app.py"
tmux new-window -t "black:01" -n "masscan" "cd black/ && sudo python3 masscan_worker.py"
tmux new-window -t "black:02" -n "nmap" "cd black/ && python3 nmap_launcher.py"
tmux new-window -t "black:03" -n "dirsearch" "cd black/ && python3 dirsearch_worker.py"

tmux ls

while true; do sleep 1000; done