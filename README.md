oocharts-server
===============

Installable OOcharts server.

## Steps to install

### Creating a Google Project

Go to [Google Developer Console](https://console.developers.google.com/project).

Create a Project. Pick whatever `Project name` and `Project ID` you'd like. I use "OOcharts Server" for the name and choose whatever project ID is generated for me.

Once the project has been created, navigate to the `APIs & auth` section.

Under `APIs`, turn on "Analytics API" and turn off any other APIs that may default to on (Such as "Google Cloud SQL").

Next, go the `Credentials`. Select "Create a New Client ID". OOcharts is a `Web Application`. Remove the `Authorized JavaScript origins` and put whatever server IP or Url you will be using for OOcharts. By default, OOcharts runs on port `4004` and has a callback url of `/setup/google-callback`. If I way hosting OOcharts under `mysite.com`, I would put as the `Authorized redirect URI`: `http://mysite.com:4004/setup/google-callback`. Once finished, create the client Id.

Once the ID is created, take note of the `Client ID` and `Client secret` provided. We will need them when we setup OOcharts.

### Setting up OOcharts

OOcharts requires `nodejs` and `npm` to run.

Download OOcharts to wherever you'd like to run it from. Direct your console to the root of the project, and then run `node app`.

Navigate to `/setup`.

Fill in the information. Make sure the host URL matches the host you used when setting up your Google project. In my case, I would use `http://mysite.com:4004`. If the setup worked correctly, you should be redirected to Google for authentication. Once complete, you will be provided your API Key. Use OOcharts just like before!