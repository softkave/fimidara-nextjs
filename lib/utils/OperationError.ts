export interface IOperationErrorParameters {
  message?: string;
  field?: string;
  action?: string;
  value?: any;
}

class OperationError extends Error {
  message: string = "Error";
  field?: string;
  action?: string;
  value?: string;

  constructor(props: IOperationErrorParameters = {}) {
    super(props.message);

    // error data path
    this.field = props.field;

    // recommended action for the client
    this.action = props.action;

    if (props.value) {
      this.value = JSON.stringify(props.value);
    }
  }
}

export default OperationError;
