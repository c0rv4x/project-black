docker start psql
docker start rabbit
tmux new -d -s black "source .env/bin/activate && python3 app.py"
tmux new-window -t "black:01" -n "masscan" "cd black/ && source .env/bin/activate && sudo python3 masscan_worker.py"
tmux new-window -t "black:02" -n "nmap" "cd black/ && source .env/bin/activate && python3 nmap_launcher.py"
tmux new-window -t "black:03" -n "dirsearch" "cd black/ && source .env/bin/activate && python3 dirsearch_worker.py"
