FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        shellinabox \
        nano \
        vim \
        micro \
        emacs \
        gcc \
        man-db \
        manpages \
        groff-base && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


RUN if [ -f /usr/bin/man.REAL ]; then \
            dpkg-divert --rename --remove /usr/bin/man || true && \
            mv -f /usr/bin/man.REAL /usr/bin/man || true; \
        fi

RUN if [ -f /etc/dpkg/dpkg.cfg.d/excludes ]; then \
            sed -i '/path-exclude=\/usr\/share\/man\/*/d' /etc/dpkg/dpkg.cfg.d/excludes || true; \
        fi

RUN apt-get update && \
    apt-get install -y --no-install-recommends --reinstall \
        coreutils \
        util-linux \
        findutils \
        grep \
        sed \
        gawk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash shelluser && \
    echo "shelluser:password" | chpasswd

EXPOSE 4200

RUN echo '#!/bin/bash\nexec /bin/bash -l' > /usr/local/bin/autoshell && \
    chmod +x /usr/local/bin/autoshell

CMD ["/usr/bin/shellinaboxd", "--no-beep", "--disable-ssl", "-s", "/:shelluser:shelluser:/home/shelluser:/usr/local/bin/autoshell", "-p", "4200", "-t"]