FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y shellinabox nano vim micro emacs gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash shelluser && \
    echo "shelluser:password" | chpasswd

EXPOSE 4200

RUN echo '#!/bin/bash\nexec /bin/bash -l' > /usr/local/bin/autoshell && \
    chmod +x /usr/local/bin/autoshell

CMD ["/usr/bin/shellinaboxd", "--no-beep", "--disable-ssl", "-s", "/:shelluser:shelluser:/home/shelluser:/usr/local/bin/autoshell", "-p", "4200", "-t"]