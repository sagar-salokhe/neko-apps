# Neko Apps With Playwright Server

This repository contains the Playwright server for Neko Apps. Here we have installed Playwright version 1.49.0, also installed a Nodejs version 18.

## Dockerfile Description

The Dockerfile sets up the environment for running the Playwright server for Neko Apps. Below is a brief description of the steps involved:

1. **Base Image**: Uses the `m1k1o/neko:base` image as the base.
2. **Update and Install Dependencies**: Updates package lists and installs `curl` and `openbox`.
3. **Install Node.js 18**: Installs Node.js version 18 and verifies the installation.
4. **Install Playwright Dependencies**: Installs Playwright dependencies for Chromium.
5. **Clean Up**: Cleans up unnecessary files to reduce the image size.
6. **Copy Files**: Copies necessary files such as `run.sh`, `node_modules`, `index.js`, `server.cert`, and `server.key` to the container.
7. **Install Playwright Chromium**: Installs Playwright Chromium as the `neko` user.
8. **Copy Configuration Files**: Copies configuration files for supervisord and Openbox.
9. **Expose Port**: Exposes port `9223` for the Playwright server.

## Usecase

The installed playwright server exposed a wesocket endpoint on the port 9223.
This wesocket endpoint can be used by the zinc container to connect to the chrome browser server.

User can login to the Neko UI and interact with the chrome browser instance created by the zinc.


