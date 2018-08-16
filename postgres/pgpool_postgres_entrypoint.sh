tmux new -d -s postgres "docker-entrypoint.sh postgres"

RES=`pg_isready -U postgres | grep -o "accepting"`

while [[ $RES != "accepting" ]];
do 
	RES=`pg_isready -U postgres | grep -o "accepting"`
	sleep 1
done

rm /var/run/postgresql/.s.PGSQL.5433
rm /var/run/postgresql/.s.PGSQL.9898
rm /var/run/postgresql/pgpool.pid

pgpool -n
