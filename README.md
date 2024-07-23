<p align="center">
  <img src="https://github.com/user-attachments/assets/d5798bf2-61b4-4ebd-8b2f-a1b90ec50a5b" alt="Description of Image">
</p>
<h1 align="center" id="cartdevkit-cli">CartDevKit CLI</h1>

<details>
  <summary>Table of Contents</summary>

- [About CartDevKit](#about-cartdevkit)
- [System Requirements and Prerequisites](#system-requirements-and-prerequisites)
- [Installation Guide](#installation-guide)
  - [CLI Options:](#cli-options)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Debugging](#debugging)
  - [Note](#note)
- [Supported Templates](#supported-templates)
- [Template Documentation](#template-documentation)
  - [Backend Templates:](#backend-templates)
  - [Frontend Templates](#frontend-templates)
  - [Cartesify Templates](#cartesify-templates)
- [Built With](#built-with)
- [Official CartDevKit Documentaion](#official-cartdevkit-documentaion)
- [Additional Helpful Resources](#additional-helpful-resources)
- [Contact \& Support](#contact--support)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [LICENSE](#license)

</details>

## About CartDevKit
CartDevKit is an all-in-one package to help you get started building your project on Cartesi. The CartDevKit CLI tool is designed to streamline the process of setting up new projects by providing developers with a wide range of templates for backend, frontend, Cartesify, and mobile development.

<img width="1411" alt="architecture" src="https://github.com/user-attachments/assets/d9c37cee-16db-4b37-8bb1-cd55d43e0c3c">

<div align="right">
    <a href="#cartdevkit-cli">Back to Top</a>
</div>

## System Requirements and Prerequisites
CartDevKit requires Node.js minimum version requirement is Node v.20+ and npm to be installed on your system. Ensure that you have the latest versions of Node.js and npm installed before proceeding with the installation.

## Installation Guide

To create a new project, run this command

```bash 
npx cartdevkit@latest create mydapp
```
You should see something like this

<img width="997" alt="cardevkit-cli-output" src="https://github.com/user-attachments/assets/a196c27f-6166-47a7-a6b6-449f3aafc8eb">

Replace mydapp with the desired name of your project. This command will prompt you to select a template and configure the project settings.

### CLI Options: 
View available command-line options and flags by running  

```bash
cartdevkit --help
```` 

### Backend Setup
To setup your backend here are the required steps:

- Navigate to the backend directory of your created project and run the below command, keep in mind also ensure your [docker](https://docs.docker.com/engine/install/) is all setup up and running.

- Install all required dependencies using either `yarn install` or `npm i`

### !NOTE
To build and run the backend ensure that you have [Cartesi CLI](https://docs.sunodo.io/guide/introduction/installing) is installed and your docker is up and running. For debugging purpose you can run cartesi doctor.

- Build the project by running the below command;
   
  ```shell
    cartesi build
  ```
This will help build the image and run the Cartesi machine. Once this step is completed you should see something like this
<img width="1066" alt="build-output" src="https://github.com/user-attachments/assets/1ee3d051-3045-4ecb-8c7a-eebac70fcc8a">


The next step will be to start the local server by running

```shell
  cartesi run
```
If all goes well you should see this
<img width="863" alt="run-output" src="https://github.com/user-attachments/assets/8db68168-8d79-48d4-acf1-55979ee1b036">


### Debugging 
For quick troubleshooting incase you run into any issue you can quickly check the status using

```shell
cartesi doctor
```
This will start the development server

### Frontend Setup
If you are working on the frontend, here are the required steps:

- Navigate into the frontend project directory
- Install all required dependencies using either `npm i` or  `yarn install`

### !NOTE
Once you generate the frontend template, ensure to create  a `.env` file and provide your project Id as it's an important requirement when working with Rainbowkit and wagmi.

Your `.env` file should look like this 👇 on the nextjs template

```bash
NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID= YOUR PROJECT ID
```
If using the react-app template your `.env` file should look like this 👇 on the nextjs template

```bash
VITE_WALLET_CONNECT_PROJECT_ID= YOUR PROJECT ID
```

- Start up the local server using the below command.

```shell
npm run dev 
```

## !Note
Detailed setup guide can be found in the readme of the individual template.

<div align="right">
    <a href="#cartdevkit-cli">Back to Top</a>
</div>

## Supported Templates
- Backend (JavaScript, TypeScript)
- Frontend (React, NestJS, Sundo Console)
- Cartesify (Backend and Frontend)
<!-- - Mobile (React Native with Expo and without Expo, Flutter) -->


## Template Documentation
Checkout the individual docs to learn more about the template.

### Backend Templates:

CartdevKit supports backend templates in various programming languages, including;

- [JavaScript Template](/apps/backend/js-template/README.md), 
- [TypeScript Template](/apps/backend/ts-template/README.md). 

Each backend template comes with a basic project structure and configuration files. 


### Frontend Templates

Frontend templates are available for popular frameworks such as 
- [React App Template](./apps/frontend/react-app/README.md), 
- [NestJS Template](./apps/frontend/next-app/README.md), and 
- [Sundo Console](https://github.com/Mugen-Builders/sunodo-frontend-console). 

These templates include components, routing, and styling to kickstart front-end development.


### Cartesify Templates
Cartesify templates integrate the Cartesi platform for both backend and frontend development. These templates enable developers to build scalable and secure applications using Cartesi's REST API technology.

The Cartesify template has support for both backend and frontend integration.

- **Frontend** : [React App Template](/apps/cartesify/frontend/react-app/README.md), [Nextjs App Template](/apps/cartesify/frontend/next-app/README.md)
- **Backend** : [Javascript Template](/apps/cartesify/backend/js-template/README.md), [Typescript Template](/apps/backend/ts-template/README.md)

<!-- ### Mobile Templates
CartesiKit offers templates for mobile app development using React Native (with and without Expo) and Flutter. These templates include navigation, state management, and UI components for building cross-platform mobile applications utilizing Cartesi's Rollup features. -->


<div align="right">
    <a href="#cartdevkit-cli">Back to Top</a>
</div>

## Built With
- Cartesi Rollup
- Cartesi CLI
- Deroll/Cartesi Wallet
- Deroll/Cartesi Router
- Cartesify
- Node and Yarn Packages
- Figlet, fs-extra,inquirer, path
  shelljs, child_process,commander
- React
- Nextjs
- JavaScript
- TypeScript

## Official CartDevKit Documentaion
To read a more comprehensive version of this doc visit [here](https://africlab.gitbook.io/cartdevkit)

# Video Tutorials
Check out this [playlist](https://www.youtube.com/playlist?list=PLvrAcVH0nwP8EyBrIwdL5wC6PZwPy6vXE) to get started using the CLI tool.

## Additional Helpful Resources
- [Cartesi Doc](https://docs.cartesi.io)
- [Sunodo](https://docs.sunodo.io/)
- [Cartesi Router](https://github.com/jjhbk/cartesi-router/tree/main)
- [Cartesi Wallet](https://github.com/jjhbk/cartesi-wallet)
- [React Vite](https://vitejs.dev/guide/)
- [Nextjs](https://nextjs.org/docs)

## Contact & Support
Join the Cartesi [Discord](https://discord.com/invite/pfXMwXDDfW) server. You can also connect with the team here [@africinnovate](https://twitter.com/africinnovate)

## Roadmap
See the open issues for a full list of proposed features (and known issues).


## Contributing
We welcome contributions from the community.

## LICENSE
CartdevKit is licensed under the Apache License. Refer to the [LICENSE](https://github.com/gconnect/cartdev-kit/blob/master/LICENSE) file for more details

<div align="right">
    <a href="#cartdevkit-cli">Back to Top</a>
</div>



