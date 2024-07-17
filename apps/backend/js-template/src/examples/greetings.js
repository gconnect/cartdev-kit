const { Notice, Error_out, Log, Wallet } = require("cartesi-wallet");
const { Router } = require("cartesi-router");

const wallet = new Wallet(new Map());
const router = new Router(wallet);

class Greeting {
  static nextId = 0;

  constructor(creatorAddress, message) {
    this.id = Greeting.nextId++;
    this.creatorAddress = creatorAddress;
    this.message = message;
  }
}

class CreateGreeting {
  constructor() {
    this.greetings = [];
  }

  create(creatorAddress, message) {
    try {
      const greeting = new Greeting(creatorAddress, message);
      this.greetings.push(greeting);
      let greeting_json = JSON.stringify(greeting);
      const notice_payload = `{{"type":"add_message","content":${greeting_json}}}`;
      console.log(`Hello ${greeting.message} created by ${greeting.creatorAddress}`);
      return new Notice(notice_payload);
    } catch (error) {
      const error_msg = `Failed to create Greeting ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  }

  getGreeting(greeting_id) {
    try {
      let greeting_json = JSON.stringify(this.greetings[greeting_id]);
      console.log("Greeting", greeting_json);
      return new Log(greeting_json);
    } catch (error) {
      return new Error_out(`Greeting id ${greeting_id} not found`);
    }
  }

  getGreetings() {
    try {
      let greetings_json = JSON.stringify(this.greetings);
      console.log("Greetings", greetings_json);
      return new Log(greetings_json);
    } catch (error) {
      return new Error_out(`Greetings not found`);
    }
  }

  updateGreeting(greeting_id, message) {
    try {
        // Find the greeting by its id
        const updateItem = this.greetings.find(greet => greet.id === greeting_id);
        
        if (!updateItem) {
            throw new Error(`Greeting id ${greeting_id} not found`);
        }
        
        // Update the message
        updateItem.message = message;
        
        // Create the payload
        let greeting_json = JSON.stringify(updateItem);
        const notice_payload = `{{"type":"update_greeting","content":${greeting_json}}}`;
        
        console.log("Updating Greeting:", greeting_json);
        return new Notice(notice_payload);
    } catch (error) {
        return new Error_out(`Greeting id ${greeting_id} not found`);
    }
}


  deleteGreeting(greeting_id) {
    try {
      const index = this.greetings.findIndex(greet => greet.id === greeting_id);
      if (index === -1) {
        throw new Error(`Greeting not found`);
      }
      this.greetings = this.greetings.filter(greet => greet.id !== greeting_id);

      // Remove the greeting from the array
      let greeting_json = JSON.stringify(index);
      let remainingGreeting_json = JSON.stringify(this.greetings);
      console.log("Deleting Greeting:", greeting_json);
      // return new Log(`Greeting with ID ${greeting_id} has been deleted: ${greeting_json}`);
      const notice_payload = `{{"type":"delete_greeting","content":${greeting_json}, ${remainingGreeting_json}}}`;
      return new Notice(notice_payload);
    } catch (error) {
      return new Error_out(`Greeting id ${greeting_id} not found`);
    }
  }

  deleteGreetings() {
    try {
      const deletedCount = this.greetings.length;
      this.greetings.length = 0;
      const notice_payload = `Deleted ${deletedCount} Greeetings`;
      return new Notice(notice_payload);
    } catch (error) {
      return new Error_out(`Greetings not found`);
    }
  }
}

module.exports = { CreateGreeting, Greeting };
