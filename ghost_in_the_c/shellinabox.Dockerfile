FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install shellinabox only
RUN apt-get update && \
    apt-get install -y shellinabox nano gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user that will be automatically logged in
RUN useradd -m -s /bin/bash shelluser && \
    echo "shelluser:password" | chpasswd

# Expose the shellinabox port
EXPOSE 4200

# Create a simple script that will be auto-executed for anyone connecting
RUN echo '#!/bin/bash\nexec /bin/bash -l' > /usr/local/bin/autoshell && \
    chmod +x /usr/local/bin/autoshell

# Start shellinabox with auto-login (no password prompt)
# The /:shelluser:shelluser:/home/shelluser:/usr/local/bin/autoshell pattern means:
# /<service name>:<username>:<groupname>:<home directory>:<command to run>
CMD ["/usr/bin/shellinaboxd", "--no-beep", "--disable-ssl", "-s", "/:shelluser:shelluser:/home/shelluser:/usr/local/bin/autoshell", "-p", "4200", "-t"]