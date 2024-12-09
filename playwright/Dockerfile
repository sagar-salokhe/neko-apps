# Use the base image for Neko
ARG BASE_IMAGE=m1k1o/neko:base
FROM $BASE_IMAGE

# Update package lists and install curl
RUN set -eux; apt-get update;
RUN apt-get install curl -y

# Install Openbox window manager
RUN apt-get install -y --no-install-recommends openbox

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -; \
    apt-get install -y nodejs;

# Ensure Node.js version is 18
RUN node -v | grep 'v18';

# Install Playwright dependencies for Chromium
RUN npx playwright install-deps chromium

# Clean up to reduce image size
RUN apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* /tmp/*;

# Copy necessary files to the container
COPY run.sh /home/neko/run.sh
COPY node_modules /home/neko/node_modules
COPY index.js /home/neko/index.js
COPY server.cert /home/neko/server.cert
COPY server.key /home/neko/server.key

# Switch to user 'neko' and install Playwright Chromium
USER neko
RUN cd /home/neko; \
    npx playwright install chromium;

# Switch back to root user
USER root

# Copy configuration files
COPY supervisord.conf /etc/neko/supervisord/playwright.conf
COPY openbox.xml /etc/neko/openbox.xml

# Expose port 9223 for the Playwright server
EXPOSE 9223