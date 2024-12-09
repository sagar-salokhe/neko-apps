ARG BASE_IMAGE=m1k1o/neko:base
FROM $BASE_IMAGE

RUN set -eux; apt-get update;
RUN apt-get install curl -y

RUN apt-get install -y --no-install-recommends openbox

    # force install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -; \
    apt-get install -y nodejs;

    # ensure Node.js version is 18
RUN node -v | grep 'v18';

RUN npx playwright install-deps chromium

    # clean up
RUN apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* /tmp/*;

COPY run.sh /home/neko/run.sh
COPY node_modules /home/neko/node_modules
COPY index.js /home/neko/index.js
COPY server.cert /home/neko/server.cert
COPY server.key /home/neko/server.key

USER neko

RUN cd /home/neko; \
    npx playwright install chromium;

USER root

#
# copy configuation files
COPY supervisord.conf /etc/neko/supervisord/playwright.conf
COPY openbox.xml /etc/neko/openbox.xml

EXPOSE 9223