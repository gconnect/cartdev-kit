import {  Notice, Error_out, Log, Wallet, Output } from "cartesi-wallet";
import { Router } from "cartesi-router";
import { getAddress } from "viem";
const wallet = new Wallet(new Map());
const router = new Router(wallet);

class Greeting {
  static nextId = 0
  id: number
  creatorAddress: string
  message: string
  constructor(
    creatorAddres: string,
    message: string,
   ){

    this.id = Greeting.nextId++
    this.creatorAddress = creatorAddres
    this.message = message
  }

}
class CreateGreeting {
    greetings: Greeting[]
    constructor(){
      this.greetings = []
    }
    create(creatorAddress: string, message: string) {
      try{
        const greeting = new Greeting(
          creatorAddress, 
          message
        )
        this.greetings.push(greeting)
        let greeting_json = JSON.stringify(greeting);
        const notice_payload = `{{"type":"add_message","content":${greeting_json}}}`;
        console.log(
          `Hello ${greeting.message} created by ${greeting.creatorAddress}}`
        );
        return new Notice(notice_payload);
        }catch(error){
        const error_msg = `Failed to create Greeting ${error}`;
        console.debug(error_msg);
        return new Error_out(error_msg);
        }
    }
 
    getGreeting(greeting_id: number){
      try{
        let greeting_json = JSON.stringify(this.greetings[greeting_id]);
        console.log("Greeting", greeting_json)
        return new Log(greeting_json);
      }catch(error){
        return new Error_out(`Greeting id ${greeting_id} not found`);
      }
    }

    getGreetings(){
      try{
        let greetings_json = JSON.stringify(this.greetings);
        console.log("Greetings", greetings_json)
        return new Log(greetings_json)
      }catch(error){
        return new Error_out(`Greetings not found`);
      }
    }

    updateGreeting(greeting_id: number, message: string) {
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
  
    deleteGreeting(greeting_id: number) {
      try {
        const index = this.greetings.findIndex(greet => greet.id === greeting_id);
        if (index === -1) {
          throw new Error(`Greeting not found`);;
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

    deleteGreetings(){
      try{
        const deletedCount = this.greetings.length;
        this.greetings.length = 0;
        const notice_payload = `Deleted ${deletedCount} Greeetings`;
        return new Notice(notice_payload);
      }catch(error){
        return new Error_out(`Greetings not found`);
      }
    }

}

export { CreateGreeting, Greeting }