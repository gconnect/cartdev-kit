---
description: 'Here are some examples of common usage scenarios:'
---

# Basic Usage Example

To create a new project, run this command



### Installation Guide

```
npx cartdevkit@latest create mydapp
```

You should see something like this&#x20;

<figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption><p>cli output</p></figcaption></figure>

Replace mydapp with the desired name of your project. This command will prompt you to select a template and configure the project settings.

### CLI Options:

View available command-line options and flags by running

```
cartdevkit --help
```

### Backend Setup

To setup your backend here are the required steps:

* Navigate to the backend directory of your created project and run the below command, keep in mind also ensure your [docker](https://docs.docker.com/engine/install/) is all setup up and running.
* Install all required dependencies using either `yarn install` or `npm i`

### !NOTE

To build and run the backend ensure that you have [Cartesi CLI](https://docs.sunodo.io/guide/introduction/installing) is installed and your docker is up and running. For debugging purpose, you can run cartesi doctor.

*   Build the project by running the below command;

    ```
      cartesi build
    ```

This will help build the image and run the Cartesi machine. Once this step is completed you should see something like this

<figure><img src="../.gitbook/assets/image (5).png" alt=""><figcaption></figcaption></figure>

The next step will be to start the local backend server by running

```
  cartesi run
```

If all goes well you should see this

<figure><img src="../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

### Debugging

For quick troubleshooting incase you run into any issue you can quickly check the status using

```
cartesi doctor
```

This will start the development server

### Frontend Setup

If you are working on the frontend, here are the required steps:

* Navigate into the frontend project directory
* Install all required dependencies using either `npm i` or `yarn install`

#### !NOTE

Once you generate the frontend template, ensure to create a `.env` file and provide your project Id as it's an important requirement when working with Rainbowkit and Wagmi.

Your `.env` file should look like this 👇 on the nextjs template

```
NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID= YOUR PROJECT ID
```

If using the react-app template your `.env` file should look like this 👇 on the nextjs template

```
VITE_WALLET_CONNECT_PROJECT_ID= YOUR PROJECT ID
```

* Start up the local server using the below command.

```
npm run dev 
```

### !Note

A detailed setup guide can be found in the readme of the individual selected template.
