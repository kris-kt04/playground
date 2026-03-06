FROM mcr.microsoft.com/devcontainers/javascript-node
# Install Python, Pip3, Symlink python3 to python command
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv sqlite3 pipx
RUN mkdir -p /var/lib/sqlite/data/ && chmod -R 777 /var/lib/sqlite/data/
RUN sudo chmod 777 /opt
RUN sudo ln -s /usr/bin/python3 /usr/bin/python


RUN apt-get update && apt-get install -y postgresql && \
    service postgresql start && \
    sudo -u postgres psql -c "CREATE USER postgres_user WITH PASSWORD 'postgres_password';" && \
    sudo -u postgres psql -c "ALTER USER postgres_user CREATEDB;" && \
    sudo -u postgres psql -c "CREATE DATABASE h010_db WITH OWNER postgres_user;" && \
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE h010_db TO postgres_user;" && \
    sudo -u postgres psql -c "CREATE DATABASE h010_auth_db WITH OWNER postgres_user;" && \
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE h010_auth_db TO postgres_user;"

# Install deps under node user
USER node
# Install Astral
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
&& . $HOME/.local/bin/env


# Install pre-commit
RUN pipx ensurepath
RUN pipx install pre-commit


# CMD ["sleep", "infinity"]
ENTRYPOINT ["/bin/bash", "/workspace/.devcontainer/entrypoint.sh"]

