base13Debug
===========

base13Debug is an early-stage debugging library for writing Javascript applications. Currently, it's main feature is a remote CLI that you can inject into clients for remote debugging in Node.js. It uses as much of the Node.js CLI code as possible, so it supports pretty printing, tab completion and all the other niceties that Node.js provides.

You can run a minimal example by running ``node server/start.js``, then opening ``client/index.html`` in a web browser. You should see a ``Connected to remote [0]`` message once you open the client. From the server, run ``.remote`` to connect to the first available remote client.
