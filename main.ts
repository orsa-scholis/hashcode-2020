import { InputFile } from "./src/io/InputFile";
import { OutputFile } from './src/io/OutputFile';
import 'colors';
import { Core } from './src/core/Core';
import Logger from './src/io/Logger';
import * as inquirer from 'inquirer';
import { HashcodeFile } from './src/io/HashcodeFile';
import { first, map, filter } from 'lodash';

class Hashcode2020 {
  constructor(private fileName: string) {
  }

  async run() {
    const input = await this.read();
    this.write(new Core(input).compute());
  }

  private async read() {
    const file = new InputFile(this.getInputFileName());
    return await file.read();
  }

  private async write(output: string) {
    const file = new OutputFile(this.getOutputFileName());
    await file.write(output);
  }

  private getInputFileName() {
    return `${this.fileName}.in`;
  }

  private getOutputFileName() {
    return `${this.fileName}.out`;
  }
}

const promptFiles = async () => {
  const fileArgs = filter(process.argv, (arg: string) => /^(.+).in$/.test(arg));
  if (fileArgs) {
    return map(fileArgs, arg => arg.match(/^(.+).in$/)[1]);
  }

  const files = await HashcodeFile.glob('data/*.in');

  const name = 'dataSet';
  const allFiles = 'All files';
  const answer = await inquirer.prompt([{
    choices: [allFiles, ...files],
    type: 'list',
    name: name,
    message: 'Which data set do you want to include?'
  }]);

  let selected = [answer[name]];
  if (first(selected) == allFiles) {
    selected = files;
  }

  return map(selected, selection => selection.match(/^data\/(.+).in$/)[1]);
};

promptFiles()
  .then(fileNames => {
    fileNames.forEach(fileName => new Hashcode2020(fileName).run().catch(Logger.error));
  })
  .catch(Logger.error);
