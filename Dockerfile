#---------- BASE ----------#
FROM keymetrics/pm2:16-stretch as base
WORKDIR /usr/local/storm/demo
COPY ./package.json ./
RUN npm install --unsafe-perm --no-audit
COPY ./.env ./.eslint* ./tsconfig.json ./

# Update package.json to point to local directory instead of version for @wavv modules
RUN sed -i 's/"@wavv\/internal": ".*"/"\@wavv\/internal": "..\/module\/internal"/' ./package.json
RUN sed -i 's/"@wavv\/messenger": ".*"/"\@wavv\/messenger": "..\/module\/messenger"/' ./package.json
RUN sed -i 's/"@wavv\/dialer": ".*"/"\@wavv\/dialer": "..\/module\/dialer"/' ./package.json

# Copy installed versions of @wavv modules as placeholders (Required for second npm install to watch right directories)
WORKDIR /usr/local/storm/module
RUN mv ../demo/node_modules/\@wavv/internal ./internal
RUN mv ../demo/node_modules/\@wavv/messenger ./messenger
RUN mv ../demo/node_modules/\@wavv/dialer ./dialer

# Delete any remnants of @wavv from node modules and package-lock.json
# so that it will update to point to a local folder. This is somewhat janky,
# but is also the only way I have been able to get this working.
WORKDIR /usr/local/storm/demo
RUN rm -rf package-lock.json node_modules/\@wavv
RUN npm install --quiet --unsafe-perm --no-progress --no-audit

# Clear out those @wavv placeholder directories now that we have the correct package-lock.json setup,
# so that we can mount the actual @wavv repos at runtime
WORKDIR /usr/local/storm/module
RUN rm -rf ./internal/*
RUN rm -rf ./messenger/dist/*
RUN rm -rf ./dialer/dist/*

WORKDIR /usr/local/storm/module/dialer
RUN npm install

WORKDIR /usr/local/storm/module/messenger
RUN npm install

#---------- DEVELOPMENT TARGET ----------#
FROM base as development
WORKDIR /usr/local/storm/demo
COPY --from=base /usr/local/storm/demo ./
COPY ./pm2-dev.json /etc/storm/pm2.json

EXPOSE 3001
CMD ["/usr/local/bin/pm2-runtime", "start", "/etc/storm/pm2.json"]
