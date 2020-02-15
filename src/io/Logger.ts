export default class Logger {
  static info(information: string) {
    console.log(`[INFO]: ${information}`);
  }

  static error(error: string) {
    console.error(`[ERR]: ${error}`);
  }

  static warning(warning: string) {
    console.log(`[WARN]: ${warning}`.yellow);
  }

  static space() {
    console.log();
    console.log('-------------------'.gray);
    console.log();
  }
}
