import {Provider} from '@loopback/core';
import {HandlerContext, Reject} from '@loopback/rest';

export class CustomRejectProvider implements Provider<Reject> {
  constructor(
    //@inject('customErrors') public errors: Array<Object>,
    // @inject('customErrorCode') public stathsCode: number,
  ) { }

  value() {
    // Use the lambda syntax to preserve the "this" scope for future calls!
    console.log("test1");
    return (response: HandlerContext, result: Error) => {
      this.action(response, result);
    };
  }

  action({request, response}: HandlerContext, error: Error) {
    // handle the error and send back the error response
    // "response" is an Express Response object
    console.log("test2");
    if (error) {
      console.log(error);
      error.message = 'Message: my error';
      error.name = 'Name: some error';
      //const headers = (request.headers as any) || {};
      //const header = headers.accept || 'application/json';
      //response.setHeader('Content-Type', header);
      response.status(400).send(null);

    } else {
      console.log("test4");
      response.end(response);
    }
  }
}
