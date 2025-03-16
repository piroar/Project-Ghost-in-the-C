FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install shellinabox and basic utilities
RUN apt-get update && \
    apt-get install -y shellinabox openssh-server sudo curl nano vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a user for access
RUN useradd -m -s /bin/bash shelluser && \
    echo "shelluser:password" | chpasswd && \
    usermod -aG sudo shelluser


# Expose the shellinabox port
EXPOSE 4200

# Start shellinabox in the foreground
CMD ["/usr/bin/shellinaboxd", "--no-beep", "--disable-ssl", "-s", "/:LOGIN", "-p", "4200", "-t"]