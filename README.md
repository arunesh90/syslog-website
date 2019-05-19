# Syslog Web Application

_I have yet to decide on a final name for this project_

## Overview
This is a react web application for logs that's able to view them in real-time and searches back for previous logs easily.
This is my first react web application, so any feedback is welcome.

## Stack
* Express for API
* ElasticSearch for storing logs and being able to view history quickly
* Next.JS for compiling React and Server Side Rendering
* Redis for PubSub to receive syslog messages in real-time and to store sessions
* WebSocket to push syslog messages from Redis to the web client in real-time
* Bulma as CSS framework
* _Explore the code to see the rest_

## Preview
You can find a video of this working [here](https://streamable.com/g0mzo)
