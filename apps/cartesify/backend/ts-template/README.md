# Cartesify NodeJS REST Example

## Backend

### With Nonodo

Start nonodo

```shell
nonodo
```

Start the backend

```shell
node src/app.js
```

### With Sunodo

Build:

```shell
sunodo build
```

Success output:

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

## Frontend

Start the frontend:

```shell
npm run dev
```

## How to advance the epoch

```shell
ETH_RPC_URL=http://localhost:8545 cast rpc evm_increaseTime 2592000
```

## How to configure the DApp address

Run the command:

```shell
sunodo address-book
```

Output:

```shell
 Contract            Address                                    
 ─────────────────── ────────────────────────────────────────── 
 CartesiDAppFactory  0x7122cd1221C20892234186facfE8615e6743Ab02 
 DAppAddressRelay    0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE 
 ERC1155BatchPortal  0xedB53860A6B52bbb7561Ad596416ee9965B055Aa 
 ERC1155SinglePortal 0x7CFB0193Ca87eB6e48056885E026552c3A941FC4 
 ERC20Portal         0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB 
 ERC721Portal        0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87 
 EtherPortal         0xFfdbe43d4c855BF7e0f105c400A50857f53AB044 
 InputBox            0x59b22D57D4f067708AB0c00552767405926dc768 
 SunodoToken         0xf795b3D15D47ac1c61BEf4Cc6469EBb2454C6a9b 
 CartesiDApp         0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C 
```

The DApp Address is 0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C
