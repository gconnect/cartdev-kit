const { AdvanceRoute, DefaultRoute } = require("cartesi-router");
const { Error_out, Output, Notice } = require("cartesi-wallet");
const { CreateGreeting } = require("./greetings");

class CreateGreetingRoute extends AdvanceRoute {
  constructor(greeting) {
    super();
    this.greeting = greeting;
  }

  _parse_request(request) {
    this.parse_request(request);
  }

  execute = (request) => {
    this._parse_request(request);
    try {
      return this.greeting.create(
        this.msg_sender,
        this.request_args.message
      );
    } catch (error) {
      const error_msg = `Failed to create message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class UpdateGreetingRoute extends AdvanceRoute {
  constructor(greeting) {
    super();
    this.greeting = greeting;
  }

  _parse_request(request) {
    this.parse_request(request);
  }

  execute = (request) => {
    this._parse_request(request);
    try {
      return this.greeting.updateGreeting(
        parseInt(this.request_args.greetingId),
        this.request_args.message
      );
    } catch (error) {
      const error_msg = `Failed to update message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class DeleteGreetingRoute extends AdvanceRoute {
  constructor(greeting) {
    super();
    this.greeting = greeting;
  }

  _parse_request(request) {
    this.parse_request(request);
  }

  execute = (request) => {
    this._parse_request(request);
    try {
      return this.greeting.deleteGreeting(
        parseInt(this.request_args.greetingId)
      );
    } catch (error) {
      const error_msg = `Failed to delete message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class DeleteGreetingsRoute extends AdvanceRoute {
  constructor(greeting) {
    super();
    this.greeting = greeting;
  }

  _parse_request(request) {
    this.parse_request(request);
  }

  execute = (request) => {
    this._parse_request(request);
    try {
      return this.greeting.deleteGreetings();
    } catch (error) {
      const error_msg = `Failed to delete message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class InspectRoute extends DefaultRoute {
  constructor(greeting) {
    super();
    this.greeting = greeting;
  }
}

class GreetingsRoute extends InspectRoute {
  execute = (request) => {
    return this.greeting.getGreetings();
  };
}

class GreetingRoute extends InspectRoute {
  execute = (request) => {
    return this.greeting.getGreeting(parseInt(request));
  };
}

module.exports = {
  CreateGreetingRoute,
  GreetingsRoute,
  GreetingRoute,
  UpdateGreetingRoute,
  DeleteGreetingRoute,
  DeleteGreetingsRoute
};
