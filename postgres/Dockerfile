FROM postgres:10.4
RUN apt-get update
RUN apt-get install -y pgpool2 \
    vim \
    tmux
RUN sed -i.bak 's/port = 5432/port = 5433/' /etc/pgpool2/pgpool.conf
RUN sed -i.bak "s/listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/" /etc/pgpool2/pgpool.conf

COPY pgpool_postgres_entrypoint.sh /pgpool_postgres_entrypoint.sh
RUN chmod +x /pgpool_postgres_entrypoint.sh
RUN ln -s /pgpool_postgres_entrypoint.sh /usr/local/bin/pgpool_postgres_entrypoint.sh

EXPOSE 5433

CMD ["pgpool_postgres_entrypoint.sh"]