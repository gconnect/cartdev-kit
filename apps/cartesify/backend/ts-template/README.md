# Cartesify Nodejs TypeScript REST Template

This is a template for TypeScript Cartesi DApps. It uses node to execute the backend application.
The application entrypoint is the `src/index.ts` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.

## How it Works
The entrypoint `src/index.ts` contains example code that shows all to perfrom CRUD and wallet operations using different REST api endpoints.

## Prerequisite
Ensure you have the following packages installed
- [Node](https://nodejs.org/en) 20+, 
- [Docker](https://docs.docker.com/desktop/install/windows-install/) and 
- [Cartesi CLI](https://docs.sunodo.io/guide/introduction/installing)
- [nonodo](https://github.com/Calindra/nonodo/tree/main)

## How to Run the Backend Server Using Cartesi CLI
To start the server when using Cartesi CLI ensure your docker is up and running

  ```shell
  cartesi build
  ```
  This will build th image. Once this is successful. The next command to run will be

   ```shell
  cartesi run
  ```
  This will start the local server. 

   ```shell
  cartesi run --epoch-duration 5
  ```
  The above command will start the local server with the epoch argument set to 5 seconds. You can set it to any number depending on the duration you want to wait before voucher can be executed.

   ```shell
  cartesi address-book
  ```
 To get list of addresses used for development purpose run this command;


### How to Run the Backend Server Using Nonodo

Start nonodo

```shell
nonodo
```

Start the backend

```shell
node src/index.ts
```

### Success build output:

```shell
 => exporting to image                                                                                                                                                        0.2s
 => => exporting layers                                                                                                                                                       0.2s
 => => writing image sha256:e8f879c648c3cbd230476a811bce2e826d20d96a383eb5acf9d9b084cf1f31ef                                                                                  0.0s
copying from tar archive /mnt/image.tar



 ›   Warning: ommiting environment variable NODE_VERSION=20.8.0
 ›   Warning: ommiting environment variable YARN_VERSION=1.22.19
cd /opt/cartesi/dapp;PATH=/opt/cartesi/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin ROLLUP_HTTP_SERVER_URL=http://127.0.0.1:5004 rollup-init node src/app.js

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[INFO  rollup_http_server] starting http dispatcher service...
[INFO  rollup_http_server::http_service] starting http dispatcher http service!
[INFO  actix_server::builder] starting 1 workers
[INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[INFO  rollup_http_server::dapp_process] starting dapp: node src/app.js
starting app.js...
[server]: Server is running at http://localhost:8383

Manual yield rx-accepted (0x100000000 data)
Cycles: 1493691714
1493691714: 7e2156ddf325ceb7334b18d6955d7b78b4331d3a7707d18cc966cd864cd1ace0
Storing machine: please wait

```
### Success Run Output
![alt text](<Screenshot 2024-07-15 at 10.00.50 AM-1.png>)

 ## To Learn More
  To learn more about building on Cartesi you can visit the [Cartesi](https://docs.cartesi.io/cartesi-rollups/1.3/) and [Sunodu](https://docs.sunodo.io/) documentations.