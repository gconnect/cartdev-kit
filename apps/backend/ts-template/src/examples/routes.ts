import { AdvanceRoute, DefaultRoute, WalletRoute } from "cartesi-router";
import { Error_out, Output, Report, Notice, Wallet } from "cartesi-wallet";

import { CreateGreeting } from "./greetings"


class CreateGreetingRoute extends AdvanceRoute {
  greeting: CreateGreeting
  constructor(greeting: CreateGreeting){
    super();
    this.greeting = greeting
  }
  _parse_request(request: any) {
    this.parse_request(request);
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      return this.greeting.create(
        this.msg_sender,
        this.request_args.message,
      )    
    }catch(error){
      const error_msg = `Failed to create message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class UpdateGreetingRoute extends AdvanceRoute {
  greeting: CreateGreeting
  constructor(greeting: CreateGreeting){
    super();
    this.greeting = greeting
  }
  _parse_request(request: any) {
    this.parse_request(request);
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      return this.greeting.updateGreeting(
        parseInt(this.request_args.greetingId),
        this.request_args.message,
      )    
    }catch(error){
      const error_msg = `Failed to update message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class DeleteGreetingRoute extends AdvanceRoute {
  greeting: CreateGreeting
  constructor(greeting: CreateGreeting){
    super();
    this.greeting = greeting
  }
  _parse_request(request: any) {
    this.parse_request(request);
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      return this.greeting.deleteGreeting(
        parseInt(this.request_args.greetingId),
      )    
    }catch(error){
      const error_msg = `Failed to delete message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class DeleteGreetingsRoute extends AdvanceRoute {
  greeting: CreateGreeting
  constructor(greeting: CreateGreeting){
    super();
    this.greeting = greeting
  }
  _parse_request(request: any) {
    this.parse_request(request);
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      return this.greeting.deleteGreetings()    
    }catch(error){
      const error_msg = `Failed to delete message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class InspectRoute extends DefaultRoute {
  greeting: CreateGreeting
  constructor(greeting: CreateGreeting) {
    super();
    this.greeting = greeting;
  }
}

class GreetingsRoute extends InspectRoute {
    execute = (request: any): Output => {
    return this.greeting.getGreetings();
  };
}

class GreetingRoute extends InspectRoute {
  execute = (request: any): Output => {
    return this.greeting.getGreeting(parseInt(<string>request));
  };
}

export { 
  CreateGreetingRoute, 
  GreetingsRoute, 
  GreetingRoute, 
  UpdateGreetingRoute, 
  DeleteGreetingRoute, 
  DeleteGreetingsRoute 
}